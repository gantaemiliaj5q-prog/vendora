'use server'

import { stripe } from '@/lib/stripe'
import { PROMOTION_PACKAGES, getPackageById } from '@/lib/products'
import { createClient } from '@/lib/supabase/server'

export async function startCheckoutSession(
  packageId: string,
  listingId: string
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Trebuie să fii autentificat')
  }

  const promotionPackage = getPackageById(packageId)
  if (!promotionPackage) {
    throw new Error(`Pachetul "${packageId}" nu a fost găsit`)
  }

  // Verify listing exists and belongs to user
  const { data: listing, error } = await supabase
    .from('listings')
    .select('id, title, user_id')
    .eq('id', listingId)
    .single()

  if (error || !listing) {
    throw new Error('Anunțul nu a fost găsit')
  }

  if (listing.user_id !== user.id) {
    throw new Error('Nu poți promova anunțul altui utilizator')
  }

  // Create Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    redirect_on_completion: 'never',
    line_items: [
      {
        price_data: {
          currency: 'ron',
          product_data: {
            name: `Promovare ${promotionPackage.name}`,
            description: `${promotionPackage.description} - ${promotionPackage.durationDays} zile pentru anunțul "${listing.title}"`,
          },
          unit_amount: promotionPackage.priceInCents,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    metadata: {
      user_id: user.id,
      listing_id: listingId,
      package_id: packageId,
      duration_days: promotionPackage.durationDays.toString(),
    },
  })

  // Create payment record
  await supabase.from('payments').insert({
    user_id: user.id,
    listing_id: listingId,
    package_id: packageId,
    stripe_session_id: session.id,
    amount_cents: promotionPackage.priceInCents,
    currency: 'RON',
    status: 'pending',
  })

  return session.client_secret
}

export async function getPromotionPackages() {
  return PROMOTION_PACKAGES
}
