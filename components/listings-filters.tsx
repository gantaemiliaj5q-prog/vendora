'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SlidersHorizontal, X } from 'lucide-react'
import type { Category } from '@/lib/types'

interface FiltersProps {
  categories: Category[]
  currentFilters: {
    categorie?: string
    minPrice?: string
    maxPrice?: string
    currency?: string
    condition?: string
    location?: string
    sort?: string
  }
}

export function ListingsFilters({ categories, currentFilters }: FiltersProps) {
  const router = useRouter()
  const [filters, setFilters] = useState(currentFilters)

  const applyFilters = () => {
    const params = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      }
    })

    router.push(`/anunturi?${params.toString()}`)
  }

  const clearFilters = () => {
    setFilters({})
    router.push('/anunturi')
  }

  const hasActiveFilters = Object.values(currentFilters).some(Boolean)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <SlidersHorizontal className="h-4 w-4" />
            Filtre
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-auto p-1 text-xs text-muted-foreground"
            >
              <X className="mr-1 h-3 w-3" />
              Șterge
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sort */}
        <div className="space-y-2">
          <Label>Sortare</Label>
          <Select
            value={filters.sort || 'newest'}
            onValueChange={(value) => setFilters((f) => ({ ...f, sort: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selectează" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Cele mai noi</SelectItem>
              <SelectItem value="oldest">Cele mai vechi</SelectItem>
              <SelectItem value="price_asc">Preț crescător</SelectItem>
              <SelectItem value="price_desc">Preț descrescător</SelectItem>
              <SelectItem value="popular">Cele mai populare</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Accordion type="multiple" defaultValue={['category', 'price', 'condition']} className="w-full">
          {/* Category */}
          <AccordionItem value="category">
            <AccordionTrigger className="text-sm font-medium">
              Categorie
            </AccordionTrigger>
            <AccordionContent>
              <RadioGroup
                value={filters.categorie || ''}
                onValueChange={(value) =>
                  setFilters((f) => ({ ...f, categorie: value || undefined }))
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="" id="all" />
                  <Label htmlFor="all" className="font-normal">
                    Toate categoriile
                  </Label>
                </div>
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={category.slug} id={category.slug} />
                    <Label htmlFor={category.slug} className="font-normal">
                      {category.name}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>

          {/* Price */}
          <AccordionItem value="price">
            <AccordionTrigger className="text-sm font-medium">
              Preț
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <Select
                  value={filters.currency || 'all'}
                  onValueChange={(value) =>
                    setFilters((f) => ({
                      ...f,
                      currency: value === 'all' ? undefined : value,
                    }))
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Monedă" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toate monedele</SelectItem>
                    <SelectItem value="RON">RON</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice || ''}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, minPrice: e.target.value || undefined }))
                  }
                  className="h-9"
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice || ''}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, maxPrice: e.target.value || undefined }))
                  }
                  className="h-9"
                />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Condition */}
          <AccordionItem value="condition">
            <AccordionTrigger className="text-sm font-medium">
              Stare
            </AccordionTrigger>
            <AccordionContent>
              <RadioGroup
                value={filters.condition || ''}
                onValueChange={(value) =>
                  setFilters((f) => ({ ...f, condition: value || undefined }))
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="" id="any-condition" />
                  <Label htmlFor="any-condition" className="font-normal">
                    Orice stare
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nou" id="nou" />
                  <Label htmlFor="nou" className="font-normal">
                    Nou
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="utilizat" id="utilizat" />
                  <Label htmlFor="utilizat" className="font-normal">
                    Utilizat
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="recondiționat" id="reconditionat" />
                  <Label htmlFor="reconditionat" className="font-normal">
                    Recondiționat
                  </Label>
                </div>
              </RadioGroup>
            </AccordionContent>
          </AccordionItem>

          {/* Location */}
          <AccordionItem value="location">
            <AccordionTrigger className="text-sm font-medium">
              Locație
            </AccordionTrigger>
            <AccordionContent>
              <Input
                type="text"
                placeholder="Ex: București, Cluj..."
                value={filters.location || ''}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, location: e.target.value || undefined }))
                }
                className="h-9"
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Button onClick={applyFilters} className="w-full">
          Aplică filtrele
        </Button>
      </CardContent>
    </Card>
  )
}
