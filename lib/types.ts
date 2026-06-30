export interface Profile {
  id: string
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  location: string | null
  is_admin: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
  parent_id: string | null
  created_at: string
}

export interface Listing {
  id: string
  user_id: string
  category_id: string
  title: string
  description: string
  price: number
  currency: string
  condition: 'nou' | 'utilizat' | 'recondiționat'
  location: string
  images: string[]
  external_url: string | null
  status: 'activ' | 'inactiv' | 'vandut' | 'in_asteptare'
  views_count: number
  is_promoted: boolean
  promotion_expires_at: string | null
  created_at: string
  updated_at: string
  // Joined fields
  category?: Category
  profile?: Profile
}

export interface Favorite {
  id: string
  user_id: string
  listing_id: string
  created_at: string
  listing?: Listing
}

export interface Conversation {
  id: string
  listing_id: string
  buyer_id: string
  seller_id: string
  created_at: string
  updated_at: string
  listing?: Listing
  buyer?: Profile
  seller?: Profile
  last_message?: Message
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  is_read: boolean
  created_at: string
  sender?: Profile
}

export interface PromotionPackage {
  id: string
  name: string
  description: string | null
  price_cents: number
  duration_days: number
  features: string[]
  is_active: boolean
  created_at: string
}

export interface Payment {
  id: string
  user_id: string
  listing_id: string
  package_id: string
  stripe_session_id: string | null
  stripe_payment_intent_id: string | null
  amount_cents: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  created_at: string
  updated_at: string
}

export interface Report {
  id: string
  reporter_id: string
  listing_id: string | null
  user_id: string | null
  reason: string
  description: string | null
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
  admin_notes: string | null
  created_at: string
  updated_at: string
}

export interface CookieConsent {
  id: string
  user_id: string | null
  session_id: string
  essential: boolean
  analytics: boolean
  marketing: boolean
  created_at: string
  updated_at: string
}

// Filter types
export interface ListingFilters {
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  condition?: Listing['condition']
  location?: string
  sortBy?: 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'popular'
  search?: string
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
  totalPages: number
}
