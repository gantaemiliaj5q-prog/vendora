import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const categories = [
  { name: 'Electronice', slug: 'electronice', icon: 'Smartphone' },
  { name: 'Vehicule', slug: 'vehicule', icon: 'Car' },
  { name: 'Imobiliare', slug: 'imobiliare', icon: 'Home' },
  { name: 'Modă & Frumusețe', slug: 'moda', icon: 'Shirt' },
  { name: 'Casa & Grădina', slug: 'casa-gradina', icon: 'Sofa' },
  { name: 'Sport & Timp liber', slug: 'sport', icon: 'Dumbbell' },
  { name: 'Animale', slug: 'animale', icon: 'Dog' },
  { name: 'Servicii', slug: 'servicii', icon: 'Briefcase' },
  { name: 'Locuri de muncă', slug: 'locuri-munca', icon: 'Users' },
  { name: 'Altele', slug: 'altele', icon: 'MoreHorizontal' },
]

const promotionPackages = [
  { name: 'Basic', description: 'Evidențiază anunțul tău timp de 7 zile', price_cents: 999, duration_days: 7, features: ['Anunț evidențiat'], is_active: true },
  { name: 'Standard', description: 'Promovare completă pentru 14 zile', price_cents: 1999, duration_days: 14, features: ['Badge "Promovat"'], is_active: true },
  { name: 'Premium', description: 'Vizibilitate maximă 30 de zile', price_cents: 3999, duration_days: 30, features: ['Afișare în pagina principală'], is_active: true },
]

export async function GET() {
  try {
    const supabase = await createClient()

    // 1. Introducem categoriile dacă nu sunt deja
    const { data: existingCategories } = await supabase.from('categories').select('id').limit(1)
    if (!existingCategories || existingCategories.length === 0) {
      await supabase.from('categories').insert(categories)
    }

    // 2. Introducem pachetele dacă nu sunt deja
    const { data: existingPackages } = await supabase.from('promotion_packages').select('id').limit(1)
    if (!existingPackages || existingPackages.length === 0) {
      await supabase.from('promotion_packages').insert(promotionPackages)
    }

    // 3. Identificăm profilul tău de admin pentru a-i asocia anunțurile
    const { data: profile } = await supabase.from('profiles').select('id').limit(1).single()
    if (!profile) {
      return NextResponse.json({ error: "Trebuie să fii logată pe site măcar o dată ca să îți putem genera anunțuri de test pe contul tău!" }, { status: 400 })
    }

    // Luăm ID-urile categoriilor proaspăt create pentru a face legătura corectă
    const { data: allCategories } = await supabase.from('categories').select('id, slug')
    const electroniceId = allCategories?.find(c => c.slug === 'electronice')?.id
    const vehiculeId = allCategories?.find(c => c.slug === 'vehicule')?.id
    const imobiliareId = allCategories?.find(c => c.slug === 'imobiliare')?.id

    // 4. Ștergem anunțurile vechi de test (dacă existau blocate) și adăugăm unele proaspete, cu poze reale
    await supabase.from('listings').delete().eq('user_id', profile.id)

    const { error: listingsError } = await supabase.from('listings').insert([
      {
        user_id: profile.id,
        category_id: vehiculeId,
        title: 'Volkswagen Golf 7 || 2.0 TDI || DSG || 2018',
        description: 'Vând Volkswagen Golf 7 în stare impecabilă din punct de vedere estetic și tehnic. Cutie automată DSG, faruri LED, senzori parcare față/spate, navigație mare cu touch, scaune încălzite. Revizii efectuate exclusiv în reprezentanță.',
        price: 64500.00,
        currency: 'RON',
        condition: 'utilizat',
        location: 'Cluj-Napoca',
        status: 'activ',
        images: ['https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&auto=format&fit=crop'],
        views_count: 124,
        is_promoted: true
      },
      {
        user_id: profile.id,
        category_id: electroniceId,
        title: 'iPhone 15 Pro Max 256GB - Natural Titanium',
        description: 'Telefonul se află în stare ca nouă, fără absolut nicio urmă de uzură sau zgârietură. Sănătate baterie 100%. Vine însoțit de cutia originală, cablu de date și factură/garanție încă 18 luni. Accept orice test.',
        price: 4900.00,
        currency: 'RON',
        condition: 'nou',
        location: 'București',
        status: 'activ',
        images: ['https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop'],
        views_count: 310,
        is_promoted: true
      },
      {
        user_id: profile.id,
        category_id: imobiliareId,
        title: 'Apartament 2 camere modern || Loc de parcare inclus',
        description: 'Proprietar, ofer spre vânzare apartament cu 2 camere complet mobilat și utilat premium, situat într-un complex rezidențial nou. Dispune de centrală proprie, încălzire în pardoseală, aer condiționat și balcon deschis de 6mp.',
        price: 395000.00,
        currency: 'RON',
        condition: 'nou',
        location: 'Brașov',
        status: 'activ',
        images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop'],
        views_count: 56,
        is_promoted: false
      }
    ])

    if (listingsError) {
      return NextResponse.json({ error: 'Eroare la adăugarea anunțurilor', details: listingsError }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Felicitări! Baza de date a fost completată cu categorii, pachete și 3 anunțuri demo superbe cu imagini. Dă refresh la prima pagină!' 
    })

  } catch (error: any) {
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}