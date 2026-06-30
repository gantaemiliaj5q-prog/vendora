'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ListingGallery } from '@/components/listing-gallery'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  MapPin,
  Clock,
  Eye,
  Tag,
  Star,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  Heart,
  UserCheck,
  MessageSquare,
} from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'
import { ro } from 'date-fns/locale'
import Link from 'next/link'
import { useRouter, notFound } from 'next/navigation'

const formatPrice = (price: number, currency: string) => {
  return new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

const conditionLabels: Record<string, string> = {
  nou: 'Nou',
  utilizat: 'Utilizat',
  recondiționat: 'Recondiționat',
}

function FavoriteButton({
  isFavorited,
  onToggle,
  loading,
}: {
  listingId: string
  isFavorited: boolean
  isLoggedIn: boolean
  onToggle: () => void
  loading: boolean
}) {
  return (
    <Button
      variant={isFavorited ? 'secondary' : 'outline'}
      onClick={onToggle}
      className="w-full flex gap-2 items-center rounded-xl"
      disabled={loading}
    >
      {isFavorited ? (
        <>
          <Heart className="h-4 w-4 fill-emerald-600 text-emerald-600" />
          Elimină din favorite
        </>
      ) : (
        <>
          <Heart className="h-4 w-4" />
          Salvează în favorite
        </>
      )}
    </Button>
  )
}

export default function ListingPage({ params }: { params: any }) {
  const resolvedParams = React.use(params)
  const id = resolvedParams.id

  const supabase = createClient()
  const router = useRouter()
  const [listing, setListing] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [isFavorited, setIsFavorited] = useState(false)
  const [favoriteRowId, setFavoriteRowId] = useState<string | null>(null)
  const [similarListings, setSimilarListings] = useState<any[]>([])
  const [isOwner, setIsOwner] = useState(false)
  const [loading, setLoading] = useState(true)
  const [favLoading, setFavLoading] = useState(false)
  const [listingError, setListingError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const { data: listingData, error } = await supabase
          .from('listings')
          .select('*, category:categories(*), profile:profiles(*)')
          .eq('id', id)
          .single()

        if (error || !listingData) {
          setListingError('notfound')
          return
        }
        setListing(listingData)

        supabase
          .from('listings')
          .update({ views_count: listingData.views_count + 1 })
          .eq('id', id)
          .then()

        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser()
        setUser(currentUser)
        setIsOwner(currentUser?.id === listingData.user_id)

        if (currentUser) {
          const { data: favorite } = await supabase
            .from('favorites')
            .select('id')
            .eq('user_id', currentUser.id)
            .eq('listing_id', id)
            .maybeSingle()

          setIsFavorited(!!favorite)
          setFavoriteRowId(favorite?.id ?? null)
        } else {
          setIsFavorited(false)
          setFavoriteRowId(null)
        }

        const { data: similars } = await supabase
          .from('listings')
          .select('*, category:categories(*)')
          .eq('category_id', listingData.category_id)
          .eq('status', 'activ')
          .neq('id', id)
          .limit(4)
        setSimilarListings(similars || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id, supabase])

  const handleToggleFavorite = useCallback(async () => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    
    setFavLoading(true)
    try {
      if (isFavorited) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('listing_id', id)

        setIsFavorited(false)
        setFavoriteRowId(null)
      } else {
        const { data, error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            listing_id: id,
          })
          .select('id')
          .single()

        if (!error && data) {
          setIsFavorited(true)
          setFavoriteRowId(data.id)
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setFavLoading(false)
    }
  }, [user, isFavorited, id, supabase, router])
  const handleContact = useCallback(async () => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    if (!listing) return

    const { data: existing } = await supabase
      .from('conversations')
      .select('id')
      .eq('listing_id', listing.id)
      .eq('buyer_id', user.id)
      .eq('seller_id', listing.user_id)
      .maybeSingle()

    if (existing) {
      router.push(`/mesaje/${existing.id}`)
      return
    }

    const { data: newConv, error } = await supabase
      .from('conversations')
      .insert({
        listing_id: listing.id,
        buyer_id: user.id,
        seller_id: listing.user_id,
      })
      .select('id')
      .single()

    if (!error && newConv) {
      router.push(`/mesaje/${newConv.id}`)
    }
  }, [user, listing, supabase, router])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f9fafb]">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground font-medium">Se încarcă detaliile anunțului...</div>
        </main>
        <Footer />
      </div>
    )
  }

  if (listingError === 'notfound' || !listing) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f9fafb]">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <Link href="/" className="hover:text-foreground">
              Acasă
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/anunturi" className="hover:text-foreground">
              Anunțuri
            </Link>
            {listing.category && (
              <>
                <ChevronRight className="h-4 w-4" />
                <Link
                  href={`/anunturi?categorie=${listing.category.slug}`}
                  className="hover:text-foreground"
                >
                  {listing.category.name}
                </Link>
              </>
            )}
          </nav>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Conținut Principal */}
            <div className="lg:col-span-2">
              <ListingGallery images={listing.images && listing.images.length > 0 ? listing.images : ['/placeholder.jpg']} title={listing.title} />

              {/* Detalii Titlu și Preț pentru Mobile */}
              <div className="mt-6 lg:hidden">
                <div className="flex flex-wrap items-center gap-2">
                  {listing.is_promoted && (
                    <Badge className="bg-emerald-600 text-white font-bold">
                      <Star className="mr-1 h-3 w-3 fill-white" />
                      Promovat
                    </Badge>
                  )}
                  <Badge variant="secondary" className="rounded-lg font-semibold">
                    {conditionLabels[listing.condition] || listing.condition}
                  </Badge>
                  {listing.category && (
                    <Badge variant="outline" className="rounded-lg font-semibold">{listing.category.name}</Badge>
                  )}
                </div>
                <h1 className="mt-2 text-2xl font-bold text-gray-900">{listing.title}</h1>
                <p className="mt-2 text-3xl font-black text-emerald-600">
                  {formatPrice(listing.price, listing.currency)}
                </p>
                
                {!isOwner && (
                  <div className="mt-4">
                    <FavoriteButton
                      listingId={listing.id}
                      isFavorited={isFavorited}
                      isLoggedIn={!!user}
                      onToggle={handleToggleFavorite}
                      loading={favLoading}
                    />
                  </div>
                )}
              </div>

              {/* Descriere */}
              <Card className="mt-6 rounded-2xl border-gray-100 shadow-sm bg-white">
                <CardContent className="pt-6">
                  <h2 className="mb-4 text-base font-bold text-gray-900">Descriere</h2>
                  <div className="prose prose-sm max-w-none text-gray-600 font-medium whitespace-pre-line leading-relaxed">
                    {listing.description}
                  </div>
                </CardContent>
              </Card>

              {/* Specificații Tehnice */}
              <Card className="mt-4 rounded-2xl border-gray-100 shadow-sm bg-white">
                <CardContent className="pt-6">
                  <h2 className="mb-4 text-base font-bold text-gray-900">Detalii tehnice</h2>
                  <dl className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-3">
                      <Tag className="h-5 w-5 text-emerald-600" />
                      <div>
                        <dt className="text-xs text-muted-foreground font-medium">Categorie</dt>
                        <dd className="font-semibold text-gray-900 text-sm">{listing.category?.name}</dd>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-emerald-600" />
                      <div>
                        <dt className="text-xs text-muted-foreground font-medium">Locație</dt>
                        <dd className="font-semibold text-gray-900 text-sm">{listing.location}</dd>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-emerald-600" />
                      <div>
                        <dt className="text-xs text-muted-foreground font-medium">Publicat</dt>
                        <dd className="font-semibold text-gray-900 text-sm">
                          {format(new Date(listing.created_at), 'd MMMM yyyy', { locale: ro })}
                        </dd>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Eye className="h-5 w-5 text-emerald-600" />
                      <div>
                        <dt className="text-xs text-muted-foreground font-medium">Vizualizări</dt>
                        <dd className="font-semibold text-gray-900 text-sm">{listing.views_count + 1}</dd>
                      </div>
                    </div>
                    {listing.external_url && (
                      <div className="flex items-center gap-3 sm:col-span-2 pt-2">
                        <ExternalLink className="h-5 w-5 text-emerald-600" />
                        <div>
                          <dt className="text-xs text-muted-foreground font-medium">Link extern</dt>
                          <dd className="font-semibold text-sm">
                            <a
                              href={listing.external_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-600 hover:text-emerald-700 hover:underline inline-flex items-center gap-1"
                            >
                              Accesează link-ul original
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          </dd>
                        </div>
                      </div>
                    )}
                  </dl>
                </CardContent>
              </Card>
            </div>

            {/* Bara Laterală (Sidebar Desktop) */}
            <div className="space-y-4">
              <Card className="hidden lg:block rounded-2xl border-gray-100 shadow-sm bg-white">
                <CardContent className="pt-6">
                  <div className="flex flex-wrap items-center gap-2">
                    {listing.is_promoted && (
                      <Badge className="bg-emerald-600 text-white font-bold">
                        <Star className="mr-1 h-3 w-3 fill-white" />
                        Promovat
                      </Badge>
                    )}
                    <Badge variant="secondary" className="rounded-lg font-semibold">
                      {conditionLabels[listing.condition] || listing.condition}
                    </Badge>
                  </div>
                  <h1 className="mt-3 text-lg font-bold text-gray-900 leading-tight">{listing.title}</h1>
                  <p className="mt-2 text-2xl font-black text-emerald-600">
                    {formatPrice(listing.price, listing.currency)}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-gray-500">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    {listing.location}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs font-semibold text-gray-500">
                    <Clock className="h-4 w-4 text-gray-400" />
                    {formatDistanceToNow(new Date(listing.created_at), {
                      addSuffix: true,
                      locale: ro,
                    })}
                  </div>
                  
                  {!isOwner && (
                    <div className="mt-4">
                      <FavoriteButton
                        listingId={listing.id}
                        isFavorited={isFavorited}
                        isLoggedIn={!!user}
                        onToggle={handleToggleFavorite}
                        loading={favLoading}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Informații Vânzător + MODUL CONECTARE RECENZII LICENȚĂ */}
              <Card className="rounded-2xl border-gray-100 shadow-sm bg-white">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 ring-2 ring-gray-100">
                      <AvatarImage src={listing.profile?.avatar_url || undefined} />
                      <AvatarFallback className="bg-emerald-50 text-emerald-700 font-bold text-sm">
                        {listing.profile?.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">
                        {listing.profile?.full_name || 'Utilizator Vendora'}
                      </p>
                      <p className="text-xs text-muted-foreground font-medium mt-0.5">
                        Membru din{' '}
                        {format(
                          new Date(listing.profile?.created_at || listing.created_at),
                          'MMMM yyyy',
                          { locale: ro }
                        )}
                      </p>
                    </div>
                  </div>
                  <Separator className="my-4 bg-gray-100" />

{!isOwner && (
  <Button
    onClick={handleContact}
    className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 transition-colors shadow-sm shadow-emerald-900/10 mb-2"
  >
    <MessageSquare className="mr-2 h-4 w-4" />
    CONTACTEAZĂ VÂNZĂTORUL
  </Button>
)}

{/* LINK CĂTRE PAGINA DE RECENZII PUBLICĂ A UTILIZATORULUI CONFORM DOCUMENTAȚIEI */}
<Button asChild className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 transition-colors shadow-sm shadow-emerald-900/10">
  <Link href={`/profile/${listing.user_id}`}>
    <UserCheck className="mr-2 h-4 w-4" />
    VEZI PROFIL & RECENZII
  </Link>
</Button>
                </CardContent>
              </Card>

              {!isOwner && (
                <Button
                  variant="ghost"
                  className="w-full text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl font-medium text-xs h-9 transition-colors"
                  asChild
                >
                  <Link href={`/raportari?listing=${listing.id}`}>
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Raportează anunțul
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Secțiune Anunțuri Similare */}
          {similarListings && similarListings.length > 0 && (
            <section className="mt-12">
              <h2 className="mb-6 text-lg font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-3">Anunțuri similare</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {similarListings.map((similar) => (
                  <Link key={similar.id} href={`/anunturi/${similar.id}`} className="group">
                    <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-md rounded-2xl border-gray-100 bg-white flex flex-col">
                      <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden w-full">
                        {similar.images && similar.images.length > 0 ? (
                          <img
                            src={similar.images[0]}
                            alt={similar.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-muted-foreground text-xs font-medium">
                            Fără imagine
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4 flex flex-col flex-1 justify-between bg-white z-10">
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 group-hover:text-emerald-600 transition-colors">{similar.title}</h3>
                        <p className="mt-2 font-black text-emerald-600 text-sm">
                          {formatPrice(similar.price, similar.currency)}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}