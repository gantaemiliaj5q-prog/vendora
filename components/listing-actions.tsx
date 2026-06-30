'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { Heart, MessageSquare, Phone, Edit, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface ListingActionsProps {
  listingId: string
  sellerId: string
  sellerPhone?: string | null
  isOwner: boolean
  isAdmin: boolean
  isFavorited: boolean
  isLoggedIn: boolean
}

export function ListingActions({
  listingId,
  sellerId,
  sellerPhone,
  isOwner,
  isAdmin,
  isFavorited,
  isLoggedIn,
}: ListingActionsProps) {
  const router = useRouter()
  const [favorite, setFavorite] = useState(isFavorited)
  const [showPhone, setShowPhone] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const handleFavorite = async () => {
    if (!isLoggedIn) {
      router.push(`/auth/login?redirect=/anunturi/${listingId}`)
      return
    }

    setIsLoading(true)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    try {
      if (favorite) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('listing_id', listingId)
        toast.success('Eliminat din favorite')
      } else {
        await supabase.from('favorites').insert({
          user_id: user.id,
          listing_id: listingId,
        })
        toast.success('Adăugat la favorite')
      }
      setFavorite(!favorite)
    } catch {
      toast.error('A apărut o eroare')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMessage = async () => {
    if (!isLoggedIn) {
      router.push(`/auth/login?redirect=/anunturi/${listingId}`)
      return
    }

    // Check if conversation exists
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data: existingConversation } = await supabase
      .from('conversations')
      .select('id')
      .eq('listing_id', listingId)
      .eq('buyer_id', user.id)
      .single()

    if (existingConversation) {
      router.push(`/mesaje/${existingConversation.id}`)
    } else {
      // Create new conversation
      const { data: newConversation, error } = await supabase
        .from('conversations')
        .insert({
          listing_id: listingId,
          buyer_id: user.id,
          seller_id: sellerId,
        })
        .select('id')
        .single()

      if (error) {
        toast.error('Nu s-a putut crea conversația')
        return
      }

      router.push(`/mesaje/${newConversation.id}`)
    }
  }

  if (isOwner) {
    return (
      <div className="space-y-3">
        <Button className="w-full" asChild>
          <Link href={`/cont/anunturi/${listingId}/editeaza`}>
            <Edit className="mr-2 h-4 w-4" />
            Editează anunțul
          </Link>
        </Button>
        {!isAdmin && (
          <Button variant="outline" className="w-full" asChild>
            <Link href={`/promovare?listing=${listingId}`}>
              <Sparkles className="mr-2 h-4 w-4" />
              Promovează
            </Link>
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {sellerPhone && (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setShowPhone(!showPhone)}
        >
          <Phone className="mr-2 h-4 w-4" />
          {showPhone ? sellerPhone : 'Arată telefonul'}
        </Button>
      )}

      <Button className="w-full" onClick={handleMessage}>
        <MessageSquare className="mr-2 h-4 w-4" />
        Trimite mesaj
      </Button>

      <Button
        variant={favorite ? 'default' : 'outline'}
        className="w-full"
        onClick={handleFavorite}
        disabled={isLoading}
      >
        <Heart
          className={`mr-2 h-4 w-4 ${favorite ? 'fill-current' : ''}`}
        />
        {favorite ? 'Salvat în favorite' : 'Salvează în favorite'}
      </Button>
    </div>
  )
}
