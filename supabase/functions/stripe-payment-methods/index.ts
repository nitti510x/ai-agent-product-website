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
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Create Stripe client
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2022-11-15',
    })
    
    // GET request to fetch payment methods
    if (req.method === 'GET') {
      const url = new URL(req.url)
      const userId = url.searchParams.get('userId')
      
      if (!userId) {
        return new Response(
          JSON.stringify({ error: 'User ID is required' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }
      
      // Get customer
      const { data: customer } = await supabase
        .from('stripe_customers')
        .select('stripe_customer_id')
        .eq('user_id', userId)
        .single()
      
      if (!customer) {
        return new Response(
          JSON.stringify({ error: 'Customer not found' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        )
      }
      
      // Get payment methods
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customer.stripe_customer_id,
        type: 'card',
      })
      
      // Get stored payment methods
      const { data: storedPaymentMethods } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', userId)
      
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
      
      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // POST request to create/attach a payment method
    if (req.method === 'POST') {
      const { userId, paymentMethodId } = await req.json()
      
      if (!userId || !paymentMethodId) {
        return new Response(
          JSON.stringify({ error: 'User ID and payment method ID are required' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }
      
      // Get customer
      const { data: customer } = await supabase
        .from('stripe_customers')
        .select('stripe_customer_id')
        .eq('user_id', userId)
        .single()
      
      if (!customer) {
        return new Response(
          JSON.stringify({ error: 'Customer not found' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        )
      }
      
      // Attach payment method to customer
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customer.stripe_customer_id,
      })
      
      // Get payment method details
      const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId)
      
      // Save payment method to database
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
        return new Response(
          JSON.stringify({ error: error.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }
      
      // Update other payment methods to not be default
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', userId)
        .neq('stripe_payment_method_id', paymentMethodId)
      
      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // DELETE request to remove a payment method
    if (req.method === 'DELETE') {
      const url = new URL(req.url)
      const paymentMethodId = url.pathname.split('/').pop()
      const userId = url.searchParams.get('userId')
      
      if (!paymentMethodId || !userId) {
        return new Response(
          JSON.stringify({ error: 'Payment method ID and user ID are required' }),
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
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
