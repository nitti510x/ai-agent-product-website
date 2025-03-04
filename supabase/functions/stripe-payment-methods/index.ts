// supabase/functions/stripe-payment-methods/index.ts
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
    
    // GET request to fetch payment methods
    if (req.method === 'GET') {
      const url = new URL(req.url)
      // Use the authenticated user ID from the token instead of query param
      const userId = user.id
      
      // Get customer
      console.log('Fetching customer for user:', userId)
      const { data: customer, error: customerError } = await supabase
        .from('stripe_customers')
        .select('stripe_customer_id')
        .eq('user_id', userId)
        .single()
      
      if (customerError) {
        console.error('Error fetching customer:', customerError)
        
        // If the customer doesn't exist, return an empty array instead of an error
        if (customerError.code === 'PGRST116') {
          console.log('No customer found, returning empty payment methods array')
          return new Response(
            JSON.stringify([]),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        
        return new Response(
          JSON.stringify({ error: 'Error fetching customer: ' + customerError.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }
      
      if (!customer) {
        console.log('No customer found for user:', userId)
        return new Response(
          JSON.stringify([]),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      console.log('Found customer:', customer.stripe_customer_id)
      
      try {
        // Get payment methods
        console.log('Fetching payment methods from Stripe')
        const paymentMethods = await stripe.paymentMethods.list({
          customer: customer.stripe_customer_id,
          type: 'card',
        })
        
        // Get stored payment methods
        console.log('Fetching stored payment methods from database')
        const { data: storedPaymentMethods, error: storedError } = await supabase
          .from('payment_methods')
          .select('*')
          .eq('user_id', userId)
        
        if (storedError) {
          console.error('Error fetching stored payment methods:', storedError)
          // Continue anyway, just use Stripe data
        }
        
        // Combine data
        const result = paymentMethods.data.map(pm => {
          const stored = storedPaymentMethods?.find(s => s.stripe_payment_method_id === pm.id)
          return {
            id: pm.id,
            card: pm.card,
            is_default: stored?.is_default || false,
            created_at: stored?.created_at || new Date().toISOString()
          }
        })
        
        console.log('Returning payment methods:', result.length)
        return new Response(
          JSON.stringify(result),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } catch (stripeError) {
        console.error('Error fetching payment methods from Stripe:', stripeError)
        return new Response(
          JSON.stringify({ 
            error: 'Error fetching payment methods from Stripe', 
            details: stripeError.message 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }
    }
    
    // POST request to create/attach a payment method
    if (req.method === 'POST') {
      const { paymentMethodId } = await req.json()
      const userId = user.id
      
      if (!paymentMethodId) {
        return new Response(
          JSON.stringify({ error: 'Payment method ID is required' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }
      
      // Get customer
      let { data: customer, error: customerError } = await supabase
        .from('stripe_customers')
        .select('stripe_customer_id')
        .eq('user_id', userId)
        .single()
      
      if (customerError) {
        console.error('Error fetching customer:', customerError)
        
        // If no customer exists, create one
        if (customerError.code === 'PGRST116') {
          console.log('No customer found, creating one...')
          
          // Create customer in Stripe
          const userName = user.user_metadata?.full_name || user.email || 'Customer'
          const stripeCustomer = await stripe.customers.create({
            email: user.email,
            name: userName,
            metadata: {
              user_id: userId
            }
          })
          
          // Save customer to database
          const { data: newCustomer, error: createError } = await supabase
            .from('stripe_customers')
            .insert({
              user_id: userId,
              stripe_customer_id: stripeCustomer.id,
              email: user.email,
              name: userName
            })
            .select()
            .single()
          
          if (createError) {
            console.error('Error creating customer:', createError)
            return new Response(
              JSON.stringify({ error: 'Error creating customer: ' + createError.message }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
            )
          }
          
          // Use the newly created customer
          customer = newCustomer
        } else {
          return new Response(
            JSON.stringify({ error: 'Error fetching customer: ' + customerError.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        }
      }
      
      if (!customer) {
        return new Response(
          JSON.stringify({ error: 'Customer not found' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        )
      }
      
      // Attach payment method to customer
      try {
        console.log(`Attaching payment method ${paymentMethodId} to customer ${customer.stripe_customer_id}`)
        await stripe.paymentMethods.attach(paymentMethodId, {
          customer: customer.stripe_customer_id,
        })
        
        // Get payment method details
        console.log(`Retrieving payment method details for ${paymentMethodId}`)
        const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId)
        
        // Save payment method to database
        console.log(`Saving payment method to database for user ${userId}`)
        const { data, error } = await supabase
          .from('payment_methods')
          .insert({
            user_id: userId,
            stripe_payment_method_id: paymentMethodId,
            is_default: true, // Make this the default
            card_brand: paymentMethod.card?.brand,
            card_last4: paymentMethod.card?.last4,
            card_exp_month: paymentMethod.card?.exp_month,
            card_exp_year: paymentMethod.card?.exp_year
          })
          .select()
          .single()
        
        if (error) {
          console.error('Error saving payment method to database:', error)
          // Continue anyway, the payment method is attached in Stripe
        }
        
        // Update other payment methods to not be default
        console.log(`Updating other payment methods to not be default for user ${userId}`)
        await supabase
          .from('payment_methods')
          .update({ is_default: false })
          .eq('user_id', userId)
          .neq('stripe_payment_method_id', paymentMethodId)
        
        return new Response(
          JSON.stringify({
            id: paymentMethodId,
            card: paymentMethod.card,
            is_default: true,
            created_at: new Date().toISOString()
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } catch (stripeError) {
        console.error('Error in Stripe operation:', stripeError)
        
        // Check for specific Stripe errors
        if (stripeError.type === 'StripeCardError') {
          return new Response(
            JSON.stringify({ 
              error: 'Card error', 
              details: stripeError.message,
              code: stripeError.code 
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        } else if (stripeError.type === 'StripeInvalidRequestError') {
          // This could happen if the payment method ID is invalid or already attached
          return new Response(
            JSON.stringify({ 
              error: 'Invalid request to Stripe', 
              details: stripeError.message,
              code: stripeError.code
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        } else {
          return new Response(
            JSON.stringify({ 
              error: 'Stripe error', 
              details: stripeError.message,
              type: stripeError.type
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        }
      }
    }
    
    // DELETE request to remove a payment method
    if (req.method === 'DELETE') {
      const url = new URL(req.url)
      const paymentMethodId = url.pathname.split('/').pop()
      const userId = user.id
      
      if (!paymentMethodId) {
        return new Response(
          JSON.stringify({ error: 'Payment method ID is required' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }
      
      // Delete from Stripe
      await stripe.paymentMethods.detach(paymentMethodId)
      
      // Delete from database
      await supabase
        .from('payment_methods')
        .delete()
        .eq('stripe_payment_method_id', paymentMethodId)
        .eq('user_id', userId)
      
      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
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
