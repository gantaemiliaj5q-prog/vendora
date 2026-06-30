import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'
export const dynamic = 'force-dynamic'

// Use service role for webhook (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
)

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const userId = session.metadata?.user_id
    const listingId = session.metadata?.listing_id
    const packageId = session.metadata?.package_id
    const durationDays = parseInt(session.metadata?.duration_days || '7', 10)

    if (!userId || !listingId || !packageId) {
      console.error('Missing metadata in session:', session.id)
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
    }

    // Update payment status
    const { error: paymentError } = await supabaseAdmin
      .from('payments')
      .update({
        status: 'completed',
        stripe_payment_intent_id: session.payment_intent as string,
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_session_id', session.id)

    if (paymentError) {
      console.error('Error updating payment:', paymentError)
    }

    // Calculate promotion expiry
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + durationDays)

    // Activate promotion on listing
    const { error: listingError } = await supabaseAdmin
      .from('listings')
      .update({
        is_promoted: true,
        promotion_expires_at: expiresAt.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', listingId)

    if (listingError) {
      console.error('Error updating listing:', listingError)
      return NextResponse.json(
        { error: 'Failed to activate promotion' },
        { status: 500 }
      )
    }

    console.log(`Promotion activated for listing ${listingId} until ${expiresAt}`)
  }

  return NextResponse.json({ received: true })
}
