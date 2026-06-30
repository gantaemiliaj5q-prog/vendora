-- Script pentru crearea anunțurilor demo
-- Acest script creează anunțuri profesionale pentru fiecare categorie

-- Mai întâi, obținem ID-urile categoriilor
DO $$
DECLARE
    cat_imobiliare UUID;
    cat_auto UUID;
    cat_electronice UUID;
    cat_moda UUID;
    cat_casa UUID;
    cat_sport UUID;
    cat_animale UUID;
    cat_joburi UUID;
    cat_servicii UUID;
    demo_user_id UUID;
BEGIN
    -- Obține ID-urile categoriilor
    SELECT id INTO cat_imobiliare FROM public.categories WHERE slug = 'imobiliare';
    SELECT id INTO cat_auto FROM public.categories WHERE slug = 'auto-moto';
    SELECT id INTO cat_electronice FROM public.categories WHERE slug = 'electronice';
    SELECT id INTO cat_moda FROM public.categories WHERE slug = 'moda';
    SELECT id INTO cat_casa FROM public.categories WHERE slug = 'casa-gradina';
    SELECT id INTO cat_sport FROM public.categories WHERE slug = 'sport-hobby';
    SELECT id INTO cat_animale FROM public.categories WHERE slug = 'animale';
    SELECT id INTO cat_joburi FROM public.categories WHERE slug = 'locuri-de-munca';
    SELECT id INTO cat_servicii FROM public.categories WHERE slug = 'servicii';

    -- Obține primul utilizator ca proprietar al anunțurilor demo (sau creează unul)
    SELECT id INTO demo_user_id FROM public.profiles LIMIT 1;

    -- Dacă nu există niciun utilizator, nu putem crea anunțuri
    IF demo_user_id IS NULL THEN
        RAISE NOTICE 'Nu există utilizatori în baza de date. Creează un cont mai întâi.';
        RETURN;
    END IF;

    -- ========== IMOBILIARE ==========
    INSERT INTO public.listings (user_id, category_id, title, description, price, currency, condition, location, images, status, views)
    VALUES
    (demo_user_id, cat_imobiliare, 'Apartament 3 camere - Zona Centrală București', 
     'Vând apartament spațios cu 3 camere în zona centrală a Bucureștiului. 
     
**Caracteristici:**
- Suprafață utilă: 85 mp
- Etaj: 4 din 8
- An construcție: 2018
- Balcon: 12 mp
- Loc parcare subteran inclus

**Dotări:**
- Centrală termică proprie
- Aer condiționat în toate camerele
- Parchet laminat premium
- Bucătărie complet utilată

**Vecinătăți:**
- Metrou la 5 minute
- Parc, școală și grădiniță în apropiere
- Supermarket la parterul blocului

Apartamentul este într-o stare impecabilă, gata de mutare. Accept credit bancar.', 
     185000, 'EUR', 'nou', 'București, Sector 1', 
     ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800'],
     'active', 234),

    (demo_user_id, cat_imobiliare, 'Casă cu grădină - Corbeanca, Ilfov', 
     'Vând casă modernă P+1 în zona rezidențială Corbeanca.

**Specificații casă:**
- Suprafață construită: 180 mp
- Suprafață teren: 450 mp
- 4 dormitoare, 3 băi
- Living open-space cu bucătărie
- Garaj pentru 2 mașini

**Facilități:**
- Piscină încălzită
- Sistem smart home
- Panouri solare
- Cameră tehnică complet echipată

Finisaje premium, mobilată complet. Comunitate închisă cu pază 24/7.',
     320000, 'EUR', 'nou', 'Corbeanca, Ilfov',
     ARRAY['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
     'active', 189),

    (demo_user_id, cat_imobiliare, 'Garsonieră de închiriat - Militari Residence',
     'Ofer spre închiriere garsonieră modernă în complexul Militari Residence.

**Detalii:**
- 38 mp utili
- Etaj 2
- Mobilată și utilată complet
- Balcon 6 mp

Preț: 350 EUR/lună (negociabil pentru contracte pe termen lung)
Disponibilă din data de 1 a lunii următoare.',
     350, 'EUR', 'folosit', 'București, Sector 6',
     ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
     'active', 412);

    -- ========== AUTO-MOTO ==========
    INSERT INTO public.listings (user_id, category_id, title, description, price, currency, condition, location, images, status, views)
    VALUES
    (demo_user_id, cat_auto, 'BMW Seria 5 520d xDrive - 2021', 
     'Vând BMW Seria 5, achiziționat de nou din reprezentanță.

**Specificații tehnice:**
- Motor: 2.0 diesel, 190 CP
- Transmisie: Automată 8 trepte
- Tracțiune: xDrive (integrală)
- Kilometraj: 45.000 km
- Fabricație: Noiembrie 2021

**Dotări:**
- Navigație Professional
- Scaune încălzite și ventilate
- Head-up display
- Cameră 360°
- Faruri LED adaptive
- Cruise control adaptiv
- Lane assist

Mașina este în stare impecabilă, întreținută exclusiv în service autorizat. Carte service completă.',
     42500, 'EUR', 'folosit', 'Cluj-Napoca',
     ARRAY['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800'],
     'active', 567),

    (demo_user_id, cat_auto, 'Volkswagen Golf 8 GTI - 2023',
     'Golf 8 GTI, primul proprietar, stare de showroom.

**Motor și performanță:**
- 2.0 TSI, 245 CP
- 0-100 km/h în 6.3 secunde
- Cutie DSG 7 trepte

**Dotări premium:**
- Digital Cockpit Pro
- Harman Kardon sound system
- Matrix LED
- Park Assist Plus
- Travel Assist

Km: 12.000 - garanție producător până în 2026.',
     38900, 'EUR', 'nou', 'Timișoara',
     ARRAY['https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800'],
     'active', 328),

    (demo_user_id, cat_auto, 'Honda CBR 600RR - 2020',
     'Vând Honda CBR 600RR, ediție specială.

- 599cc, 120 CP
- ABS
- Km: 8.500
- ITP valabil 2 ani

Include: 2 căști Shoei, costum piele complet, cizme racing.',
     9500, 'EUR', 'folosit', 'Brașov',
     ARRAY['https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800'],
     'active', 245);

    -- ========== ELECTRONICE ==========
    INSERT INTO public.listings (user_id, category_id, title, description, price, currency, condition, location, images, status, views)
    VALUES
    (demo_user_id, cat_electronice, 'MacBook Pro 16" M3 Max - NOU, sigilat',
     'Vând MacBook Pro 16 inch cu procesor M3 Max, nou, sigilat.

**Configurație:**
- Procesor: Apple M3 Max (14-core CPU, 30-core GPU)
- Memorie: 36 GB RAM unificată
- Stocare: 1 TB SSD
- Display: Liquid Retina XDR

Garantie Apple 2 ani. Factură și bon fiscal.',
     17500, 'RON', 'nou', 'București',
     ARRAY['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'],
     'active', 892),

    (demo_user_id, cat_electronice, 'iPhone 15 Pro Max 256GB - Natural Titanium',
     'iPhone 15 Pro Max, folosit 2 luni, stare impecabilă.

**Inclus în preț:**
- Cutie originală + accesorii nefolosite
- Husă Apple originală
- Folie sticlă aplicată

Baterie: 99% health
Garanție Apple: încă 10 luni',
     5200, 'RON', 'folosit', 'Iași',
     ARRAY['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800'],
     'active', 1203),

    (demo_user_id, cat_electronice, 'PlayStation 5 + 2 controllere + 5 jocuri',
     'Vând PS5 Disc Edition, pachet complet pentru gaming.

**Include:**
- Consola PS5 Disc Edition
- 2x DualSense controller (alb + negru)
- FIFA 24
- God of War Ragnarok
- Spider-Man 2
- Horizon Forbidden West
- Gran Turismo 7

Toate jocurile sunt pe disc, în cutiile originale.',
     2800, 'RON', 'folosit', 'Constanța',
     ARRAY['https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800'],
     'active', 678);

    -- ========== MODA ==========
    INSERT INTO public.listings (user_id, category_id, title, description, price, currency, condition, location, images, status, views)
    VALUES
    (demo_user_id, cat_moda, 'Geantă Louis Vuitton Neverfull MM - Original',
     'Vând geantă Louis Vuitton Neverfull MM, cumpărată din Paris.

**Detalii:**
- Model: Neverfull MM
- Material: Canvas Monogram
- Interior: Roșu
- Dimensiuni: 32x29x17 cm

Include: dustbag original, bon fiscal, certificat autenticitate.
Stare foarte bună, folosită de câteva ori.',
     4500, 'RON', 'folosit', 'București',
     ARRAY['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800'],
     'active', 445),

    (demo_user_id, cat_moda, 'Sneakers Nike Air Jordan 1 Retro High - Mărimea 43',
     'Nike Air Jordan 1 Retro High OG "Chicago Lost and Found"

- Mărime: 43 EU / 9.5 US
- Stare: Noi, nefolosiți
- Cutie originală

Ediție limitată, sold out peste tot.',
     1200, 'RON', 'nou', 'Cluj-Napoca',
     ARRAY['https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800'],
     'active', 567),

    (demo_user_id, cat_moda, 'Ceas Tissot PRX Automatic - Bărbătesc',
     'Tissot PRX Powermatic 80, cumpărat în 2023.

**Specificații:**
- Mecanism: Automatic Powermatic 80
- Rezervă de putere: 80 ore
- Carcasă: Oțel, 40mm
- Rezistență la apă: 100m

Cu cutie, certificat și 2 ani garanție rămasă.',
     2100, 'RON', 'folosit', 'Timișoara',
     ARRAY['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
     'active', 234);

    -- ========== CASĂ ȘI GRĂDINĂ ==========
    INSERT INTO public.listings (user_id, category_id, title, description, price, currency, condition, location, images, status, views)
    VALUES
    (demo_user_id, cat_casa, 'Canapea extensibilă 3 locuri - Stil Scandinav',
     'Vând canapea extensibilă foarte confortabilă.

**Caracteristici:**
- Dimensiuni: 220x95x85 cm
- Dimensiuni pat: 200x140 cm
- Material: Textil gri deschis
- Picioare lemn stejar

Lada de depozitare încăpătoare. Folosită 1 an, fără pete sau uzură.',
     1800, 'RON', 'folosit', 'București, Sector 3',
     ARRAY['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800'],
     'active', 345),

    (demo_user_id, cat_casa, 'Robot de bucătărie KitchenAid Artisan 4.8L',
     'KitchenAid Artisan, culoare Empire Red.

Include: bol 4.8L, tel, paletă, cârlig frământat.
Folosit de câteva ori, practic nou.
Cu cutie originală și garanție.',
     1900, 'RON', 'folosit', 'Oradea',
     ARRAY['https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=800'],
     'active', 189);

    -- ========== SPORT ȘI HOBBY ==========
    INSERT INTO public.listings (user_id, category_id, title, description, price, currency, condition, location, images, status, views)
    VALUES
    (demo_user_id, cat_sport, 'Bicicletă MTB Cube Attention 29" - 2023',
     'Cube Attention 29, pentru mountain biking.

**Specificații:**
- Cadru: Aluminiu 6061
- Furca: RockShox Judy, 100mm
- Transmisie: Shimano Deore 1x12
- Frâne: Shimano hidraulice
- Roți: 29 inch

Km parcurși: ~500. Stare excelentă, revisie făcută.',
     3200, 'RON', 'folosit', 'Sibiu',
     ARRAY['https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800'],
     'active', 423),

    (demo_user_id, cat_sport, 'Set complet Golf - TaylorMade + Geantă Titleist',
     'Vând set complet de golf, ideal pentru începători și intermediari.

**Include:**
- Driver TaylorMade SIM2
- Fairway woods (3W, 5W)
- Hibrizi (4H, 5H)
- Fiere 6-PW
- Putter Odyssey
- Geantă Titleist cu trepied

Toate în stare foarte bună.',
     4500, 'RON', 'folosit', 'București',
     ARRAY['https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800'],
     'active', 156);

    -- ========== ANIMALE ==========
    INSERT INTO public.listings (user_id, category_id, title, description, price, currency, condition, location, images, status, views)
    VALUES
    (demo_user_id, cat_animale, 'Pui Golden Retriever - Cu pedigree',
     'Oferim spre adopție pui Golden Retriever din părinți campioni.

**Detalii:**
- Vârstă: 8 săptămâni
- Vaccinați și deparazitați
- Microcip
- Carnet de sănătate
- Pedigree ACHR

Părinții pot fi vizitați. Oferim suport și sfaturi pentru creștere.',
     2500, 'RON', 'nou', 'Pitești',
     ARRAY['https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800'],
     'active', 892),

    (demo_user_id, cat_animale, 'Acvariu complet echipat 200L + Pești tropicali',
     'Vând acvariu complet, gata de folosire.

**Include:**
- Cuvă 200L cu mobilier
- Filtru extern Eheim
- Încălzitor 200W
- Iluminat LED
- Substrate și decorațiuni
- ~30 pești tropicali (guppy, neon, corydoras)

Funcțional, ecosistem stabil de 2 ani.',
     1200, 'RON', 'folosit', 'București',
     ARRAY['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'],
     'active', 234);

    -- ========== LOCURI DE MUNCĂ ==========
    INSERT INTO public.listings (user_id, category_id, title, description, price, currency, condition, location, images, status, views)
    VALUES
    (demo_user_id, cat_joburi, 'Senior Software Developer - Remote (Full-time)',
     'Companie IT în creștere caută Senior Software Developer.

**Cerințe:**
- 5+ ani experiență în dezvoltare software
- Cunoștințe solide: React, Node.js, TypeScript
- Experiență cu baze de date SQL și NoSQL
- Engleză nivel avansat

**Oferim:**
- Salariu: 8000-12000 RON net
- 100% Remote
- Echipament de lucru
- Buget pentru training
- 25 zile concediu

Aplică trimițând CV-ul la jobs@company.ro',
     0, 'RON', 'nou', 'Remote',
     ARRAY['https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800'],
     'active', 1567),

    (demo_user_id, cat_joburi, 'Barista cu experiență - Cafenea Centru Vechi',
     'Căutăm barista cu pasiune pentru cafea.

**Cerințe:**
- Minim 1 an experiență
- Cunoștințe latte art
- Persoană comunicativă

**Oferim:**
- Salariu competitiv + tips
- Program flexibil
- Training continuu
- Reduceri la produse

Program: L-V, 8:00-16:00 sau 14:00-22:00',
     0, 'RON', 'nou', 'București, Centru Vechi',
     ARRAY['https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800'],
     'active', 445);

    -- ========== SERVICII ==========
    INSERT INTO public.listings (user_id, category_id, title, description, price, currency, condition, location, images, status, views)
    VALUES
    (demo_user_id, cat_servicii, 'Servicii Web Design & Development',
     'Creez website-uri moderne și funcționale.

**Servicii oferite:**
- Landing pages
- Magazine online (eCommerce)
- Site-uri de prezentare
- Aplicații web custom
- Optimizare SEO

**Tehnologii:** React, Next.js, WordPress, Shopify

Portofoliu disponibil la cerere. Prețuri începând de la 500 EUR.',
     500, 'EUR', 'nou', 'București / Remote',
     ARRAY['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'],
     'active', 678),

    (demo_user_id, cat_servicii, 'Meditații Matematică - Liceu & Facultate',
     'Profesor cu 10 ani experiență oferă meditații.

**Predau:**
- Matematică liceu (toate profilurile)
- Pregătire BAC
- Analiză matematică (facultate)
- Algebră liniară

**Format:**
- Online via Zoom
- La domiciliul elevului (București)

Preț: 100 RON/oră. Prima ședință gratuită!',
     100, 'RON', 'nou', 'București / Online',
     ARRAY['https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800'],
     'active', 345);

    RAISE NOTICE 'Anunțurile demo au fost create cu succes!';
END $$;
