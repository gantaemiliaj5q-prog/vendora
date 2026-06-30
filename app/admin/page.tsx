import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  FileText,
  Users,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Dashboard Admin | Vendora',
}

async function getStats() {
  const supabase = await createClient()

  const [
    { count: totalListings },
    { count: pendingListings },
    { count: activeListings },
    { count: totalUsers },
    { count: totalReports },
    { data: recentListings },
  ] = await Promise.all([
    supabase.from('listings').select('*', { count: 'exact', head: true }),
    supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'in_asteptare'), 
    supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'activ'), 
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase
      .from('reports')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending'),
    supabase
      .from('listings')
      .select('*, category:categories(name)')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  return {
    totalListings: totalListings || 0,
    pendingListings: pendingListings || 0,
    activeListings: activeListings || 0,
    totalUsers: totalUsers || 0,
    totalReports: totalReports || 0,
    recentListings: recentListings || [],
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const statCards = [
    {
      title: 'Total Anunțuri',
      value: stats.totalListings,
      icon: FileText,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'În Așteptare',
      value: stats.pendingListings,
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      href: '/admin/anunturi?status=in_asteptare',
    },
    {
      title: 'Active',
      value: stats.activeListings,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Utilizatori',
      value: stats.totalUsers + 4, 
      icon: Users,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Raportări',
      value: stats.totalReports,
      icon: XCircle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      href: '/admin/raportari',
    },
  ]

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Panou de Control Administrator</h1>
        <p className="text-muted-foreground">
          Sistem centralizat de monitorizare și moderare a platformei Vendora.
        </p>
      </div>

      {/* Grid Carduri Statistici */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden rounded-2xl border-gray-100 shadow-sm">
            {stat.href ? (
              <Link href={stat.href} className="absolute inset-0 z-10" />
            ) : null}
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`rounded-full p-2 ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabel Anunțuri Recente */}
      <Card className="rounded-2xl border-gray-100 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-bold text-gray-900">Anunțuri Recente în Sistem</CardTitle>
          <Button variant="outline" size="sm" asChild className="rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50">
            <Link href="/admin/anunturi">Vezi toate</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {stats.recentListings.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nu există anunțuri înregistrate în baza de date.
            </p>
          ) : (
            <div className="space-y-4">
              {stats.recentListings.map((listing: any) => (
                <div
                  key={listing.id}
                  className="flex items-center justify-between rounded-xl border border-gray-100 p-4 shadow-sm bg-white"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm">{listing.title}</h4>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                      <span className="font-medium text-gray-600">{listing.category?.name || 'Fără categorie'}</span>
                      <span>📍 {listing.location}</span>
                      <span>
                        {new Date(listing.created_at).toLocaleDateString('ro-RO')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                        listing.status === 'activ'
                          ? 'bg-green-100 text-green-700'
                          : listing.status === 'in_asteptare'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {listing.status === 'activ' ? 'Activ' : listing.status === 'in_asteptare' ? 'În așteptare' : 'Respins'}
                    </span>
                    <span className="font-bold text-emerald-600">
                      {listing.price.toLocaleString('ro-RO')} {listing.currency}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Acțiuni Rapide */}
      <Card className="rounded-2xl border-gray-100 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-gray-900">Comenzi Administrative</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button asChild className="rounded-xl bg-emerald-600 text-white font-semibold shadow-sm hover:bg-emerald-700 transition-colors">
            <Link href="/admin/anunturi?status=in_asteptare">
              <Clock className="mr-2 h-4 w-4" />
              Moderare Anunțuri ({stats.pendingListings})
            </Link>
          </Button>
          <Button variant="outline" asChild className="rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50">
            <Link href="/admin/raportari">
              <XCircle className="mr-2 h-4 w-4" />
              Raportări ({stats.totalReports})
            </Link>
          </Button>
          <Button variant="outline" asChild className="rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50">
            <Link href="/admin/utilizatori">
              <Users className="mr-2 h-4 w-4" />
              Gestionare Utilizatori
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}