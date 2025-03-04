// supabase/functions/stripe-webhook/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@11.1.0'

serve(async (req) => {
  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('APP_SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('APP_SUPABASE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Create Stripe client
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2022-11-15',
    })
    
    // Get the signature from the header
    const signature = req.headers.get('stripe-signature')
    
    if (!signature) {
      return new Response(
        JSON.stringify({ error: 'Missing stripe-signature header' }),
        { headers: { 'Content-Type': 'application/json' }, status: 400 }
      )
    }
    
    // Get the raw body
    const body = await req.text()
    
    // Verify the webhook signature
    let event
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? ''
      )
    } catch (err) {
      return new Response(
        JSON.stringify({ error: `Webhook signature verification failed: ${err.message}` }),
        { headers: { 'Content-Type': 'application/json' }, status: 400 }
      )
    }
    
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object
        
        // Update subscription status
        if (paymentIntent.metadata.subscription_id) {
          await supabase
            .from('subscriptions')
            .update({ status: 'active' })
            .eq('id', paymentIntent.metadata.subscription_id)
        }
        
        // Add tokens if this was a token purchase
        if (paymentIntent.metadata.token_package_id && paymentIntent.metadata.user_id) {
          // Get token package
          const { data: tokenPackage } = await supabase
            .from('token_packages')
            .select('*')
            .eq('id', paymentIntent.metadata.token_package_id)
            .single()
          
          if (tokenPackage) {
            // Add tokens to user balance
            const { data: tokenBalance } = await supabase
              .from('token_balances')
              .select('*')
              .eq('user_id', paymentIntent.metadata.user_id)
              .single()
            
            if (tokenBalance) {
              // Update existing balance
              await supabase
                .from('token_balances')
                .update({ 
                  amount: tokenBalance.amount + tokenPackage.tokens,
                  updated_at: new Date().toISOString()
                })
                .eq('user_id', paymentIntent.metadata.user_id)
            } else {
              // Create new balance
              await supabase
                .from('token_balances')
                .insert({
                  user_id: paymentIntent.metadata.user_id,
                  amount: tokenPackage.tokens
                })
            }
            
            // Record transaction
            await supabase
              .from('token_transactions')
              .insert({
                user_id: paymentIntent.metadata.user_id,
                amount: tokenPackage.tokens,
                type: 'purchase',
                description: `Purchased ${tokenPackage.tokens} tokens`,
                payment_intent_id: paymentIntent.id
              })
          }
        }
        break
        
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object
        
        // Get customer from Stripe
        const customer = await stripe.customers.retrieve(subscription.customer)
        
        // Get user ID from customer metadata
        const userId = customer.metadata.userId
        
        if (userId) {
          // Update subscription in database
          const { data: existingSubscription } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('stripe_subscription_id', subscription.id)
            .single()
          
          if (existingSubscription) {
            // Update existing subscription
            await supabase
              .from('subscriptions')
              .update({
                status: subscription.status,
                current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
                current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
                cancel_at_period_end: subscription.cancel_at_period_end,
                updated_at: new Date().toISOString()
              })
              .eq('stripe_subscription_id', subscription.id)
          } else {
            // Get plan ID from product
            const { data: plan } = await supabase
              .from('plans')
              .select('*')
              .eq('stripe_product_id', subscription.items.data[0].price.product)
              .single()
            
            if (plan) {
              // Create new subscription
              await supabase
                .from('subscriptions')
                .insert({
                  user_id: userId,
                  plan_id: plan.id,
                  stripe_subscription_id: subscription.id,
                  status: subscription.status,
                  current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
                  current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
                  cancel_at_period_end: subscription.cancel_at_period_end
                })
            }
          }
        }
        break
        
      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object
        
        // Update subscription status to canceled
        await supabase
          .from('subscriptions')
          .update({ 
            status: 'canceled',
            updated_at: new Date().toISOString()
          })
          .eq('stripe_subscription_id', deletedSubscription.id)
        break
    }
    
    return new Response(
      JSON.stringify({ received: true }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
