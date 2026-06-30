'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
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
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Category } from '@/lib/types'

interface AdminCategoriesManagerProps {
  categories: (Category & { listings_count: number })[]
}

export function AdminCategoriesManager({
  categories,
}: AdminCategoriesManagerProps) {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null
  )
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [icon, setIcon] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  function generateSlug(text: string) {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  function handleNameChange(value: string) {
    setName(value)
    if (!editingCategory) {
      setSlug(generateSlug(value))
    }
  }

  async function handleSave() {
    if (!name.trim() || !slug.trim()) {
      toast.error('Completează toate câmpurile obligatorii')
      return
    }

    setIsLoading(true)

    try {
      if (editingCategory) {
        const { error } = await supabase
          .from('categories')
          .update({ name, slug, icon: icon || null })
          .eq('id', editingCategory.id)

        if (error) throw error
        toast.success('Categoria a fost actualizată')
      } else {
        const { error } = await supabase
          .from('categories')
          .insert({ name, slug, icon: icon || null })

        if (error) throw error
        toast.success('Categoria a fost adăugată')
      }

      setIsAddOpen(false)
      setEditingCategory(null)
      setName('')
      setSlug('')
      setIcon('')
      router.refresh()
    } catch (error: any) {
      if (error.code === '23505') {
        toast.error('Există deja o categorie cu acest slug')
      } else {
        toast.error('A apărut o eroare')
      }
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete() {
    if (!deletingCategory) return

    setIsLoading(true)

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', deletingCategory.id)

      if (error) throw error
      toast.success('Categoria a fost ștearsă')
      setDeletingCategory(null)
      router.refresh()
    } catch (error: any) {
      if (error.code === '23503') {
        toast.error('Nu poți șterge o categorie care conține anunțuri')
      } else {
        toast.error('A apărut o eroare')
      }
    } finally {
      setIsLoading(false)
    }
  }

  function openEdit(category: Category) {
    setEditingCategory(category)
    setName(category.name)
    setSlug(category.slug)
    setIcon(category.icon || '')
  }

  return (
    <div className="space-y-4">
      {/* Add Button */}
      <Dialog
        open={isAddOpen || !!editingCategory}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddOpen(false)
            setEditingCategory(null)
            setName('')
            setSlug('')
            setIcon('')
          }
        }}
      >
        <DialogTrigger asChild>
          <Button className="rounded-xl bg-emerald-600 text-white font-semibold shadow-sm hover:bg-emerald-700 transition-colors h-10">
            <Plus className="mr-2 h-4 w-4" />
            Adaugă categorie
          </Button>
        </DialogTrigger>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-900">
              {editingCategory ? 'Editează categoria' : 'Adaugă categorie nouă'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 font-medium">Nume *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="ex: Electronice"
                className="rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug" className="text-gray-700 font-medium">Slug *</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="ex: electronice"
                className="rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 h-10"
              />
              <p className="text-xs text-muted-foreground">
                URL-ul categoriei: /anunturi?categorie={slug || 'slug'}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon" className="text-gray-700 font-medium">Icon (emoji)</Label>
              <Input
                id="icon"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="ex: 📱"
                className="rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 h-10"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddOpen(false)
                setEditingCategory(null)
              }}
              className="rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Anulează
            </Button>
            <Button onClick={handleSave} disabled={isLoading} className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors">
              {isLoading ? 'Se salvează...' : 'Salvează'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Table */}
      <div className="rounded-xl border border-gray-100 shadow-sm overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-bold text-gray-700">Icon</TableHead>
              <TableHead className="font-bold text-gray-700">Nume</TableHead>
              <TableHead className="font-bold text-gray-700">Slug</TableHead>
              <TableHead className="font-bold text-gray-700">Anunțuri</TableHead>
              <TableHead className="w-[100px] font-bold text-gray-700">Acțiuni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  Nu există categorii
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id} className="hover:bg-gray-50/50">
                  <TableCell className="text-2xl">
                    {category.icon || '📁'}
                  </TableCell>
                  <TableCell className="font-semibold text-gray-900">{category.name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {category.slug}
                  </TableCell>
                  <TableCell className="font-medium text-gray-700">{category.listings_count}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(category)}
                        className="text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg h-8 w-8"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingCategory(category)}
                        disabled={category.listings_count > 0}
                        className="text-gray-400 hover:text-destructive hover:bg-destructive/10 rounded-lg h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deletingCategory}
        onOpenChange={() => setDeletingCategory(null)}
      >
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 font-bold">Șterge categoria</AlertDialogTitle>
            <AlertDialogDescription>
              Ești sigur că vrei să ștergi categoria &quot;{deletingCategory?.name}
              &quot;? Această acțiune este ireversibilă.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50">Anulează</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-destructive hover:bg-destructive/90 rounded-xl font-semibold text-white transition-colors"
            >
              {isLoading ? 'Se șterge...' : 'Șterge'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}