'use client'

import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { formatDistanceToNow } from 'date-fns'
import { ro } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface Conversation {
  id: string
  listing_id: string
  buyer_id: string
  seller_id: string
  created_at: string
  updated_at: string
  listing: {
    id: string
    title: string
    images: string[] | null
    price: number
    currency: string
  } | null
  buyer: {
    id: string
    full_name: string | null
    avatar_url: string | null
  } | null
  seller: {
    id: string
    full_name: string | null
    avatar_url: string | null
  } | null
  last_message: {
    id: string
    content: string
    sender_id: string
    created_at: string
    is_read: boolean
  } | null
  unread_count: number
}

interface ConversationListProps {
  conversations: Conversation[]
  currentUserId: string
}

export function ConversationList({
  conversations,
  currentUserId,
}: ConversationListProps) {
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="space-y-3">
      {conversations.map((conversation) => {
        const otherUser =
          conversation.buyer_id === currentUserId
            ? conversation.seller
            : conversation.buyer

        return (
          <Link key={conversation.id} href={`/mesaje/${conversation.id}`}>
            <Card
              className={cn(
                'flex items-center gap-4 p-4 transition-colors hover:bg-muted/50',
                conversation.unread_count > 0 && 'bg-primary/5'
              )}
            >
              {/* Listing Image */}
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                {conversation.listing?.images &&
                conversation.listing.images.length > 0 ? (
                  <img
                    src={conversation.listing.images[0]}
                    alt={conversation.listing.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                    Fără
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={otherUser?.avatar_url || undefined} />
                    <AvatarFallback className="text-xs">
                      {otherUser?.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate font-medium">
                    {otherUser?.full_name || 'Utilizator'}
                  </span>
                  {conversation.unread_count > 0 && (
                    <Badge variant="destructive" className="ml-auto shrink-0">
                      {conversation.unread_count}
                    </Badge>
                  )}
                </div>

                <p className="mt-1 truncate text-sm text-foreground">
                  {conversation.listing?.title}
                </p>

                {conversation.last_message && (
                  <p
                    className={cn(
                      'mt-1 truncate text-sm',
                      conversation.unread_count > 0
                        ? 'font-medium text-foreground'
                        : 'text-muted-foreground'
                    )}
                  >
                    {conversation.last_message.sender_id === currentUserId
                      ? 'Tu: '
                      : ''}
                    {conversation.last_message.content}
                  </p>
                )}
              </div>

              {/* Meta */}
              <div className="shrink-0 text-right">
                <p className="text-sm font-medium text-primary">
                  {conversation.listing
                    ? formatPrice(
                        conversation.listing.price,
                        conversation.listing.currency
                      )
                    : ''}
                </p>
                {conversation.last_message && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDistanceToNow(
                      new Date(conversation.last_message.created_at),
                      { addSuffix: true, locale: ro }
                    )}
                  </p>
                )}
              </div>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
