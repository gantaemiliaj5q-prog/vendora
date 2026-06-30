"use client"

import Link from 'next/link'
import Image from 'next/image' // Importul componentei native de optimizare multimedia
import { Card } from '@/components/ui/card'
import type { Listing } from '@/lib/types'

interface ListingCardProps {
  listing: Listing
}

export function ListingCard({ listing }: ListingCardProps) {
  const mainImage = listing.images && listing.images.length > 0 
    ? listing.images[0] 
    : 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&auto=format&fit=crop'

  return (
    <Link href={`/anunturi/${listing.id}`} className="block h-full group">
      <Card className="h-full overflow-hidden border border-border bg-card transition-all duration-200 hover:border-primary/20 hover:shadow-md flex flex-col">
        {/* Container fluid pentru imagine optimizată */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
          <Image
            src={mainImage}
            alt={listing.title}
            fill
            sizes="(max-w-7xl) 100vw, (max-w-lg) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {listing.is_promoted && (
            <span className="absolute left-2 top-2 rounded bg-emerald-500 px-2 py-0.5 text-xs font-semibold text-white shadow-sm z-10">
              Promovat
            </span>
          )}
        </div>
        
        {/* Informații text */}
        <div className="flex flex-1 flex-col p-4">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
            {listing.condition}
          </span>
          <h3 className="line-clamp-2 text-base font-semibold text-foreground group-hover:text-primary transition-colors min-h-[2.75rem]">
            {listing.title}
          </h3>
          
          <div className="mt-auto pt-3 flex flex-col gap-1 border-t border-border/60">
            <span className="text-lg font-bold text-primary">
              {listing.price.toLocaleString('ro-RO')} {listing.currency}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              📍 {listing.location}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  )
}