import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  Package,
  Heart,
  MessageSquare,
  CreditCard,
  Settings,
  Plus,
  Eye,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { isAdminProfile } from '@/lib/profile'

export const metadata = {
  title: 'Contul meu',
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?redirect=/cont')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const isAdmin = isAdminProfile(profile)

  let listingsCount = 0
  let activeListingsCount = 0
  let favoritesCount = 0
  let totalViews = 0
  let recentListings: any[] = []

  if (!isAdmin) {
    const [
      { count: fetchedListingsCount },
      { count: fetchedActiveListingsCount },
      { count: fetchedFavoritesCount },
      { data: viewsData },
      { data: fetchedRecentListings },
    ] = await Promise.all([
      supabase
        .from('listings')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id),
      supabase
        .from('listings')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .in('status', ['active', 'activ']),
      supabase
        .from('favorites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id),
      supabase
        .from('listings')
        .select('views_count')
        .eq('user_id', user.id),
      supabase
        .from('listings')
        .select('*, category:categories(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3),
    ])

    listingsCount = fetchedListingsCount || 0
    activeListingsCount = fetchedActiveListingsCount || 0
    favoritesCount = fetchedFavoritesCount || 0
    totalViews =
      viewsData?.reduce((acc, listing) => acc + (listing.views_count || 0), 0) || 0
    recentListings = fetchedRecentListings || []
  }

  const { count: unreadMessagesCount } = await supabase
    .from('messages')
    .select('*, conversation:conversations!inner(*)', {
      count: 'exact',
      head: true,
    })
    .eq('is_read', false)
    .neq('sender_id', user.id)
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`, {
      foreignTable: 'conversation',
    })

  const formatPrice = (price: number, currency: string) =>
    new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(price)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">
                Bine ai venit, {profile?.full_name || 'Utilizator'}!
              </h1>
              <p className="mt-1 text-muted-foreground">
                Gestioneaza-ti anunturile si contul din acest panou.
              </p>
              {isAdmin ? (
                <div className="mt-3 flex items-center gap-2">
                  <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">
                    Cont admin activ
                  </Badge>
                </div>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-3">
              {isAdmin ? (
                <Button variant="outline" asChild>
                  <Link href="/admin">
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Panou admin
                  </Link>
                </Button>
              ) : null}
              {!isAdmin && (
                <Button asChild>
                  <Link href="/anunturi/adauga">
                    <Plus className="mr-2 h-4 w-4" />
                    Adauga anunt
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {!isAdmin && (
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{activeListingsCount || 0}</p>
                    <p className="text-sm text-muted-foreground">Anunturi active</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Eye className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalViews}</p>
                    <p className="text-sm text-muted-foreground">Vizualizari totale</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{favoritesCount || 0}</p>
                    <p className="text-sm text-muted-foreground">Favorite</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{unreadMessagesCount || 0}</p>
                    <p className="text-sm text-muted-foreground">Mesaje necitite</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Actiuni rapide</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {!isAdmin && (
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/cont/anunturi">
                        <Package className="mr-2 h-4 w-4" />
                        Anunturile mele ({listingsCount || 0})
                      </Link>
                    </Button>
                  )}
                  {!isAdmin && (
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/favorite">
                        <Heart className="mr-2 h-4 w-4" />
                        Favorite ({favoritesCount || 0})
                      </Link>
                    </Button>
                  )}
                  {!isAdmin && (
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/mesaje">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Mesaje
                        {unreadMessagesCount ? (
                          <Badge className="ml-auto" variant="destructive">
                            {unreadMessagesCount}
                          </Badge>
                        ) : null}
                      </Link>
                    </Button>
                  )}
                  {!isAdmin && (
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/cont/plati">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Istoric plati
                      </Link>
                    </Button>
                  )}
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/cont/setari">
                      <Settings className="mr-2 h-4 w-4" />
                      Setari cont
                    </Link>
                  </Button>
                  {isAdmin ? (
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link href="/admin">
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Panou admin
                      </Link>
                    </Button>
                  ) : null}
                </CardContent>
              </Card>
            </div>

            {!isAdmin && (
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Anunturi recente</CardTitle>
                      <CardDescription>Ultimele tale anunturi publicate</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/cont/anunturi">
                        Vezi toate
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {recentListings && recentListings.length > 0 ? (
                      <div className="space-y-4">
                        {recentListings.map((listing) => (
                          <div
                            key={listing.id}
                            className="flex items-center gap-4 rounded-lg border p-4"
                          >
                            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                              {listing.images && listing.images.length > 0 ? (
                                <img
                                  src={listing.images[0]}
                                  alt={listing.title}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                                  Fara imagine
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="truncate font-medium">{listing.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {formatPrice(listing.price, listing.currency)}
                              </p>
                              <div className="mt-1 flex items-center gap-2">
                                <Badge
                                  variant={
                                    listing.status === 'activ' ||
                                    listing.status === 'active'
                                      ? 'default'
                                      : 'secondary'
                                  }
                                  className="text-xs"
                                >
                                  {listing.status === 'activ' ||
                                  listing.status === 'active'
                                    ? 'Activ'
                                    : listing.status}
                                </Badge>
                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Eye className="h-3 w-3" />
                                  {listing.views_count}
                                </span>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/anunturi/${listing.id}`}>Vezi</Link>
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <p className="text-muted-foreground">
                          Nu ai publicat inca niciun anunt.
                        </p>
                        <Button className="mt-4" asChild>
                          <Link href="/anunturi/adauga">
                            <Plus className="mr-2 h-4 w-4" />
                            Publica primul anunt
                          </Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
