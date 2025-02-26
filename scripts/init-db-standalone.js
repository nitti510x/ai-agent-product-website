import pg from 'pg';
const { Pool } = pg;

// PostgreSQL connection configuration
const pool = new Pool({
  user: 'postgres',
  host: 'metro.proxy.rlwy.net',
  database: 'railway',
  password: 'QZLxtAAYlkHPKWcXwbRGlrJpWjuvfEan',
  port: 44666,
  ssl: {
    rejectUnauthorized: false // Required for Railway PostgreSQL
  }
});

// Helper function to execute SQL queries
const executeQuery = async (text, params = []) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('Error executing query', { text, error });
    throw error;
  }
};

// Initialize the database tables
async function initializeTables() {
  try {
    console.log('Creating plans table...');
    // Create plans table if it doesn't exist
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS plans (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        interval VARCHAR(20) NOT NULL,
        features JSONB,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    console.log('Creating subscriptions table...');
    // Create subscriptions table if it doesn't exist
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL,
        plan_id VARCHAR(50) NOT NULL REFERENCES plans(id),
        status VARCHAR(20) NOT NULL,
        current_period_start TIMESTAMP WITH TIME ZONE,
        current_period_end TIMESTAMP WITH TIME ZONE,
        cancel_at_period_end BOOLEAN DEFAULT false,
        metadata JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    console.log('Creating subscription_events table...');
    // Create subscription_events table if it doesn't exist
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS subscription_events (
        id SERIAL PRIMARY KEY,
        subscription_id INTEGER NOT NULL REFERENCES subscriptions(id),
        event_type VARCHAR(50) NOT NULL,
        metadata JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    console.log('Checking if plans exist...');
    // Insert default plans if they don't exist
    const plansExist = await executeQuery(`SELECT COUNT(*) FROM plans`);
    if (parseInt(plansExist.rows[0].count) === 0) {
      console.log('Inserting default plans...');
      await executeQuery(`
        INSERT INTO plans (id, name, description, price, interval, features)
        VALUES 
          ('basic', 'Basic Plan', 'Essential features for individuals', 9.99, 'month', 
            '{"feature_limits": {"agents": 2, "requests": 100, "channels": 5}}'::jsonb),
          ('pro', 'Professional Plan', 'Advanced features for professionals', 19.99, 'month', 
            '{"feature_limits": {"agents": 5, "requests": 500, "channels": 15}}'::jsonb),
          ('enterprise', 'Enterprise Plan', 'Full access for teams', 49.99, 'month', 
            '{"feature_limits": {"agents": 20, "requests": 2000, "channels": "Unlimited"}}'::jsonb)
      `);
    }

    console.log('Database tables initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database tables:', error);
    return false;
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the initialization
console.log('Starting database initialization...');
initializeTables()
  .then(() => {
    console.log('Database initialization completed!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Error during database initialization:', error);
    process.exit(1);
  });
