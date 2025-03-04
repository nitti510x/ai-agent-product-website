// supabase/functions/stripe-customers/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@11.1.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('APP_SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('APP_SUPABASE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Create Stripe client
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2022-11-15',
    })
    
    // Verify authentication
    console.log('Request headers:', Object.fromEntries(req.headers.entries()))
    const authHeader = req.headers.get('Authorization')
    console.log('Auth header:', authHeader ? `${authHeader.substring(0, 15)}...` : 'missing')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Missing or invalid authorization header')
      return new Response(
        JSON.stringify({ error: 'Missing or invalid authorization header' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }
    
    // Extract the JWT token
    const token = authHeader.split(' ')[1]
    console.log('Token exists:', !!token)
    
    // Verify the token and get the user
    console.log('Verifying token...')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError) {
      console.error('Auth error:', authError)
      return new Response(
        JSON.stringify({ error: 'User not authenticated', details: authError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }
    
    if (!user) {
      console.error('No user found from token')
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }
    
    console.log('Authenticated user:', user.id)
    
    // First check if required tables exist
    try {
      // Check if stripe_customers table exists by doing a simple query
      const { data: tableCheck, error: tableError } = await supabase
        .from('stripe_customers')
        .select('count', { count: 'exact', head: true })
      
      if (tableError) {
        console.error('Database table error:', tableError)
        return new Response(
          JSON.stringify({ 
            error: 'Database setup incomplete', 
            details: 'The required database tables do not exist. Please run the migration script.' 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }
    } catch (tableCheckError) {
      console.error('Error checking tables:', tableCheckError)
      return new Response(
        JSON.stringify({ 
          error: 'Database setup incomplete', 
          details: 'The required database tables do not exist. Please run the migration script.' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }
    
    // GET request to fetch a customer
    if (req.method === 'GET') {
      // Use the authenticated user ID from the token
      const userId = user.id
      
      // Check if customer exists
      console.log('Checking if customer exists for user:', userId)
      const { data: customer, error } = await supabase
        .from('stripe_customers')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (error && error.code !== 'PGRST116') {
        console.error('Database error:', error)
        return new Response(
          JSON.stringify({ error: error.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }
      
      if (!customer) {
        console.log('No customer found for user:', userId)
        return new Response(
          JSON.stringify({ error: 'Customer not found', code: 'CUSTOMER_NOT_FOUND' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        )
      }
      
      console.log('Found customer:', customer.stripe_customer_id)
      return new Response(
        JSON.stringify(customer),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // POST request to create a customer
    if (req.method === 'POST') {
      // Use the authenticated user ID from the token
      const userId = user.id
      
      // Check if customer already exists
      console.log('Checking if customer already exists for user:', userId)
      const { data: existingCustomer, error: existingError } = await supabase
        .from('stripe_customers')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (existingError && existingError.code !== 'PGRST116') {
        console.error('Error checking for existing customer:', existingError)
        return new Response(
          JSON.stringify({ error: existingError.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }
      
      if (existingCustomer) {
        console.log('Customer already exists:', existingCustomer.stripe_customer_id)
        return new Response(
          JSON.stringify(existingCustomer),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      // Get user metadata directly from the user object
      const userName = user.user_metadata?.full_name || user.email || 'Customer'
      
      try {
        // Create customer in Stripe
        console.log('Creating Stripe customer for user:', userId)
        const customer = await stripe.customers.create({
          email: user.email,
          name: userName,
          metadata: {
            user_id: userId
          }
        })
        
        console.log('Stripe customer created:', customer.id)
        
        // Save customer to database
        console.log('Saving customer to database')
        const { data, error } = await supabase
          .from('stripe_customers')
          .insert({
            user_id: userId,
            stripe_customer_id: customer.id,
            email: customer.email,
            name: customer.name
          })
          .select()
          .single()
        
        if (error) {
          console.error('Error saving customer to database:', error)
          return new Response(
            JSON.stringify({ 
              error: error.message,
              note: 'Customer was created in Stripe but could not be saved to the database'
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        }
        
        console.log('Customer saved to database:', data.id)
        return new Response(
          JSON.stringify(data),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } catch (stripeError) {
        console.error('Error creating Stripe customer:', stripeError)
        return new Response(
          JSON.stringify({ error: 'Error creating Stripe customer: ' + stripeError.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }
    }
    
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 }
    )
  } catch (error) {
    console.error('Error in edge function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
