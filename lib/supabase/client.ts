import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error("Eroare: Lipsesc cheile Supabase din .env.local!")
  }

  return createBrowserClient(supabaseUrl!, supabaseKey!)
}
