import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ArrowRight, Heart, ChevronLeft, ChevronRight, Eye, MapPin, Search } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default async function HomePage() {
  const supabase = await createClient()

  // 1. Preluăm categoriile din baza de date reală
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .is('parent_id', null)
    .order('name')

  // 2. Preluăm anunțurile promovate
  const { data: promotedListings } = await supabase
    .from('listings')
    .select('*, category:categories(*)')
    .eq('status', 'activ')
    .eq('is_promoted', true)
    .order('created_at', { ascending: false })
    .limit(4)

  // 3. Preluăm anunțurile recente
  const { data: recentListings } = await supabase
    .from('listings')
    .select('*, category:categories(*)')
    .eq('status', 'activ')
    .order('created_at', { ascending: false })
    .limit(8)

  // 4. Calculăm numărul de anunțuri per categorie
  const { data: allListings } = await supabase
    .from('listings')
    .select('category_id')
    .eq('status', 'activ')

  const countByCategory: Record<string, number> = {}
  allListings?.forEach((listing) => {
    if (listing.category_id) {
      countByCategory[listing.category_id] = (countByCategory[listing.category_id] || 0) + 1
    }
  })

  const categoryImages: Record<string, string> = {
    'vehicule': 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=300&auto=format&fit=cover',
    'imobiliare': 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=300&auto=format&fit=cover',
    'electronice': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=300&auto=format&fit=cover',
    'casa-gradina': 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=300&auto=format&fit=cover',
    'moda-frumusețe': 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=300&auto=format&fit=cover',
    'animale': 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=300&auto=format&fit=cover',
    'locuri-de-munca': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=300&auto=format&fit=cover',
    'servicii': 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=300&auto=format&fit=cover',
    'sport-timp-liber': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=300&auto=format&fit=cover'
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f9fafb]">
      <Header />
      <main className="flex-1">
        
        {/* HERO SECTION */}
        <section className="relative bg-[#0b0f19] text-white overflow-hidden py-16 md:py-24 border-b border-zinc-800">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.08),transparent_50%)]" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid gap-12 lg:grid-cols-12 items-center">
              
              <div className="space-y-6 lg:col-span-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                  Platformă Securizată pentru Anunțuri
                </div>
                <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl text-white">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 font-black">VENDORA.</span><br />
                  <span className="text-zinc-100 font-medium text-3xl sm:text-4xl lg:text-5xl block mt-2">
                    Marketplace-ul tău pentru anunțuri verificate în România.
                  </span>
                </h1>
                <p className="text-base text-zinc-400 max-w-xl font-normal leading-relaxed">
                  Descoperă o comunitate premium unde poți vinde și cumpăra în siguranță produse verificate.
                </p>
                
                {/* NOUA BARĂ DE CĂUTARE ÎN LOCUL BUTONULUI - Legată la logica ta existentă */}
                <div className="pt-2 max-w-lg">
                  <form method="GET" action="/anunturi" className="relative w-full group">
                    <input
                      type="text"
                      name="cautare"
                      placeholder="Caută anunțuri..."
                      className="w-full h-12 rounded-xl border border-zinc-800 bg-[#111827] pl-4 pr-12 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-md"
                    />
                    <button
                      type="submit"
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white transition-colors hover:bg-emerald-500"
                    >
                      <Search className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </div>

              <div className="lg:col-span-6 relative mt-8 lg:mt-0">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-8 relative aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl">
                    <img
                      src="https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=800&auto=format&fit=cover"
                      alt="Premium Showcase"
                      className="w-full h-full object-cover opacity-90"
                    />
                  </div>
                  <div className="col-span-4 grid grid-rows-2 gap-4">
                    <div className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 shadow-md">
                      <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400&auto=format&fit=cover" alt="Electronics" className="w-full h-full object-cover opacity-80" />
                    </div>
                    <div className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 shadow-md">
                      <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=400&auto=format&fit=cover" alt="Real Estate" className="w-full h-full object-cover opacity-80" />
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </section>

        {/* CATEGORII */}
        <section className="py-20 bg-white border-b border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto mb-14 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">Categorii Principale</h2>
              <p className="text-muted-foreground mt-2">Răsfoiește anunțurile active organizate pe domenii de interes.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 justify-center">
              {categories?.map((category) => {
                const count = countByCategory[category.id] || 0
                const bgImage = categoryImages[category.slug] || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=300&auto=format&fit=cover'

                return (
                  <Link
                    key={category.id}
                    href={`/anunturi?categorie=${category.slug}`}
                    className="group flex flex-col overflow-hidden bg-white border border-gray-100 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                  >
                    <div className="relative h-28 w-full bg-gray-100 overflow-hidden">
                      <img src={bgImage} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                    </div>
                    <div className="p-4 flex flex-col items-center justify-center flex-1 text-center bg-white z-10">
                      <span className="text-sm font-bold text-gray-800 tracking-wide truncate max-w-full group-hover:text-emerald-600 transition-colors">
                        {category.name}
                      </span>
                      <span className="text-xs text-muted-foreground mt-1 bg-gray-50 px-2.5 py-0.5 rounded-full font-medium">
                        {count} {count === 1 ? 'anunț' : 'anunțuri'}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* ANUNȚURI PROMOVATE */}
        <section className="py-20 bg-[#f9fafb]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12 border-b border-gray-200/60 pb-5">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 uppercase">Anunțuri Promovate</h2>
                <p className="text-xs text-muted-foreground mt-1">Produse de top evidențiate în cadrul comunității noastre.</p>
              </div>
              <div className="flex gap-2">
                <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition-all hover:bg-gray-50">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition-all hover:bg-gray-50">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {promotedListings?.map((listing) => (
                <div key={listing.id} className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-lg flex flex-col h-full">
                  
                  <Link href={`/anunturi/${listing.id}`} className="flex flex-col flex-1">
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 w-full">
                      <img src={listing.images?.[0] || '/placeholder.jpg'} alt={listing.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
                      {listing.is_promoted && (
                        <span className="absolute left-3 top-3 rounded-md bg-emerald-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                          Promovat
                        </span>
                      )}
                    </div>

                    <div className="p-4 flex flex-col flex-1 justify-between">
                      <div>
                        <h3 className="mb-1 text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-emerald-600 transition-colors">{listing.title}</h3>
                        <p className="mb-4 text-xs text-muted-foreground flex items-center gap-1">
                          📍 {listing.location || 'România'}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-50 w-full">
                        <span className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5" /> Vezi Detalii
                        </span>
                        <span className="text-base font-black text-emerald-600">
                          {listing.price?.toLocaleString('ro-RO')} {listing.currency || 'RON'}
                        </span>
                      </div>
                    </div>
                  </Link>

                  <button className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-xl bg-white/90 text-gray-500 shadow-sm hover:text-rose-500 transition-colors z-10">
                    <Heart className="h-4 w-4" />
                  </button>

                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BANNER RECENT */}
        <section className="py-10 bg-gradient-to-r from-emerald-800 to-teal-800 shadow-inner">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-wider">Anunțuri Recente Adăugate</h3>
                <p className="text-sm text-emerald-100/80 mt-0.5">Explorează ultimele listări verificate, actualizate în timp real.</p>
              </div>
              <Button asChild variant="outline" className="rounded-xl border-white/30 bg-white/10 text-white hover:bg-white hover:text-emerald-800 transition-all font-semibold px-5">
                <Link href="/anunturi" className="flex items-center gap-2">
                  Vezi Tot Fluxul <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* FLUX NOUTĂȚI */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 border-b border-gray-100 pb-5">
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 uppercase">Flux Noutăți</h2>
              <p className="text-xs text-muted-foreground mt-1">Ultimele produse listate cronologic pe platformă.</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {recentListings?.map((listing) => (
                <div key={listing.id} className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-lg flex flex-col h-full">
                  
                  <Link href={`/anunturi/${listing.id}`} className="flex flex-col flex-1">
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 w-full">
                      <img src={listing.images?.[0] || '/placeholder.jpg'} alt={listing.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
                    </div>

                    <div className="p-4 flex flex-col flex-1 justify-between">
                      <div>
                        <h3 className="mb-1 text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-emerald-600 transition-colors">{listing.title}</h3>
                        <p className="mb-4 text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-gray-400" /> {listing.location || 'România'}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-50 w-full">
                        <span className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5" /> Vezi Detalii
                        </span>
                        <span className="text-base font-bold text-gray-900">
                          {listing.price?.toLocaleString('ro-RO')} {listing.currency || 'RON'}
                        </span>
                      </div>
                    </div>
                  </Link>

                  <button className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-xl bg-white/90 text-gray-500 shadow-sm transition-all hover:bg-white hover:text-rose-500">
                    <Heart className="h-4 w-4" />
                  </button>

                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}