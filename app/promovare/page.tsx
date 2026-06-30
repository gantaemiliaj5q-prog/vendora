import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PromotionPackages } from '@/components/promotion-packages'
import { PROMOTION_PACKAGES } from '@/lib/products'
import { isAdminProfile } from '@/lib/profile'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

export const metadata = {
  title: 'Promovează anunțul',
}

interface PageProps {
  searchParams: Promise<{ listing?: string }>
}

export default async function PromotionPage({ searchParams }: PageProps) {
  const params = await searchParams
  const listingId = params.listing

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/auth/login?redirect=/promovare${listingId ? `?listing=${listingId}` : ''}`)
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin, role')
    .eq('id', user.id)
    .maybeSingle()

  if (isAdminProfile(profile)) {
    redirect('/admin')
  }

  // If no listing specified, show user's listings to choose from
  let listing = null
  let userListings = null

  if (listingId) {
    const { data, error } = await supabase
      .from('listings')
      .select('*, category:categories(*)')
      .eq('id', listingId)
      .eq('user_id', user.id)
      .single()

    if (error || !data) {
      return (
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Anunțul nu a fost găsit sau nu îți aparține.
                </AlertDescription>
              </Alert>
            </div>
          </main>
          <Footer />
        </div>
      )
    }

    listing = data
  } else {
    const { data } = await supabase
      .from('listings')
      .select('*, category:categories(*)')
      .eq('user_id', user.id)
      .in('status', ['active', 'activ'])
      .eq('is_promoted', false)
      .order('created_at', { ascending: false })

    userListings = data
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold sm:text-3xl">Promovează-ți anunțul</h1>
            <p className="mt-2 text-muted-foreground">
              Crește vizibilitatea anunțului tău și vinde mai repede
            </p>
          </div>

          {listing ? (
            <>
              {/* Selected Listing */}
              <Card className="mb-8">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
                    {listing.images && listing.images.length > 0 ? (
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                        Fără
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate font-medium">{listing.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {listing.category?.name}
                    </p>
                    <p className="mt-1 text-lg font-bold text-primary">
                      {formatPrice(listing.price, listing.currency)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Promotion Packages */}
              <PromotionPackages
                packages={PROMOTION_PACKAGES}
                listingId={listing.id}
              />
            </>
          ) : userListings && userListings.length > 0 ? (
            <>
              <p className="mb-4 text-center text-muted-foreground">
                Selectează anunțul pe care vrei să îl promovezi:
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {userListings.map((item) => (
                  <a
                    key={item.id}
                    href={`/promovare?listing=${item.id}`}
                    className="block"
                  >
                    <Card className="transition-shadow hover:shadow-md">
                      <CardContent className="flex items-center gap-4 p-4">
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                          {item.images && item.images.length > 0 ? (
                            <img
                              src={item.images[0]}
                              alt={item.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                              Fără
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-medium">{item.title}</h3>
                          <p className="text-sm text-primary">
                            {formatPrice(item.price, item.currency)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                ))}
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  Nu ai anunțuri active care pot fi promovate.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
