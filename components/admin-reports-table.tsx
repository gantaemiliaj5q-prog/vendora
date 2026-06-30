'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'

interface Report {
  id: string
  reason: string
  description: string | null
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
  created_at: string
  listings: { id: string; title: string } | null
  reporter: { full_name: string; email: string } | null
}

interface AdminReportsTableProps {
  reports: Report[]
  currentStatus: string
  currentPage: number
  totalPages: number
  totalCount: number
  resultsTitle?: string
  emptyMessage?: string
}

const statusTabs = [
  { value: 'pending', label: 'În așteptare' },
  { value: 'reviewed', label: 'Revizuite' },
  { value: 'resolved', label: 'Rezolvate' },
  { value: 'dismissed', label: 'Respinse' },
  { value: 'all', label: 'Toate' },
]

const reasonLabels: Record<string, string> = {
  spam: 'Spam',
  inappropriate: 'Conținut inadecvat',
  fraud: 'Fraudă',
  wrong_category: 'Categorie greșită',
  duplicate: 'Duplicat',
  other: 'Altele',
}

export function AdminReportsTable({
  reports,
  currentStatus,
  currentPage,
  totalPages,
  totalCount,
  resultsTitle,
  emptyMessage,
}: AdminReportsTableProps) {
  const [selectedReport, setSelectedReport] = useState<string | null>(null)
  const [actionType, setActionType] = useState<
    'resolve' | 'dismiss' | 'delete_listing' | null
  >(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleAction() {
    if (!selectedReport || !actionType) return

    setIsLoading(true)

    try {
      const report = reports.find((r) => r.id === selectedReport)

      if (actionType === 'delete_listing' && report?.listings?.id) {
        // Delete the listing and resolve the report
        await supabase.from('listings').delete().eq('id', report.listings.id)
        await supabase
          .from('reports')
          .update({ status: 'resolved' })
          .eq('id', selectedReport)
        toast.success('Anunțul a fost șters și raportarea rezolvată')
      } else {
        const newStatus = actionType === 'resolve' ? 'resolved' : 'dismissed'
        const { error } = await supabase
          .from('reports')
          .update({ status: newStatus })
          .eq('id', selectedReport)

        if (error) throw error
        toast.success(
          actionType === 'resolve'
            ? 'Raportarea a fost rezolvată'
            : 'Raportarea a fost respinsă'
        )
      }

      router.refresh()
    } catch (error) {
      toast.error('A apărut o eroare')
    } finally {
      setIsLoading(false)
      setSelectedReport(null)
      setActionType(null)
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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
            <Link href={`/admin/raportari?status=${tab.value}`}>
              {tab.label}
            </Link>
          </Button>
        ))}
      </div>

      <div className="text-sm text-muted-foreground">
        {resultsTitle ?? `${totalCount} raportări găsite`}
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Anunț</TableHead>
              <TableHead>Raportat de</TableHead>
              <TableHead>Motiv</TableHead>
              <TableHead>Descriere</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="w-[100px]">Acțiuni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center">
                  {emptyMessage ?? 'Nu există raportări'}
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="max-w-[150px] truncate font-medium">
                    {report.listings?.title || 'Anunț șters'}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {report.reporter?.full_name || 'Anonim'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {report.reporter?.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex rounded-full bg-muted px-2 py-1 text-xs">
                      {reasonLabels[report.reason] || report.reason}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {report.description || '-'}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        report.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : report.status === 'resolved'
                            ? 'bg-green-100 text-green-700'
                            : report.status === 'reviewed'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {report.status === 'pending'
                        ? 'În așteptare'
                        : report.status === 'resolved'
                          ? 'Rezolvat'
                          : report.status === 'reviewed'
                            ? 'Revizuit'
                            : 'Respins'}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatDate(report.created_at)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {report.listings && (
                          <DropdownMenuItem asChild>
                            <Link href={`/anunturi/${report.listings.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              Vezi anunțul
                            </Link>
                          </DropdownMenuItem>
                        )}
                        {report.status === 'pending' && (
                          <>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedReport(report.id)
                                setActionType('resolve')
                              }}
                              className="text-green-600"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Marchează rezolvat
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedReport(report.id)
                                setActionType('dismiss')
                              }}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Respinge
                            </DropdownMenuItem>
                            {report.listings && (
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedReport(report.id)
                                  setActionType('delete_listing')
                                }}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Șterge anunțul
                              </DropdownMenuItem>
                            )}
                          </>
                        )}
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
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Pagina {currentPage} din {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              asChild
            >
              <Link
                href={`/admin/raportari?status=${currentStatus}&page=${currentPage - 1}`}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Anterior
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              asChild
            >
              <Link
                href={`/admin/raportari?status=${currentStatus}&page=${currentPage + 1}`}
              >
                Următor
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <AlertDialog
        open={!!selectedReport && !!actionType}
        onOpenChange={() => {
          setSelectedReport(null)
          setActionType(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === 'resolve'
                ? 'Rezolvă raportarea'
                : actionType === 'dismiss'
                  ? 'Respinge raportarea'
                  : 'Șterge anunțul'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === 'resolve'
                ? 'Raportarea va fi marcată ca rezolvată.'
                : actionType === 'dismiss'
                  ? 'Raportarea va fi respinsă și anunțul va rămâne activ.'
                  : 'Anunțul va fi șters definitiv și raportarea va fi rezolvată.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anulează</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAction}
              disabled={isLoading}
              className={
                actionType === 'delete_listing'
                  ? 'bg-destructive hover:bg-destructive/90'
                  : actionType === 'resolve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : ''
              }
            >
              {isLoading ? 'Se procesează...' : 'Confirmă'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
