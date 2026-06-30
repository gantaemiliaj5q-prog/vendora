'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
  MoreHorizontal,
  Eye,
  Edit,
  Sparkles,
  Trash2,
  EyeOff,
  RefreshCw,
} from 'lucide-react'
import { format } from 'date-fns'
import { ro } from 'date-fns/locale'
import { toast } from 'sonner'
import type { Listing, Category } from '@/lib/types'

interface UserListingsTableProps {
  listings: (Listing & { category: Category | null })[]
  isAdmin?: boolean
}

export function UserListingsTable({
  listings: initialListings,
  isAdmin = false,
}: UserListingsTableProps) {
  const supabase = createClient()
  const [listings, setListings] = useState(initialListings)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(price)
  }

  const isActiveStatus = (status: Listing['status']) =>
    status === 'active' || status === 'activ'

  const handleStatusChange = async (id: string, status: Listing['status']) => {
    try {
      const { error } = await supabase
        .from('listings')
        .update({ status })
        .eq('id', id)

      if (error) throw error

      setListings((prev) =>
        prev.map((listing) => (listing.id === id ? { ...listing, status } : listing))
      )
      toast.success(isActiveStatus(status) ? 'Anunț activat' : 'Anunț dezactivat')
    } catch {
      toast.error('Eroare la actualizarea statusului')
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    setIsDeleting(true)
    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', deleteId)

      if (error) throw error

      setListings((prev) => prev.filter((listing) => listing.id !== deleteId))
      toast.success('Anunț șters cu succes')
    } catch {
      toast.error('Eroare la ștergerea anunțului')
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  const statusLabels: Record<Listing['status'], string> = {
  activ: 'Activ',
  inactiv: 'Inactiv',
  vandut: 'Vândut',
  in_asteptare: 'În așteptare',
}

  // CU asta:
const statusVariants: Record<
Listing['status'],
'default' | 'secondary' | 'destructive' | 'outline'
> = {
activ: 'default',
inactiv: 'secondary',
vandut: 'outline',
in_asteptare: 'secondary',
}

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
              >
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
                  {listing.images && listing.images.length > 0 ? (
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                      Fără
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/anunturi/${listing.id}`}
                      className="truncate font-medium hover:text-primary"
                    >
                      {listing.title}
                    </Link>
                    <Badge variant={statusVariants[listing.status]}>
                      {statusLabels[listing.status]}
                    </Badge>
                    {listing.is_promoted && (
                      <Badge className="bg-accent text-accent-foreground">
                        <Sparkles className="mr-1 h-3 w-3" />
                        Promovat
                      </Badge>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span>{listing.category?.name}</span>
                    <span>{formatPrice(listing.price, listing.currency)}</span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {listing.views_count} vizualizări
                    </span>
                    <span>
                      {format(new Date(listing.created_at), 'd MMM yyyy', {
                        locale: ro,
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:shrink-0">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/anunturi/${listing.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      Vezi
                    </Link>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/anunturi/${listing.id}/editeaza`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editează
                        </Link>
                      </DropdownMenuItem>
                      {!isAdmin && (
                        <DropdownMenuItem asChild>
                          <Link href={`/promovare?listing=${listing.id}`}>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Promovează
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      {isActiveStatus(listing.status) ? (
                        <DropdownMenuItem
                        onClick={() => handleStatusChange(listing.id, 'inactiv')}
                        >
                          <EyeOff className="mr-2 h-4 w-4" />
                          Dezactivează
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                        onClick={() => handleStatusChange(listing.id, 'activ')}
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Reactivează
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(listing.id, 'vandut')}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Marchează ca vândut
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setDeleteId(listing.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Șterge
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ești sigură?</AlertDialogTitle>
            <AlertDialogDescription>
              Această acțiune nu poate fi anulată. Anunțul va fi șters permanent.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Anulează</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Se șterge...' : 'Șterge'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
