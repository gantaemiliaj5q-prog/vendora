import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { Header } from '@/components/header'
import { ChatInterface } from '@/components/chat-interface'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ChatPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/auth/login?redirect=/mesaje/${id}`)
  }

  // Get conversation
  const { data: conversation, error } = await supabase
    .from('conversations')
    .select(`
      *,
      listing:listings(id, title, images, price, currency, status),
      buyer:profiles!conversations_buyer_id_fkey(id, full_name, avatar_url),
      seller:profiles!conversations_seller_id_fkey(id, full_name, avatar_url)
    `)
    .eq('id', id)
    .single()

  if (error || !conversation) {
    notFound()
  }

  // Check if user is part of conversation
  if (conversation.buyer_id !== user.id && conversation.seller_id !== user.id) {
    redirect('/mesaje')
  }

  // Get messages
  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', id)
    .order('created_at', { ascending: true })

  // Mark messages as read
  await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('conversation_id', id)
    .neq('sender_id', user.id)
    .eq('is_read', false)

  const otherUser =
    conversation.buyer_id === user.id
      ? conversation.seller
      : conversation.buyer

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Button variant="ghost" className="mb-4 w-fit" asChild>
            <Link href="/mesaje">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Înapoi la mesaje
            </Link>
          </Button>

          {/* Listing Info */}
          {conversation.listing && (
            <Card className="mb-4">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                  {conversation.listing.images &&
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
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/anunturi/${conversation.listing.id}`}
                    className="font-medium hover:text-primary"
                  >
                    {conversation.listing.title}
                  </Link>
                  <p className="text-lg font-bold text-primary">
                    {formatPrice(
                      conversation.listing.price,
                      conversation.listing.currency
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={otherUser?.avatar_url || undefined} />
                    <AvatarFallback>
                      {otherUser?.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">
                    {otherUser?.full_name || 'Utilizator'}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Chat */}
          <ChatInterface
            conversationId={id}
            currentUserId={user.id}
            initialMessages={messages || []}
            otherUser={otherUser}
          />
        </div>
      </main>
    </div>
  )
}
