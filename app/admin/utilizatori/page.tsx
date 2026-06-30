import { createClient } from '@/lib/supabase/server'
import { AdminUsersTable } from '@/components/admin-users-table'

export const metadata = {
  title: 'Gestionare Utilizatori | Vendora Admin',
}

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string }>
}

// Utilizatori falși (Mocks) pentru popularea tabelului la licență
const fallbackUsers = [
  {
    id: 'user-mock-1',
    full_name: 'Mihai Ionescu',
    email: 'ionescu.mihai92@gmail.com',
    phone: '0722123456',
    created_at: '2026-01-15T14:32:00.000Z',
    listings_count: 3,
  },
  {
    id: 'user-mock-2',
    full_name: 'Elena Popescu',
    email: 'elena.popescu.design@yahoo.com',
    phone: '0745987654',
    created_at: '2026-02-20T09:15:00.000Z',
    listings_count: 2,
  },
  {
    id: 'user-mock-3',
    full_name: 'Andrei Dumitru',
    email: 'andrei.dumitru.auto@outlook.com',
    phone: '0766334455',
    created_at: '2026-03-05T18:45:00.000Z',
    listings_count: 4,
  },
  {
    id: 'user-mock-4',
    full_name: 'Raluca Marinescu',
    email: 'raluca.marinescu99@gmail.com',
    phone: '0731002299',
    created_at: '2026-04-12T11:20:00.000Z',
    listings_count: 1,
  }
]

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

  // Mapăm utilizatorii din DB și calculăm anunțurile
  const dbUsersWithStats = await Promise.all(
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

  // Combinăm utilizatorul logat real cu lista de utilizatori fictivi
  let combinedUsers = [...dbUsersWithStats, ...fallbackUsers]

  // Filtrare locală simplă pentru bara de căutare din admin (dacă există search query)
  if (search) {
    combinedUsers = combinedUsers.filter(u => 
      u.full_name?.toLowerCase().includes(search.toLowerCase()) || 
      u.email?.toLowerCase().includes(search.toLowerCase())
    )
  }

  const finalCount = combinedUsers.length
  const totalPages = Math.ceil(finalCount / perPage)

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Gestionare Utilizatori</h1>
        <p className="text-muted-foreground">
          Vizualizează, monitorizează și gestionează conturile active de pe platformă.
        </p>
      </div>

      <AdminUsersTable
        users={combinedUsers}
        currentPage={page}
        totalPages={totalPages}
        totalCount={finalCount}
        searchQuery={search}
      />
    </div>
  )
}