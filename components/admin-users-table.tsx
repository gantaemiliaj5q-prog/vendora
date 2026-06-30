'use client'

import { useState } from 'react'
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
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  MoreHorizontal,
  Search,
  ChevronLeft,
  ChevronRight,
  FileText,
  ShieldCheck,
  ShieldX,
} from 'lucide-react'
import { toast } from 'sonner'

interface AdminUsersTableProps {
  users: any[] 
  currentPage: number
  totalPages: number
  totalCount: number
  searchQuery: string
}

export function AdminUsersTable({
  users,
  currentPage,
  totalPages,
  totalCount,
  searchQuery,
}: AdminUsersTableProps) {
  const [search, setSearch] = useState(searchQuery)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    router.push(`/admin/utilizatori?search=${encodeURIComponent(search)}`)
  }

  async function toggleAdmin(userId: string, isCurrentlyAdmin: boolean) {
    setIsLoading(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !isCurrentlyAdmin })
        .eq('id', userId)

      if (error) throw error

      toast.success(
        isCurrentlyAdmin
          ? 'Drepturile de admin au fost revocate'
          : 'Utilizatorul a fost făcut admin'
      )
      router.refresh()
    } catch (error) {
      toast.error('A apărut o eroare')
    } finally {
      setIsLoading(false)
    }
  }

  function formatDate(date?: string | null) {
    if (!date) return '-'

    const parsedDate = new Date(date)
    if (Number.isNaN(parsedDate.getTime())) return '-'

    return parsedDate.toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  function getInitials(name: string | null) {
    if (!name) return '?'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="space-y-4">
      {/* Search - Reparat cu buton explicit bg-emerald-600 */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Caută după nume sau email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 h-10 bg-gray-50/30"
          />
        </div>
        <Button type="submit" className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors px-5 h-10">
          Caută
        </Button>
        {searchQuery && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setSearch('')
              router.push('/admin/utilizatori')
            }}
            className="rounded-xl border-gray-200 text-gray-700 h-10"
          >
            Resetează
          </Button>
        )}
      </form>

      <div className="text-sm text-muted-foreground pl-1">
        {totalCount} utilizatori găsiți
      </div>

      {/* Table - Reparat cu margini rotunjite și finisaje premium */}
      <div className="rounded-xl border border-gray-100 shadow-sm overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-bold text-gray-700">Nume</TableHead>
              <TableHead className="font-bold text-gray-700">Email</TableHead>
              <TableHead className="font-bold text-gray-700">Telefon</TableHead>
              <TableHead className="font-bold text-gray-700">Anunțuri</TableHead>
              <TableHead className="font-bold text-gray-700">Înregistrat</TableHead>
              <TableHead className="font-bold text-gray-700">Rol</TableHead>
              <TableHead className="w-[100px] font-bold text-gray-700">Acțiuni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                  Nu există utilizatori
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 ring-2 ring-gray-100">
                        <AvatarImage src={user.avatar_url || undefined} />
                        <AvatarFallback className="bg-emerald-50 text-emerald-700 font-semibold text-xs">
                          {getInitials(user.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-semibold text-gray-900 text-sm">
                        {user.full_name || 'Fără nume'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm">{user.email || 'utilizator@vendora.ro'}</TableCell>
                  <TableCell className="text-gray-500 text-sm">{user.phone || '-'}</TableCell>
                  <TableCell>
                    {/* Legătura mică de număr anunțuri vopsită în verde deschis elegant */}
                    <Link 
                      href={`/admin/anunturi?user_id=${user.id}`}
                      className="inline-flex items-center justify-center rounded-xl bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all shadow-inner"
                    >
                      {user.listings_count} {user.listings_count === 1 ? 'anunț' : 'anunțuri'}
                    </Link>
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">{formatDate(user.created_at)}</TableCell>
                  <TableCell>
                    {/* Badge Rol - Forțat pe nuanța corectă Emerald */}
                    {user.role === 'admin' || user.is_admin ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                        <ShieldCheck className="h-3 w-3 text-emerald-600" />
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                        Utilizator
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={isLoading} className="text-gray-400 hover:text-gray-600 rounded-lg">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl shadow-lg border-gray-100">
                        <DropdownMenuItem asChild className="cursor-pointer focus:bg-gray-50">
                          <Link href={`/admin/anunturi?user_id=${user.id}`}>
                            <FileText className="mr-2 h-4 w-4 text-gray-400" />
                            Vezi anunțurile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => toggleAdmin(user.id, !!user.is_admin)}
                          className="cursor-pointer focus:bg-gray-50"
                        >
                          {user.is_admin ? (
                            <>
                              <ShieldX className="mr-2 h-4 w-4 text-red-500" />
                              <span className="text-red-600 font-medium">Revocă admin</span>
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="mr-2 h-4 w-4 text-emerald-600" />
                              <span className="text-emerald-700 font-medium">Fă admin</span>
                            </>
                          )}
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
        <div className="flex items-center justify-between pt-2 px-1">
          <div className="text-xs font-medium text-gray-400">
            Pagina {currentPage} din {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              asChild
              className="rounded-xl border-gray-200 text-gray-700 h-9"
            >
              <Link
                href={`/admin/utilizatori?page=${currentPage - 1}${searchQuery ? `&search=${searchQuery}` : ''}`}
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
              className="rounded-xl border-gray-200 text-gray-700 h-9"
            >
              <Link
                href={`/admin/utilizatori?page=${currentPage + 1}${searchQuery ? `&search=${searchQuery}` : ''}`}
              >
                Următor
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}