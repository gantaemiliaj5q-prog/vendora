'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'
import { ImagePlus, X, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import type { Category, Listing } from '@/lib/types'

interface ListingFormProps {
  categories: Category[]
  userId: string
  listing?: Listing
}

export function ListingForm({ categories, userId, listing }: ListingFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const isEditing = !!listing

  const [formData, setFormData] = useState({
    title: listing?.title || '',
    description: listing?.description || '',
    price: listing?.price?.toString() || '',
    currency: listing?.currency || 'RON',
    condition: listing?.condition || '',
    location: listing?.location || '',
    category_id: listing?.category_id || '',
    external_url: listing?.external_url || '',
  })

  const [images, setImages] = useState<string[]>(listing?.images || [])
  const [uploading, setUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (images.length + files.length > 10) {
      toast.error('Poți adăuga maximum 10 imagini')
      return
    }

    setUploading(true)

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('listings')
          .upload(fileName, file)

        if (uploadError) throw uploadError

        const {
          data: { publicUrl },
        } = supabase.storage.from('listings').getPublicUrl(fileName)

        return publicUrl
      })

      const uploadedUrls = await Promise.all(uploadPromises)
      setImages((prev) => [...prev, ...uploadedUrls])
      toast.success('Imaginile au fost încărcate')
    } catch {
      toast.error('Eroare la încărcarea imaginilor')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const currentTitle = formData.title || ''
    const currentDescription = formData.description || ''

    // Validări custom (Simulare comportament schemă Zod pentru Licență)
    if (!currentTitle.trim()) {
      setError('Titlul este obligatoriu.')
      setIsLoading(false)
      return
    }

    if (currentTitle.trim().length < 5) {
      setError('Titlul trebuie să aibă cel puțin 5 caractere.')
      setIsLoading(false)
      return
    }

    if (!formData.category_id) {
      setError('Te rugăm să selectezi o categorie validă.')
      setIsLoading(false)
      return
    }

    if (!currentDescription.trim() || currentDescription.trim().length < 20) {
      setError('Descrierea este obligatorie și trebuie să aibă cel puțin 20 de caractere.')
      setIsLoading(false)
      return
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Prețul trebuie să fie un număr pozitiv mai mare decât 0.')
      setIsLoading(false)
      return
    }

    if (!formData.condition) {
      setError('Selectează starea produsului.')
      setIsLoading(false)
      return
    }

    if (!formData.location || !formData.location.trim()) {
      setError('Locația este obligatorie pentru listarea produsului.')
      setIsLoading(false)
      return
    }

    try {
      const listingData = {
        user_id: userId,
        title: currentTitle.trim(),
        description: currentDescription.trim(),
        price: parseFloat(formData.price),
        currency: formData.currency,
        condition: formData.condition as Listing['condition'],
        location: formData.location.trim(),
        category_id: formData.category_id,
        images,
        external_url: formData.external_url ? formData.external_url.trim() : null,
        status: 'activ' as const, 
      }

      if (isEditing && listing) {
        const { error } = await supabase
          .from('listings')
          .update(listingData)
          .eq('id', listing.id)

        if (error) throw error
        toast.success('Anunțul a fost actualizat')
        router.push(`/anunturi/${listing.id}`)
      } else {
        const { data, error } = await supabase
          .from('listings')
          .insert(listingData)
          .select('id')
          .single()

        if (error) throw error
        toast.success('Anunțul a fost publicat')
        router.push(`/anunturi/${data.id}`)
      }

      router.refresh()
    } catch (err) {
      console.error(err)
      setError('A apărut o eroare la salvarea datelor. Te rugăm să încerci din nou.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive" className="rounded-xl border-red-200 bg-red-50 text-red-900 shadow-sm animate-in fade-in-50 duration-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="font-medium">{error}</AlertDescription>
        </Alert>
      )}

      {/* Images */}
      <Card className="rounded-2xl border-gray-100 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-base font-bold text-gray-900">Imagini</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-5">
            {images.map((image, index) => (
              <div
                key={index}
                className="group relative aspect-square overflow-hidden rounded-xl border border-gray-100 shadow-sm"
              >
                <img
                  src={image}
                  alt={`Imagine ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute right-1 top-1 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 rounded-lg"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {images.length < 10 && (
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 transition-all hover:border-emerald-500/50 hover:bg-emerald-50/10 group">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
                {uploading ? (
                  <Spinner className="text-emerald-600" />
                ) : (
                  <>
                    <ImagePlus className="h-7 w-7 text-gray-400 group-hover:text-emerald-600 transition-colors" />
                    <span className="mt-1.5 text-xs font-semibold text-gray-500 group-hover:text-gray-700">
                      Adaugă
                    </span>
                  </>
                )}
              </label>
            )}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Adaugă până la 10 imagini. Prima imagine va fi cea principală.
          </p>
        </CardContent>
      </Card>

      {/* Details */}
      <Card className="rounded-2xl border-gray-100 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-base font-bold text-gray-900">Detalii anunț</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-gray-700 font-semibold text-sm">Titlu *</Label>
            <Input
              id="title"
              name="title"
              placeholder="Ex: iPhone 14 Pro Max 256GB"
              value={formData.title || ''}
              onChange={handleChange}
              maxLength={100}
              className="rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 h-10 bg-gray-50/30 font-medium"
            />
            <p className="text-right text-[11px] text-muted-foreground font-medium pr-1">
              {(formData.title || '').length}/100 caractere
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category_id" className="text-gray-700 font-semibold text-sm">Categorie *</Label>
            <Select
              value={formData.category_id || ''}
              onValueChange={(value) => handleSelectChange('category_id', value)}
            >
              <SelectTrigger className="rounded-xl border-gray-200 h-10 focus:ring-emerald-500 font-medium text-gray-800 bg-gray-50/30">
                <SelectValue placeholder="Selectează categoria" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id} className="cursor-pointer font-medium">
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700 font-semibold text-sm">Descriere *</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Descrie produsul în detaliu (minimum 20 de caractere)..."
              value={formData.description || ''}
              onChange={handleChange}
              rows={5}
              maxLength={5000}
              className="rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-gray-50/30 font-medium"
            />
            <p className="text-right text-[11px] text-muted-foreground font-medium pr-1">
              {(formData.description || '').length}/5000 caractere
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-gray-700 font-semibold text-sm">Preț *</Label>
              <div className="flex gap-2">
                <Input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="0"
                  value={formData.price || ''}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="flex-1 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 h-10 bg-gray-50/30 font-semibold"
                />
                <Select
                  value={formData.currency || 'RON'}
                  onValueChange={(value) => handleSelectChange('currency', value)}
                >
                  <SelectTrigger className="w-24 rounded-xl border-gray-200 h-10 focus:ring-emerald-500 font-bold bg-gray-50/30 text-gray-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl font-bold">
                    <SelectItem value="RON" className="cursor-pointer">RON</SelectItem>
                    <SelectItem value="EUR" className="cursor-pointer">EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition" className="text-gray-700 font-semibold text-sm">Stare *</Label>
              <Select
                value={formData.condition || ''}
                onValueChange={(value) => handleSelectChange('condition', value)}
              >
                <SelectTrigger className="rounded-xl border-gray-200 h-10 focus:ring-emerald-500 font-medium bg-gray-50/30 text-gray-800">
                  <SelectValue placeholder="Selectează starea" />
                </SelectTrigger>
                <SelectContent className="rounded-xl font-medium">
                  <SelectItem value="nou" className="cursor-pointer">Nou</SelectItem>
                  <SelectItem value="utilizat" className="cursor-pointer">Utilizat</SelectItem>
                  <SelectItem value="recondiționat" className="cursor-pointer">Recondiționat</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-gray-700 font-semibold text-sm">Locație *</Label>
            <Input
              id="location"
              name="location"
              placeholder="Ex: București, Sector 1"
              value={formData.location || ''}
              onChange={handleChange}
              className="rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 h-10 bg-gray-50/30 font-medium"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="external_url" className="text-gray-700 font-semibold text-sm">Link extern (opțional)</Label>
            <Input
              id="external_url"
              name="external_url"
              type="url"
              placeholder="Ex: https://exemplu.ro/produs"
              value={formData.external_url || ''}
              onChange={handleChange}
              className="rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 h-10 bg-gray-50/30 font-medium"
            />
            <p className="text-xs text-muted-foreground pl-1">
              Adaugă un link către pagina originală a produsului (opțional)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Submit Buttons */}
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
          className="rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50 px-6 h-11 font-semibold transition-colors"
        >
          Anulează
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading} 
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl h-11 shadow-sm shadow-emerald-900/10 transition-colors"
        >
          {isLoading ? (
            <>
              <span className="mr-2 h-4 w-4 text-white border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
              {isEditing ? 'Se actualizează...' : 'Se publică...'}
            </>
          ) : isEditing ? (
            'Actualizează anunțul'
          ) : (
            'Publică anunțul'
          )}
        </Button>
      </div>
    </form>
  )
}