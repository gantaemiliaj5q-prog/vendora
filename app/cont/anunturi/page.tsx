import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { UserListingsTable } from '@/components/user-listings-table'
import { isAdminProfile } from '@/lib/profile'
import { Button } from '@/components/ui/button'
import { Plus, Package } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Anunțurile mele',
}

export default async function UserListingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?redirect=/cont/anunturi')
  }

  const { data: listings } = await supabase
    .from('listings')
    .select('*, category:categories(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin, role')
    .eq('id', user.id)
    .maybeSingle()

  const isAdmin = isAdminProfile(profile)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">Anunțurile mele</h1>
              <p className="mt-1 text-muted-foreground">
                Gestionează toate anunțurile tale
              </p>
            </div>
            <Button asChild>
              <Link href="/anunturi/adauga">
                <Plus className="mr-2 h-4 w-4" />
                Adaugă anunț
              </Link>
            </Button>
          </div>

          {listings && listings.length > 0 ? (
            <UserListingsTable listings={listings} isAdmin={isAdmin} />
          ) : (
            <div className="rounded-lg border border-dashed border-border bg-card p-12 text-center">
              <Package className="mx-auto h-12 w-12 text-muted-foreground" />
              <h2 className="mt-4 text-lg font-semibold">Niciun anunț</h2>
              <p className="mt-2 text-muted-foreground">
                Nu ai publicat încă niciun anunț. Începe să vinzi acum!
              </p>
              <Button className="mt-4" asChild>
                <Link href="/anunturi/adauga">
                  <Plus className="mr-2 h-4 w-4" />
                  Publică primul anunț
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
