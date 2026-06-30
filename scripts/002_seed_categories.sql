-- AnunturiRO - Seed Categories
-- ==============================

-- Main Categories
INSERT INTO public.categories (name, slug, icon, order_index) VALUES
  ('Imobiliare', 'imobiliare', 'Home', 1),
  ('Auto, Moto', 'auto-moto', 'Car', 2),
  ('Electronice', 'electronice', 'Smartphone', 3),
  ('Casa si Gradina', 'casa-gradina', 'Sofa', 4),
  ('Moda', 'moda', 'Shirt', 5),
  ('Sport, Hobby', 'sport-hobby', 'Dumbbell', 6),
  ('Locuri de Munca', 'locuri-munca', 'Briefcase', 7),
  ('Servicii', 'servicii', 'Wrench', 8),
  ('Animale', 'animale', 'PawPrint', 9),
  ('Altele', 'altele', 'Package', 10)
ON CONFLICT (slug) DO NOTHING;

-- Subcategories for Imobiliare
INSERT INTO public.categories (name, slug, icon, parent_id, order_index)
SELECT 'Apartamente', 'apartamente', 'Building', id, 1 FROM public.categories WHERE slug = 'imobiliare'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, slug, icon, parent_id, order_index)
SELECT 'Case', 'case', 'Home', id, 2 FROM public.categories WHERE slug = 'imobiliare'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, slug, icon, parent_id, order_index)
SELECT 'Terenuri', 'terenuri', 'TreeDeciduous', id, 3 FROM public.categories WHERE slug = 'imobiliare'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, slug, icon, parent_id, order_index)
SELECT 'Spatii comerciale', 'spatii-comerciale', 'Store', id, 4 FROM public.categories WHERE slug = 'imobiliare'
ON CONFLICT (slug) DO NOTHING;

-- Subcategories for Auto, Moto
INSERT INTO public.categories (name, slug, icon, parent_id, order_index)
SELECT 'Autoturisme', 'autoturisme', 'Car', id, 1 FROM public.categories WHERE slug = 'auto-moto'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, slug, icon, parent_id, order_index)
SELECT 'Motociclete', 'motociclete', 'Bike', id, 2 FROM public.categories WHERE slug = 'auto-moto'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, slug, icon, parent_id, order_index)
SELECT 'Piese auto', 'piese-auto', 'Cog', id, 3 FROM public.categories WHERE slug = 'auto-moto'
ON CONFLICT (slug) DO NOTHING;

-- Subcategories for Electronice
INSERT INTO public.categories (name, slug, icon, parent_id, order_index)
SELECT 'Telefoane', 'telefoane', 'Smartphone', id, 1 FROM public.categories WHERE slug = 'electronice'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, slug, icon, parent_id, order_index)
SELECT 'Laptop-uri', 'laptopuri', 'Laptop', id, 2 FROM public.categories WHERE slug = 'electronice'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, slug, icon, parent_id, order_index)
SELECT 'TV, Audio', 'tv-audio', 'Tv', id, 3 FROM public.categories WHERE slug = 'electronice'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories (name, slug, icon, parent_id, order_index)
SELECT 'Console, Gaming', 'console-gaming', 'Gamepad2', id, 4 FROM public.categories WHERE slug = 'electronice'
ON CONFLICT (slug) DO NOTHING;

-- Seed promotion packages
INSERT INTO public.promotion_packages (name, description, price_cents, duration_days, features, is_active) VALUES
  ('Basic', 'Promovare de baza pentru anuntul tau', 999, 7, ARRAY['Badge "Promovat"', 'Pozitie prioritara in lista'], true),
  ('Premium', 'Vizibilitate sporita pentru anuntul tau', 2499, 14, ARRAY['Badge "Promovat"', 'Pozitie prioritara', 'Evidentiare cu culoare', 'Top in categorie'], true),
  ('VIP', 'Maximizeaza vizibilitatea anuntului', 4999, 30, ARRAY['Badge "VIP"', 'Pozitie prioritara', 'Evidentiare maxima', 'Banner pe homepage', 'Top in toate listele'], true)
ON CONFLICT DO NOTHING;
