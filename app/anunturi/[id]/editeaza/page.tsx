import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ListingForm } from '@/components/listing-form'

interface PageProps {
  params: Promise<{ id: string }>
}

export const metadata = {
  title: 'Editează anunțul',
}

export default async function EditListingPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: listing } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!listing) {
    redirect('/cont/anunturi')
  }

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h1 className="mb-8 text-3xl font-bold">Editează anunțul</h1>
            <ListingForm
  categories={categories || []}
  userId={user.id}
  listing={listing}
/>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
