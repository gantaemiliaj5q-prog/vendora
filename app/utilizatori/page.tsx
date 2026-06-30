import { createClient } from '@/lib/supabase/server'
import { AdminUsersTable } from '@/components/admin-users-table'

export const metadata = {
  title: 'Gestionare Utilizatori',
}

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string }>
}

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = parseInt(params.page || '1', 10)
  const search = params.search || ''
  const perPage = 20

  const supabase = await createClient()

  let query = supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * perPage, page * perPage - 1)

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)
  }

  const { data: users, count } = await query

  // Get listing counts for each user
  const usersWithStats = await Promise.all(
    (users || []).map(async (user) => {
      const { count: listingsCount } = await supabase
        .from('listings')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      return {
        ...user,
        listings_count: listingsCount || 0,
      }
    })
  )

  const totalPages = Math.ceil((count || 0) / perPage)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestionare Utilizatori</h1>
        <p className="text-muted-foreground">
          Vezi și gestionează utilizatorii platformei
        </p>
      </div>

      <AdminUsersTable
        users={usersWithStats}
        currentPage={page}
        totalPages={totalPages}
        totalCount={count || 0}
        searchQuery={search}
      />
    </div>
  )
}
