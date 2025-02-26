import pg from 'pg';
const { Pool } = pg;

// PostgreSQL connection configuration
const pool = new Pool({
  user: process.env.POSTGRES_USER || 'postgres',
  host: process.env.POSTGRES_HOST || 'metro.proxy.rlwy.net',
  database: process.env.POSTGRES_DB || 'railway',
  password: process.env.POSTGRES_PASSWORD || 'QZLxtAAYlkHPKWcXwbRGlrJpWjuvfEan',
  port: process.env.POSTGRES_PORT || 44666,
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
    console.log('Executed query', { text: text.substring(0, 50) + '...', duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('Error executing query', { text: text.substring(0, 50) + '...', error });
    throw error;
  }
};

// Initialize the token management tables
async function initializeTokenManagement() {
  try {
    console.log('Creating user_tokens table...');
    // Create user_tokens table if it doesn't exist
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS user_tokens (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL UNIQUE,
        balance INTEGER NOT NULL DEFAULT 0,
        last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    console.log('Creating token_transactions table...');
    // Create token_transactions table if it doesn't exist
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS token_transactions (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL,
        amount INTEGER NOT NULL,
        transaction_type VARCHAR(20) NOT NULL,
        description TEXT,
        metadata JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        CONSTRAINT valid_transaction_type CHECK (
          transaction_type IN ('purchase', 'usage', 'refund', 'subscription_grant')
        )
      );
    `);

    console.log('Creating token_packages table...');
    // Create token_packages table if it doesn't exist
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS token_packages (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        token_amount INTEGER NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    console.log('Checking if token_packages exist...');
    // Insert default token packages if they don't exist
    const packagesExist = await executeQuery(`SELECT COUNT(*) FROM token_packages`);
    if (parseInt(packagesExist.rows[0].count) === 0) {
      console.log('Inserting default token packages...');
      await executeQuery(`
        INSERT INTO token_packages (id, name, description, token_amount, price)
        VALUES
          ('small', 'Small Token Pack', '1,000 additional tokens', 1000, 4.99),
          ('medium', 'Medium Token Pack', '5,000 additional tokens', 5000, 19.99),
          ('large', 'Large Token Pack', '15,000 additional tokens', 15000, 49.99)
      `);
    }

    console.log('Updating plans table with token limits...');
    // Update existing plans to include token limits if not already present
    const plansResult = await executeQuery(`SELECT id, features FROM plans`);
    for (const plan of plansResult.rows) {
      let features = plan.features || {};
      
      // Check if features is a string (JSON) and parse it
      if (typeof features === 'string') {
        features = JSON.parse(features);
      }
      
      // Add token limits if not present
      if (!features.feature_limits || !features.feature_limits.tokens) {
        if (!features.feature_limits) {
          features.feature_limits = {};
        }
        
        // Set token limits based on plan
        switch (plan.id) {
          case 'basic':
            features.feature_limits.tokens = 1000;
            break;
          case 'pro':
            features.feature_limits.tokens = 5000;
            break;
          case 'enterprise':
            features.feature_limits.tokens = 20000;
            break;
          default:
            features.feature_limits.tokens = 1000;
        }
        
        // Update the plan with the new features
        await executeQuery(
          `UPDATE plans SET features = $1 WHERE id = $2`,
          [features, plan.id]
        );
        console.log(`Updated token limits for plan: ${plan.id}`);
      }
    }

    console.log('Creating indexes for better performance...');
    // Create indexes for better performance
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_user_tokens_user_id ON user_tokens(user_id)`);
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_token_transactions_user_id ON token_transactions(user_id)`);
    await executeQuery(`CREATE INDEX IF NOT EXISTS idx_token_transactions_created_at ON token_transactions(created_at DESC)`);

    console.log('Token management tables initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing token management tables:', error);
    return false;
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the initialization
console.log('Starting token management initialization...');
initializeTokenManagement()
  .then(() => {
    console.log('Token management initialization completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Token management initialization failed:', error);
    process.exit(1);
  });
