import { createClient } from '@/lib/supabase/server'
import { AdminCategoriesManager } from '@/components/admin-categories-manager'

export const metadata = {
  title: 'Gestionare Categorii',
}

export default async function AdminCategoriesPage() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  // Get listing counts for each category
  const categoriesWithStats = await Promise.all(
    (categories || []).map(async (category) => {
      const { count } = await supabase
        .from('listings')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', category.id)

      return {
        ...category,
        listings_count: count || 0,
      }
    })
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestionare Categorii</h1>
        <p className="text-muted-foreground">
          Adaugă, editează sau șterge categoriile de anunțuri
        </p>
      </div>

      <AdminCategoriesManager categories={categoriesWithStats} />
    </div>
  )
}
