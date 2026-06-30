import { createClient } from '@/lib/supabase/server'
import { AdminReportsTable } from '@/components/admin-reports-table'

export const metadata = {
  title: 'Raportări',
}

interface PageProps {
  searchParams: Promise<{ status?: string; page?: string }>
}

export default async function AdminReportsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const status = params.status || 'pending'
  const page = parseInt(params.page || '1', 10)
  const perPage = 20

  const supabase = await createClient()

  let query = supabase
    .from('reports')
    .select(
      '*, listings(id, title), reporter:profiles!reports_reporter_id_fkey(full_name, email)',
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .range((page - 1) * perPage, page * perPage - 1)

  if (status !== 'all') {
    query = query.eq('status', status)
  }

  const { data: reports, count } = await query

  const totalPages = Math.ceil((count || 0) / perPage)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Raportări</h1>
        <p className="text-muted-foreground">
          Gestionează raportările de la utilizatori
        </p>
      </div>

      <AdminReportsTable
        reports={reports || []}
        currentStatus={status}
        currentPage={page}
        totalPages={totalPages}
        totalCount={count || 0}
      />
    </div>
  )
}
