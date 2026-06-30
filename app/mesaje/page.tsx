import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ConversationList } from '@/components/conversation-list'
import { MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata = {
  title: 'Mesaje',
}

export default async function MessagesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?redirect=/mesaje')
  }

  // Get conversations with last message
  const { data: conversations } = await supabase
    .from('conversations')
    .select(`
      *,
      listing:listings(id, title, images, price, currency),
      buyer:profiles!conversations_buyer_id_fkey(id, full_name, avatar_url),
      seller:profiles!conversations_seller_id_fkey(id, full_name, avatar_url)
    `)
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order('updated_at', { ascending: false })

  // Get last message and unread count for each conversation
  const conversationsWithMessages = await Promise.all(
    (conversations || []).map(async (conv) => {
      const { data: messages } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conv.id)
        .order('created_at', { ascending: false })
        .limit(1)

      const { count: unreadCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('conversation_id', conv.id)
        .eq('is_read', false)
        .neq('sender_id', user.id)

      return {
        ...conv,
        last_message: messages?.[0] || null,
        unread_count: unreadCount || 0,
      }
    })
  )

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold sm:text-3xl">Mesaje</h1>
            <p className="mt-1 text-muted-foreground">
              Conversațiile tale cu alți utilizatori
            </p>
          </div>

          {conversationsWithMessages && conversationsWithMessages.length > 0 ? (
            <ConversationList
              conversations={conversationsWithMessages}
              currentUserId={user.id}
            />
          ) : (
            <div className="rounded-lg border border-dashed border-border bg-muted/50 p-12 text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
              <h2 className="mt-4 text-lg font-semibold">Nicio conversație</h2>
              <p className="mt-2 text-muted-foreground">
                Începe o conversație contactând un vânzător
              </p>
              <Button className="mt-4" asChild>
                <Link href="/anunturi">Explorează anunțuri</Link>
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
