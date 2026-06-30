'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Check,
  X,
  MoreHorizontal,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { toast } from 'sonner'
import type { Listing } from '@/lib/types'

interface AdminListingsTableProps {
  listings: (Listing & {
    profiles: { full_name: string; email: string } | null
    categories: { name: string } | null
  })[]
  currentStatus: string
  currentPage: number
  totalPages: number
  totalCount: number
}

// CORECTAT: Schimbăm valorile butoanelor pentru a se potrivi cu regulile (Check Constraint) din Supabase-ul tău!
const statusTabs = [
  { value: 'all', label: 'Toate' },
  { value: 'in_asteptare', label: 'În așteptare' },
  { value: 'activ', label: 'Active' },
  { value: 'respins', label: 'Respinse' },
  { value: 'vandut', label: 'Vândute' },
]

export function AdminListingsTable({
  listings,
  currentStatus,
  currentPage,
  totalPages,
  totalCount,
}: AdminListingsTableProps) {
  const [selectedListing, setSelectedListing] = useState<string | null>(null)
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'delete' | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const userId = searchParams.get('user_id')
  const userParam = userId ? `&user_id=${userId}` : ''

  async function handleAction() {
    if (!selectedListing || !actionType) return

    setIsLoading(true)

    try {
      if (actionType === 'delete') {
        const { error } = await supabase
          .from('listings')
          .delete()
          .eq('id', selectedListing)

        if (error) throw error
        toast.success('Anunțul a fost șters definitiv din sistem')
      } else {
        // CORECTAT: Folosim cuvintele românești validate de baza ta de date
        const newStatus = actionType === 'approve' ? 'activ' : 'respins'
        const { error } = await supabase
          .from('listings')
          .update({ status: newStatus })
          .eq('id', selectedListing)

        if (error) throw error
        toast.success(
          actionType === 'approve'
            ? 'Anunțul a fost aprobat și publicat'
            : 'Anunțul a fost marcat ca respins'
        )
      }

      router.refresh()
    } catch (error) {
      toast.error('Eroare la modificarea statusului')
    } finally {
      setIsLoading(false)
      setSelectedListing(null)
      setActionType(null)
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-4">
      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2">
        {statusTabs.map((tab) => (
          <Button
            key={tab.value}
            variant={currentStatus === tab.value ? 'default' : 'outline'}
            size="sm"
            asChild
          >
            <Link href={`/admin/anunturi?status=${tab.value}${userParam}`}>
              {tab.label}
            </Link>
          </Button>
        ))}
      </div>

      <div className="text-sm text-muted-foreground font-medium bg-muted/40 px-3 py-1.5 rounded-md inline-block">
        📊 {totalCount} anunțuri identificate
      </div>

      {/* Tabel Date */}
      <div className="rounded-md border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titlu</TableHead>
              <TableHead>Utilizator</TableHead>
              <TableHead>Categorie</TableHead>
              <TableHead>Preț</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="w-[100px]">Acțiuni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                  Nu există anunțuri înregistrate în această secțiune.
                </TableCell>
              </TableRow>
            ) : (
              listings.map((listing) => (
                <TableRow key={listing.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="max-w-[220px] truncate font-medium">
                    {listing.title}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      <div className="font-medium text-sm">
                        {listing.profiles?.full_name || 'Utilizator Anonim'}
                      </div>
                      <div className="text-xs text-muted-foreground max-w-[180px] truncate">
                        {listing.profiles?.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{listing.categories?.name || 'Diverse'}</TableCell>
                  <TableCell className="font-semibold text-primary">
                    {listing.price.toLocaleString('ro-RO')} {listing.currency || 'RON'}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide ${
                        listing.status === 'activ'
                          ? 'bg-green-100 text-green-700'
                          : listing.status === 'in_asteptare'
                            ? 'bg-yellow-100 text-yellow-700'
                            : listing.status === 'vandut'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {listing.status === 'activ'
                        ? 'Activ'
                        : listing.status === 'in_asteptare'
                          ? 'În așteptare'
                          : listing.status === 'vandut'
                            ? 'Vândut'
                            : 'Respins'}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(listing.created_at)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/anunturi/${listing.id}`} target="_blank">
                            <Eye className="mr-2 h-4 w-4 text-muted-foreground" />
                            Vizualizează
                          </Link>
                        </DropdownMenuItem>
                        {listing.status === 'in_asteptare' && (
                          <>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedListing(listing.id)
                                setActionType('approve')
                              }}
                              className="text-green-600 font-medium"
                            >
                              <Check className="mr-2 h-4 w-4" />
                              Aprobă
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedListing(listing.id)
                                setActionType('reject')
                              }}
                              className="text-yellow-600 font-medium"
                            >
                              <X className="mr-2 h-4 w-4" />
                              Respinge
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedListing(listing.id)
                            setActionType('delete')
                          }}
                          className="text-destructive font-medium"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Șterge
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <div className="text-sm text-muted-foreground">
            Pagina {currentPage} din {totalPages}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={currentPage <= 1} asChild>
              <Link href={`/admin/anunturi?status=${currentStatus}&page=${currentPage - 1}${userParam}`}>
                <ChevronLeft className="mr-1 h-4 w-4" /> Anterior
              </Link>
            </Button>
            <Button variant="outline" size="sm" disabled={currentPage >= totalPages} asChild>
              <Link href={`/admin/anunturi?status=${currentStatus}&page=${currentPage + 1}${userParam}`}>
                Următor <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <AlertDialog
        open={!!selectedListing && !!actionType}
        onOpenChange={() => {
          setSelectedListing(null)
          setActionType(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === 'approve'
                ? 'Aprobă anunțul în sistem'
                : actionType === 'reject'
                  ? 'Respinge publicarea anunțului'
                  : 'Șterge anunțul din baza de date'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === 'approve'
                ? 'Anunțul selectat va fi publicat instantaneu și va deveni vizibil pentru toți vizitatorii.'
                : actionType === 'reject'
                  ? 'Anunțul va fi marcat ca respins și retras din listele publice.'
                  : 'Această acțiune este permanentă și ireversibilă.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anulează</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAction}
              disabled={isLoading}
              className={actionType === 'delete' ? 'bg-destructive text-white' : 'bg-green-600 text-white'}
            >
              Confirmă
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}