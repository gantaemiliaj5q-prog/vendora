export interface PromotionProduct {
  id: string
  name: string
  description: string
  priceInCents: number
  durationDays: number
  features: string[]
}

export const PROMOTION_PACKAGES: PromotionProduct[] = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Promovare de baza pentru anuntul tau',
    priceInCents: 999, // 9.99 RON
    durationDays: 7,
    features: [
      'Evidențiere în căutări',
      'Badge "Promovat"',
      'Valabil 7 zile',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Vizibilitate crescuta si mai multe functionalitati',
    priceInCents: 2499, // 24.99 RON
    durationDays: 14,
    features: [
      'Tot ce include Basic',
      'Poziție prioritară în categorie',
      'Evidențiere cu culoare',
      'Valabil 14 zile',
    ],
  },
  {
    id: 'vip',
    name: 'VIP',
    description: 'Pachetul complet pentru vizibilitate maxima',
    priceInCents: 4999, // 49.99 RON
    durationDays: 30,
    features: [
      'Tot ce include Premium',
      'Afișare pe pagina principală',
      'Badge VIP distinctiv',
      'Statistici detaliate',
      'Valabil 30 zile',
    ],
  },
]

export function getPackageById(id: string): PromotionProduct | undefined {
  return PROMOTION_PACKAGES.find((pkg) => pkg.id === id)
}
