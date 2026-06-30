import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MapPin, Search, Grid, List, Eye, Heart } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  searchParams: Promise<{
    cautare?: string
    categorie?: string
    locatie?: string
    pret_min?: string
    pret_max?: string
    stare?: string
    sortare?: string
    moneda?: string
  }>
}

export default async function ListingsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const supabase = await createClient()

  // 1. Preluăm categoriile pentru a le avea în sidebar
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .is('parent_id', null)
    .order('name')

  // Găsim id-ul categoriei curente pe baza slug-ului primit în URL ca filtrarea să funcționeze corect
  let currentCategoryId = ''
  if (params.categorie && params.categorie !== 'all') {
    const currentCat = categories?.find(c => c.slug === params.categorie)
    if (currentCat) {
      currentCategoryId = currentCat.id
    }
  }

  // 2. Construim query-ul pentru listare
  let query = supabase
    .from('listings')
    .select('*, category:categories(*)')
    .eq('status', 'activ')

  if (params.cautare) query = query.ilike('title', `%${params.cautare}%`)
  
  // Filtrare corectă după UUID-ul categoriei selectate
  if (currentCategoryId) {
    query = query.eq('category_id', currentCategoryId)
  }
  
  if (params.locatie) query = query.ilike('location', `%${params.locatie}%`)
  if (params.pret_min) query = query.gte('price', parseFloat(params.pret_min))
  if (params.pret_max) query = query.lte('price', parseFloat(params.pret_max))
  if (params.stare && params.stare !== 'orice') query = query.eq('condition', params.stare)
  if (params.moneda && params.moneda !== 'all') query = query.eq('currency', params.moneda)

  const sortare = params.sortare || 'newest'
  if (sortare === 'newest') query = query.order('created_at', { ascending: false })
  else if (sortare === 'price_asc') query = query.order('price', { ascending: true })
  else if (sortare === 'price_desc') query = query.order('price', { ascending: false })

  const { data: listings } = await query

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Titlu Secțiune */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Toate anunțurile</h1>
          <p className="text-sm text-gray-500 mt-1">{listings?.length || 0} anunțuri găsite</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR FILTRE ORIGINAL DINAMIC */}
          <aside className="w-full lg:w-64 shrink-0 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-6 h-fit">
  <div className="flex items-center justify-between pb-3 border-b">
    <h2 className="font-bold text-gray-900 text-base">Filtre</h2>
    <Link href="/anunturi" className="text-xs font-semibold text-gray-400 hover:text-emerald-600 transition-colors">
      ✕ Șterge
    </Link>
  </div>

  <form action="/anunturi" method="GET" className="space-y-6">
    {/* Sortare */}
    <div>
      <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Sortare</label>
      <select name="sortare" defaultValue={params.sortare || 'newest'} className="w-full h-9 rounded-lg bg-gray-50 border border-gray-200 text-sm px-2 text-gray-700 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
        <option value="newest">Cele mai noi</option>
        <option value="price_asc">Preț crescător</option>
        <option value="price_desc">Preț descrescător</option>
      </select>
    </div>

    {/* Categorie */}
    <div>
      <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Categorie</label>
      <div className="space-y-2 max-h-44 overflow-y-auto pr-1 text-sm text-gray-600">
        <label className="flex items-center gap-2 cursor-pointer hover:text-gray-900">
          <input type="radio" name="categorie" value="" defaultChecked={!params.categorie || params.categorie === 'all'} className="accent-emerald-600" />
          Toate categoriile
        </label>
        {categories?.map((cat) => (
          <label key={cat.id} className="flex items-center gap-2 cursor-pointer hover:text-gray-900">
            <input type="radio" name="categorie" value={cat.slug} defaultChecked={params.categorie === cat.slug} className="accent-emerald-600" />
            {cat.name}
          </label>
        ))}
      </div>
    </div>

    {/* Preț */}
    <div className="space-y-3">
      <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Preț</label>
      <select name="moneda" defaultValue={params.moneda || 'all'} className="w-full h-9 rounded-lg bg-gray-50 border border-gray-200 text-sm px-2 text-gray-700 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
        <option value="all">Toate monedele</option>
        <option value="RON">RON</option>
        <option value="EUR">EUR</option>
      </select>
      <div className="grid grid-cols-2 gap-2">
        <Input name="pret_min" placeholder="Min" type="number" defaultValue={params.pret_min || ''} className="h-9 bg-gray-50 border-gray-200 focus-visible:ring-emerald-500 rounded-lg text-sm" />
        <Input name="pret_max" placeholder="Max" type="number" defaultValue={params.pret_max || ''} className="h-9 bg-gray-50 border-gray-200 focus-visible:ring-emerald-500 rounded-lg text-sm" />
      </div>
    </div>

    {/* Stare */}
    <div>
      <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Stare</label>
      <div className="space-y-2 text-sm text-gray-600">
        <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="stare" value="orice" defaultChecked={!params.stare || params.stare === 'orice'} className="accent-emerald-600" /> Orice stare</label>
        <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="stare" value="nou" defaultChecked={params.stare === 'nou'} className="accent-emerald-600" /> Nou</label>
        <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="stare" value="utilizat" defaultChecked={params.stare === 'utilizat'} className="accent-emerald-600" /> Utilizat</label>
        <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="stare" value="recondiționat" defaultChecked={params.stare === 'recondiționat'} className="accent-emerald-600" /> Recondiționat</label>
      </div>
    </div>

    {/* Locație */}
    <div>
      <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Locație</label>
      <div className="relative">
        <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
        <Input name="locatie" placeholder="Introduceți orașul" defaultValue={params.locatie || ''} className="pl-9 h-9 bg-gray-50 border-gray-200 focus-visible:ring-emerald-500 rounded-lg text-sm" />
      </div>
    </div>

    <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl h-10 transition-colors shadow-sm shadow-emerald-900/10">
      Aplică filtrele
    </Button>
  </form>
</aside>

          {/* GRID PRODUSE */}
          <section className="flex-1">
            {listings && listings.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {listings.map((listing) => (
                  <div key={listing.id} className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-lg flex flex-col h-full">
                    
                    <Link href={`/anunturi/${listing.id}`} className="flex flex-col flex-1">
                      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 w-full">
                        <img 
                          src={listing.images?.[0] || '/placeholder.jpg'} 
                          alt={listing.title} 
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" 
                        />
                        {listing.is_promoted && (
                          <span className="absolute left-3 top-3 rounded-md bg-emerald-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                            Promovat
                          </span>
                        )}
                      </div>

                      <div className="p-4 flex flex-col flex-1 justify-between">
                        <div>
                          <h3 className="mb-1 text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                            {listing.title}
                          </h3>
                          <p className="mb-4 text-xs text-muted-foreground flex items-center gap-1">
                            📍 {listing.location || 'România'}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between pt-3 border-t border-gray-50 w-full">
                          <span className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                            <Eye className="h-3.5 w-3.5" /> Vezi Detalii
                          </span>
                          <span className="text-base font-bold text-emerald-600">
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
            ) : (
              <div className="text-center py-20 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-500 font-medium">Nu am găsit anunțuri în această categorie.</p>
                <Link href="/anunturi" className="mt-3 inline-block text-sm font-bold text-emerald-600 hover:underline">
                  Resetează toate filtrele
                </Link>
              </div>
            )}
          </section>

        </div>
      </main>
      <Footer />
    </div>
  )
}