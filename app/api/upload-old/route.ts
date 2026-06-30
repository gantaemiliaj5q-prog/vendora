import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()

  // 1. Preluăm categoriile din baza de date reală ca să aflăm UUID-urile lor active
  const { data: dbCategories } = await supabase.from('categories').select('id, slug')
  
  if (!dbCategories || dbCategories.length === 0) {
    return NextResponse.json({ 
      error: 'Tabela categories este goală! Rulează /api/seed mai întâi.' 
    }, { status: 400 })
  }

  const categoryMap = dbCategories.reduce((acc, cat) => {
    acc[cat.slug] = cat.id
    return acc
  }, {} as Record<string, string>)

  // 2. Luăm primul utilizator disponibil din profiles pentru a asocia anunțurile
  const { data: users } = await supabase.from('profiles').select('id').limit(1)
  const defaultUserId = users?.[0]?.id

  if (!defaultUserId) {
    return NextResponse.json({ error: 'Nu am găsit niciun utilizator în tabela profiles!' }, { status: 400 })
  }

  // 3. Matricea supremă cu TOATE cele 11 anunțuri (3 originale + 8 fallback)
  const allElevenListings = [
    // --- CELE 3 ANUNȚURI ORIGINALE (REPARATE CU UNGHIURI IDENTICE) ---
    {
      category_id: categoryMap['auto-moto'] || categoryMap['vehicule'] || dbCategories[0].id,
      title: 'Volkswagen Golf 7 || 2.0 TDI || DSG || 2018',
      description: 'Vând Volkswagen Golf 7, an fabricație 2018, motor 2.0 TDI, 150 CP. Cutie automată DSG de ultimă generație. Mașina este importată recent, are istoric complet digital în rețeaua VW, faruri LED, senzori de parcare 360 de grade și jante originale.',
      price: 64500,
      currency: 'RON',
      condition: 'utilizat',
      location: 'Cluj-Napoca',
      images: [
        'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=1200&auto=format&fit=crop', // Golf gri față
        'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=1200&auto=format&fit=crop', // Spate/Unghi lateral
        'https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=1200&auto=format&fit=crop'  // Interior / Volan bord
      ],
      status: 'activ',
      is_promoted: true,
      user_id: defaultUserId
    },
    {
      category_id: categoryMap['electronice'] || dbCategories[0].id,
      title: 'iPhone 15 Pro Max 256GB - Natural Titanium',
      description: 'Vând iPhone 15 Pro Max, stocare 256GB, culoarea stoc limitat Natural Titanium. Telefonul se prezintă în stare absolut impecabilă, fără nicio urmă de uzură sau zgârietură. Sănătatea bateriei este la 100%. Vine însoțit de cutia completă, cablu original împletit și factură cu garanție.',
      price: 4900,
      currency: 'RON',
      condition: 'nou',
      location: 'București',
      images: [
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1200&auto=format&fit=crop', // iPhone 15 Pro ecran/față
        'https://images.unsplash.com/photo-1695048133069-424d9c7913be?w=1200&auto=format&fit=crop', // Unghi spate carcasă titaniu
        'https://images.unsplash.com/photo-1695048065586-1fcbbfeb1a05?w=1200&auto=format&fit=crop'  // Detaliu camere/profil lateral
      ],
      status: 'activ',
      is_promoted: true,
      user_id: defaultUserId
    },
    {
      category_id: categoryMap['imobiliare'] || dbCategories[0].id,
      title: 'Apartament 2 camere modern || Loc de parcare inclus',
      description: 'Proprietar, ofer spre vânzare apartament de 2 camere, complet decomandat, situat într-un bloc rezidențial construit în 2022. Locuința dispune de finisaje moderne, balcon generos deschis, centrală proprie de apartament și un loc de parcare privat subteran înscris în cartea funciară.',
      price: 395000,
      currency: 'RON',
      condition: 'nou',
      location: 'Brașov',
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop', // Living modern
        'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&auto=format&fit=crop', // Unghi din hol spre bucătărie
        'https://images.unsplash.com/photo-1617806118233-18e1db207f62?w=1200&auto=format&fit=crop'  // Dormitorul din același set
      ],
      status: 'activ',
      is_promoted: true,
      user_id: defaultUserId
    },

    // --- CELEALTE 8 ANUNȚURI FALLBACK (REPARATE ȘI ELE PERFECT) ---
    {
      category_id: categoryMap['imobiliare'] || dbCategories[0].id,
      title: 'Apartament 3 camere lux - Zona Centrală București',
      description: 'Ofer spre vânzare un apartament de lux cu 3 camere, situat ultracentral. Proprietatea este complet renovată recent de un designer de interior, folosind finisaje premium și mobilier custom-made. Dispune de un living open-space, două dormitoare elegante și o bucătărie complet utilată.',
      price: 185000,
      currency: 'EUR',
      condition: 'nou',
      location: 'București, Sector 1',
      images: [
        'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&auto=format&fit=crop', // Living unghi 1
        'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&auto=format&fit=crop', // Living unghi 2
        'https://images.unsplash.com/photo-1616137422495-1e902b721119?w=1200&auto=format&fit=crop'  // Detaliu dining
      ],
      status: 'activ',
      is_promoted: false,
      user_id: defaultUserId
    },
    {
      category_id: categoryMap['imobiliare'] || dbCategories[0].id,
      title: 'Casă modernă cu piscină exterioară - Corbeanca',
      description: 'Casă individuală superbă localizată în Corbeanca, finisată în totalitate. Curtea este amenajată cu gazon, sistem de irigații automat și o piscină exterioară încălzită. Interiorul minimalist oferă un living generos cu spații vitrate mari și încălzire în pardoseală.',
      price: 320000,
      currency: 'EUR',
      condition: 'nou',
      location: 'Corbeanca, Ilfov',
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop', // Casă albă exterior cu piscină
        'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=1200&auto=format&fit=crop', // Interiorul exact al ACELEIAȘI case
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&auto=format&fit=crop'  // Bucătăria din cadrul aceleiași ședințe foto
      ],
      status: 'activ',
      is_promoted: false,
      user_id: defaultUserId
    },
    {
      category_id: categoryMap['imobiliare'] || dbCategories[0].id,
      title: 'Garsonieră complet mobilată - Militari Residence',
      description: 'De închiriat garsonieră spațioasă situată într-un bloc nou în Militari Residence. Locuința este mobilată complet și utilată cu electrocasnice noi. Acces rapid la mijloacele de transport în comun și centrele comerciale din zonă.',
      price: 350,
      currency: 'EUR',
      condition: 'utilizat',
      location: 'București, Sector 6',
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop', // Vedere generală
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop', // Unghi spre pat
        'https://images.unsplash.com/photo-1493809842364-78817aba7f7d?w=1200&auto=format&fit=crop'  // Bucătărie mică
      ],
      status: 'activ',
      is_promoted: false,
      user_id: defaultUserId
    },
    {
      category_id: categoryMap['electronice'] || dbCategories[0].id,
      title: 'MacBook Pro 16" M3 Max - Nou, Sigilat',
      description: 'Vând MacBook Pro de 16 inci, procesor Apple M3 Max, 64GB memorie unificată și 1TB stocare SSD. Dispozitivul este nou-nouț, în cutia originală sigilată de fabrică. Vine cu factură fiscală și garanție oficială valabilă 24 de luni.',
      price: 17500,
      currency: 'RON',
      condition: 'nou',
      location: 'București',
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&auto=format&fit=crop', // Laptop din față deschis
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=1200&auto=format&fit=crop', // Profil lateral tastatură
        'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=1200&auto=format&fit=crop'  // Detaliu carcasă aluminiu
      ],
      status: 'activ',
      is_promoted: false,
      user_id: defaultUserId
    },
    {
      category_id: categoryMap['auto-moto'] || categoryMap['vehicule'] || dbCategories[0].id,
      title: 'BMW Seria 3 320d Xdrive - 2017 - Pachet M original',
      description: 'Vând BMW Seria 3, motorizare 2.0 diesel, tracțiune integrală Xdrive. Autoturismul are 175.000 km certificabili cu istoric complet. Cutie automată Steptronic, pachet exterior și interior M original din fabrică, faruri LED adaptive.',
      price: 15300,
      currency: 'EUR',
      condition: 'utilizat',
      location: 'Cluj-Napoca',
      images: [
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&auto=format&fit=crop', // Mașină albastră din față
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&auto=format&fit=crop', // Spate
        'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&auto=format&fit=crop'  // Bord interior volan
      ],
      status: 'activ',
      is_promoted: false,
      user_id: defaultUserId
    },
    {
      category_id: categoryMap['auto-moto'] || categoryMap['vehicule'] || dbCategories[0].id,
      title: 'Bicicletă MTB Cross Country 29" - Stare Excelentă',
      description: 'Bicicletă echipată profesional pentru Cross Country, cu roți pe 29 de inci și cadru din aluminiu ușor. Furcă pneumatică cu blocaj pe ghidon, frâne pe disc hidraulice și schimbătoare din gama Shimano Deore de ultimă generație.',
      price: 2000,
      currency: 'RON',
      condition: 'utilizat',
      location: 'Craiova',
      images: [
        'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=1200&auto=format&fit=crop', // Bicicletă lateral profil
        'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=1200&auto=format&fit=crop', // Unghi cu roata față
        'https://images.unsplash.com/photo-1576435465679-6aa10b45c404?w=1200&auto=format&fit=crop'  // Ghidon de aproape
      ],
      status: 'activ',
      is_promoted: false,
      user_id: defaultUserId
    },
    {
      category_id: categoryMap['moda'] || dbCategories[0].id,
      title: 'Geantă Louis Vuitton Neverfull MM - Cu cutie și dustbag',
      description: 'Geantă de lux originală Louis Vuitton Neverfull, mărimea medie MM. Achiziționată personal din magazin oficial, se află într-o condiție estetică impecabilă, fără semne de uzură pe colțuri. Include accesoriile originale și factura.',
      price: 4500,
      currency: 'RON',
      condition: 'utilizat',
      location: 'București',
      images: [
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200&auto=format&fit=crop', // Geantă generală
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&auto=format&fit=crop', // Detaliu monogramă material
        'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=1200&auto=format&fit=crop'  // Interior căptușeală
      ],
      status: 'activ',
      is_promoted: false,
      user_id: defaultUserId
    },
    {
      category_id: categoryMap['casa-gradina'] || dbCategories[0].id,
      title: 'Set mobilier terasă/grădină din ratan sintetic',
      description: 'Set modern alcătuit din 4 piese ideale pentru balcon, terasă sau curte: o canapea confortabilă de 2 locuri, două fotolii individuale și o măsuță elegantă de cafea prevăzută cu blat securizat din sticlă neagră.',
      price: 1599,
      currency: 'RON',
      condition: 'nou',
      location: 'Oradea',
      images: [
        'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=1200&auto=format&fit=crop', // Set exterior ratan
        'https://images.unsplash.com/photo-1449247613801-ab06418e2861?w=1200&auto=format&fit=crop', // Plan apropiat pe perne textură
        'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1200&auto=format&fit=crop'  // Un fotoliu individual din set
      ],
      status: 'activ',
      is_promoted: false,
      user_id: defaultUserId
    }
  ]

  // 4. Inserăm TOATE cele 11 în tabela Supabase curată
  const { error } = await supabase.from('listings').insert(allElevenListings)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Succes total! Toate cele 11 anunțuri de pe site au fost salvate cu unghiuri multiple de imagini!' })
}