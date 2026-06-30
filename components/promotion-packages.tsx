'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Star, Sparkles, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PromotionCheckout } from '@/components/promotion-checkout'
import type { PromotionProduct } from '@/lib/products'

interface PromotionPackagesProps {
  packages: PromotionProduct[]
  listingId: string
}

const packageIcons: Record<string, React.ReactNode> = {
  basic: <Star className="h-6 w-6" />,
  premium: <Sparkles className="h-6 w-6" />,
  vip: <Crown className="h-6 w-6" />,
}

export function PromotionPackages({ packages, listingId }: PromotionPackagesProps) {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'RON',
      minimumFractionDigits: 2,
    }).format(cents / 100)
  }

  if (selectedPackage) {
    const pkg = packages.find((p) => p.id === selectedPackage)
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => setSelectedPackage(null)}>
          &larr; Înapoi la pachete
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Finalizează plata - {pkg?.name}</CardTitle>
            <CardDescription>
              {formatPrice(pkg?.priceInCents || 0)} pentru {pkg?.durationDays} zile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PromotionCheckout packageId={selectedPackage} listingId={listingId} />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {packages.map((pkg, index) => {
        const isPopular = index === 1

        return (
          <Card
            key={pkg.id}
            className={cn(
              'relative flex flex-col',
              isPopular && 'border-primary shadow-lg'
            )}
          >
            {isPopular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                Cel mai popular
              </Badge>
            )}
            <CardHeader className="text-center">
              <div
                className={cn(
                  'mx-auto flex h-14 w-14 items-center justify-center rounded-full',
                  isPopular ? 'bg-primary text-primary-foreground' : 'bg-muted'
                )}
              >
                {packageIcons[pkg.id] || <Star className="h-6 w-6" />}
              </div>
              <CardTitle className="mt-4">{pkg.name}</CardTitle>
              <CardDescription>{pkg.description}</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">
                  {formatPrice(pkg.priceInCents)}
                </span>
                <span className="text-muted-foreground">
                  {' '}
                  / {pkg.durationDays} zile
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <ul className="flex-1 space-y-3">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={cn('mt-6 w-full', isPopular && 'bg-primary')}
                variant={isPopular ? 'default' : 'outline'}
                onClick={() => setSelectedPackage(pkg.id)}
              >
                Alege {pkg.name}
              </Button>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
