import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ListingForm } from '@/components/listing-form'

export const metadata = {
  title: 'Adaugă anunț',
  description: 'Publică un anunț nou pe Vendora',
}

export default async function AddListingPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?redirect=/anunturi/adauga')
  }

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .is('parent_id', null)
    .order('name')

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold sm:text-3xl">Adaugă un anunț nou</h1>
            <p className="mt-2 text-muted-foreground">
              Completează formularul de mai jos pentru a publica anunțul tău
            </p>
          </div>

          <ListingForm categories={categories || []} userId={user.id} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
