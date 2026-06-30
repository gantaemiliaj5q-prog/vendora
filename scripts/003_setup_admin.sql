-- Script pentru a seta un utilizator ca admin
-- IMPORTANT: Înlocuiește EMAIL_UTILIZATOR cu email-ul tău real

-- Actualizează profilul utilizatorului pentru a-l face admin
-- Rulează această comandă DUPĂ ce te-ai înregistrat pe site

UPDATE public.profiles
SET role = 'admin'
WHERE email = 'EMAIL_UTILIZATOR';

-- Alternativ, dacă vrei să faci admin pe baza ID-ului din auth.users:
-- UPDATE public.profiles
-- SET role = 'admin'
-- WHERE id = (SELECT id FROM auth.users WHERE email = 'EMAIL_UTILIZATOR');

-- Verifică că s-a setat corect:
-- SELECT id, full_name, email, role FROM public.profiles WHERE role = 'admin';
