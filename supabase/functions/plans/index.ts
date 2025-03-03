import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { Pool } from 'https://deno.land/x/postgres@v0.17.0/mod.ts';
import { corsHeaders } from '../_shared/cors.ts';

// Get Railway PostgreSQL connection string from environment variable
const connectionString = Deno.env.get('DATABASE_URL');

if (!connectionString) {
  console.error('DATABASE_URL environment variable not set');
}

// Initialize the Postgres client
const pool = new Pool(connectionString, 3);

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Connect to the database
    const connection = await pool.connect();
    
    try {
      // Get all active plans ordered by price
      const result = await connection.queryObject(`
        SELECT 
          id, 
          name, 
          description, 
          price, 
          interval,
          stripe_product_id,
          stripe_price_id,
          features
        FROM 
          plans 
        WHERE 
          active = true 
        ORDER BY 
          price
      `);
      
      // Format the response to match what the frontend expects
      const formattedPlans = result.rows.map((plan) => ({
        ...plan,
        // Convert price from decimal to cents for frontend
        amount: plan.price === 0 ? 0 : Math.round(plan.price * 100),
        currency: 'usd',
        // Parse features if it's a string
        features: typeof plan.features === 'string' 
          ? JSON.parse(plan.features) 
          : plan.features
      }));
      
      // Return the plans as JSON
      return new Response(
        JSON.stringify(formattedPlans),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
          status: 200,
        },
      );
    } finally {
      // Release the connection back to the pool
      connection.release();
    }
  } catch (error) {
    console.error('Error:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500,
      },
    );
  }
});
