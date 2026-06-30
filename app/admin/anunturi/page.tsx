'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Eye, ExternalLink, ChevronLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function AdminListingsPage() {
  const searchParams = useSearchParams()
  const statusFilter = searchParams.get('status') || 'all'
  const userIdFilter = searchParams.get('user_id') || null

  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchAdminData() {
      setLoading(true)
      try {
        // Preluăm anunțurile direct prin clientul de browser (folosește sesiunea ta activă)
        const { data, error } = await supabase
          .from('listings')
          .select('*, categories(name), profiles(full_name)')
          .order('created_at', { ascending: false })

        if (error) throw error

        let dbListings = data || []

        // Normalizare și curățare structură date
        let normalized = dbListings.map((listing: any) => ({
          ...listing,
          status: listing.status || 'activ',
          profiles: { 
            full_name: listing.profiles?.full_name || 'Utilizator',
            email: ''
          },
          categories: listing.categories || { name: 'Diverse' }
        }))

        // LOGICĂ SIMULARE DEDICATĂ PENTRU UTILIZATORII FICTIVI (MOCK)
        if (userIdFilter) {
          if (userIdFilter === 'user-mock-1') {
            normalized = normalized.slice(0, 3).map(l => ({
              ...l,
              profiles: { full_name: 'Mihai Ionescu', email: 'ionescu.mihai92@gmail.com' }
            }))
          } else if (userIdFilter === 'user-mock-2') {
            normalized = normalized.slice(3, 5).map(l => ({
              ...l,
              profiles: { full_name: 'Elena Popescu', email: 'elena.popescu.design@yahoo.com' }
            }))
          } else if (userIdFilter === 'user-mock-3') {
            normalized = normalized.slice(2, 6).map(l => ({
              ...l,
              profiles: { full_name: 'Andrei Dumitru', email: 'andrei.dumitru.auto@outlook.com' }
            }))
          } else if (userIdFilter === 'user-mock-4') {
            normalized = normalized.slice(1, 2).map(l => ({
              ...l,
              profiles: { full_name: 'Raluca Marinescu', email: 'raluca.marinescu99@gmail.com' }
            }))
          } else {
            // Filtrul pentru utilizatorul tău real din DB
            normalized = normalized.filter(l => l.user_id === userIdFilter)
          }
        }

        // Filtrare după butoanele de status (activ, in_asteptare etc.)
        if (statusFilter !== 'all') {
          normalized = normalized.filter(l => l.status === statusFilter)
        }

        setListings(normalized)
      } catch (err) {
        console.error('Eroare la preluarea datelor de admin:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAdminData()
  }, [statusFilter, userIdFilter, supabase])

  // Determinarea dinamică a titlurilor
  let titleName = 'Toate Anunțurile'
  let descriptionText = `Administrează și monitorizează toate cele ${listings.length} anunțuri active din sistem.`

  if (userIdFilter) {
    if (userIdFilter === 'user-mock-1') titleName = 'Anunțuri publicate de Mihai Ionescu'
    else if (userIdFilter === 'user-mock-2') titleName = 'Anunțuri publicate de Elena Popescu'
    else if (userIdFilter === 'user-mock-3') titleName = 'Anunțuri publicate de Andrei Dumitru'
    else if (userIdFilter === 'user-mock-4') titleName = 'Anunțuri publicate de Raluca Marinescu'
    else titleName = `Anunțuri publicate de utilizator`
    descriptionText = 'Portofoliul curent de produse asociate acestui profil.'
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Se încarcă baza de date...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-2">
      {/* Header Pagina */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{titleName}</h1>
          <p className="text-muted-foreground mt-1">{descriptionText}</p>
        </div>
        {userIdFilter && (
          <Button variant="outline" size="sm" asChild className="self-start sm:self-center">
            <Link href="/admin/utilizatori">
              <ChevronLeft className="mr-1 h-4 w-4" /> Înapoi la Utilizatori
            </Link>
          </Button>
        )}
      </div>

      {/* Tab-uri Custom pentru Statusuri */}
      <div className="flex flex-wrap gap-2 bg-muted/40 p-1.5 rounded-lg w-fit">
        <Button variant={statusFilter === 'all' ? 'default' : 'ghost'} size="sm" asChild>
          <Link href={`/admin/anunturi?status=all${userIdFilter ? `&user_id=${userIdFilter}` : ''}`}>Toate</Link>
        </Button>
        <Button variant={statusFilter === 'in_asteptare' ? 'default' : 'ghost'} size="sm" asChild>
          <Link href={`/admin/anunturi?status=in_asteptare${userIdFilter ? `&user_id=${userIdFilter}` : ''}`}>În așteptare</Link>
        </Button>
        <Button variant={statusFilter === 'activ' ? 'default' : 'ghost'} size="sm" asChild>
          <Link href={`/admin/anunturi?status=activ${userIdFilter ? `&user_id=${userIdFilter}` : ''}`}>Active</Link>
        </Button>
        <Button variant={statusFilter === 'respins' ? 'default' : 'ghost'} size="sm" asChild>
          <Link href={`/admin/anunturi?status=respins${userIdFilter ? `&user_id=${userIdFilter}` : ''}`}>Respinse</Link>
        </Button>
        <Button variant={statusFilter === 'vandut' ? 'default' : 'ghost'} size="sm" asChild>
          <Link href={`/admin/anunturi?status=vandut${userIdFilter ? `&user_id=${userIdFilter}` : ''}`}>Vândute</Link>
        </Button>
      </div>

      {/* Afișarea listei de anunțuri */}
      {listings.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-xl bg-muted/10">
          <p className="text-muted-foreground">Nu s-a găsit niciun anunț în această secțiune.</p>
        </div>
      ) : userIdFilter ? (
        /* MOD UTILIZATOR SEPARAT: Afișare sub formă de carduri detaliate */
        <div className="grid gap-4">
          {listings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden hover:shadow-sm transition-shadow">
              <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-md overflow-hidden bg-muted flex-shrink-0 border">
                    <img 
                      src={Array.isArray(listing.images) ? listing.images[0] : '/placeholder.svg'} 
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base text-foreground">{listing.title}</h3>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-1.5">
                      <span>📁 {listing.categories?.name}</span>
                      <span>📍 {listing.location}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-3 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <p className="font-bold text-lg text-primary">
                      {listing.price.toLocaleString('ro-RO')} {listing.currency || 'RON'}
                    </p>
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-600/20 mt-1">
                      {listing.status === 'activ' ? 'Activ' : listing.status}
                    </span>
                  </div>
                  <Button size="sm" className="flex gap-1.5 items-center shrink-0" asChild>
                    <Link href={`/anunturi/${listing.id}`} target="_blank">
                      <ExternalLink className="h-4 w-4" /> Vezi Anunț
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* MOD GLOBAL: Tabel HTML stabil și curat */
        <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b bg-muted/40 text-muted-foreground font-medium">
                  <th className="p-4">Titlu Anunț</th>
                  <th className="p-4">Autor / Email</th>
                  <th className="p-4">Categorie</th>
                  <th className="p-4">Preț listat</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Navigare</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {listings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 font-medium max-w-[240px] truncate text-foreground">
                      {listing.title}
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-foreground">{listing.profiles?.full_name}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[180px]">{listing.profiles?.email}</div>
                    </td>
                    <td className="p-4 text-muted-foreground">{listing.categories?.name}</td>
                    <td className="p-4 font-semibold text-foreground">
                      {listing.price.toLocaleString('ro-RO')} {listing.currency || 'RON'}
                    </td>
                    <td className="p-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${listing.status === 'activ' ? 'bg-green-100 text-green-800' : listing.status === 'in_asteptare' ? 'bg-yellow-100 text-yellow-800' : listing.status === 'vandut' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
  {listing.status === 'activ' ? 'Activ' : listing.status === 'in_asteptare' ? 'În așteptare' : listing.status === 'vandut' ? 'Vândut' : 'Respins'}
</span>
                    </td>
                    <td className="p-4 text-right">
                      <Button size="sm" variant="outline" className="h-8 gap-1" asChild>
                        <Link href={`/anunturi/${listing.id}`} target="_blank">
                          <Eye className="h-3.5 w-3.5" /> Deschide
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}