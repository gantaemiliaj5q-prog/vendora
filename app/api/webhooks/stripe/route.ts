import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

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
      process.env.STRIPE_WEBHOOK_SECRET ?? ''
    )
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.user_id
    const listingId = session.metadata?.listing_id
    const packageId = session.metadata?.package_id
    const durationDays = parseInt(session.metadata?.duration_days || '7', 10)

    if (!userId || !listingId || !packageId) {
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
    }

    await supabaseAdmin.from('payments').update({
      status: 'completed',
      stripe_payment_intent_id: session.payment_intent as string,
      updated_at: new Date().toISOString(),
    }).eq('stripe_session_id', session.id)

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + durationDays)

    await supabaseAdmin.from('listings').update({
      is_promoted: true,
      promotion_expires_at: expiresAt.toISOString(),
      updated_at: new Date().toISOString(),
    }).eq('id', listingId)
  }

  return NextResponse.json({ received: true })
}