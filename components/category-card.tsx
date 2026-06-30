import Link from 'next/link'
import {
  Home,
  Car,
  Smartphone,
  Shirt,
  Sofa,
  Dumbbell,
  PawPrint,
  Briefcase,
  Wrench,
  Package,
} from 'lucide-react'

interface CategoryCardProps {
  name: string
  slug: string
  icon: string | null
  count?: number
}

const iconMap: Record<string, React.ReactNode> = {
  home: <Home className="h-6 w-6" />,
  car: <Car className="h-6 w-6" />,
  smartphone: <Smartphone className="h-6 w-6" />,
  shirt: <Shirt className="h-6 w-6" />,
  sofa: <Sofa className="h-6 w-6" />,
  dumbbell: <Dumbbell className="h-6 w-6" />,
  'paw-print': <PawPrint className="h-6 w-6" />,
  briefcase: <Briefcase className="h-6 w-6" />,
  wrench: <Wrench className="h-6 w-6" />,
}

export function CategoryCard({ name, slug, icon, count }: CategoryCardProps) {
  const IconComponent = icon && iconMap[icon] ? iconMap[icon] : <Package className="h-6 w-6" />

  return (
    <Link
      href={`/anunturi?categorie=${slug}`}
      className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        {IconComponent}
      </div>
      <div className="text-center">
        <p className="font-medium text-foreground">{name}</p>
        {typeof count === 'number' && (
          <p className="text-sm text-muted-foreground">
            {count} {count === 1 ? 'anunț' : 'anunțuri'}
          </p>
        )}
      </div>
    </Link>
  )
}
