'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Send } from 'lucide-react'
import { format } from 'date-fns'
import { ro } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  is_read: boolean
  created_at: string
}

interface ChatInterfaceProps {
  conversationId: string
  currentUserId: string
  initialMessages: Message[]
  otherUser: {
    id: string
    full_name: string | null
    avatar_url: string | null
  } | null
}

export function ChatInterface({
  conversationId,
  currentUserId,
  initialMessages,
  otherUser,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Subscribe to new messages
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message
          setMessages((prev) => {
            // Check if message already exists
            if (prev.some((m) => m.id === newMsg.id)) {
              return prev
            }
            return [...prev, newMsg]
          })

          // Mark as read if not from current user
          if (newMsg.sender_id !== currentUserId) {
            supabase
              .from('messages')
              .update({ is_read: true })
              .eq('id', newMsg.id)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId, currentUserId, supabase])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || isSending) return

    setIsSending(true)
    const messageContent = newMessage.trim()
    setNewMessage('')

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: currentUserId,
          content: messageContent,
        })
        .select()
        .single()

      if (error) throw error

      // Add message optimistically
      setMessages((prev) => {
        if (prev.some((m) => m.id === data.id)) {
          return prev
        }
        return [...prev, data]
      })

      // Update conversation timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId)
    } catch (error) {
      console.error('Error sending message:', error)
      setNewMessage(messageContent)
    } finally {
      setIsSending(false)
    }
  }

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {}
    messages.forEach((message) => {
      const date = format(new Date(message.created_at), 'yyyy-MM-dd')
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
    })
    return groups
  }

  const groupedMessages = groupMessagesByDate(messages)

  return (
    <Card className="flex flex-1 flex-col overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date}>
            <div className="my-4 flex items-center justify-center">
              <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                {format(new Date(date), 'd MMMM yyyy', { locale: ro })}
              </span>
            </div>
            <div className="space-y-3">
              {dateMessages.map((message) => {
                const isOwn = message.sender_id === currentUserId
                return (
                  <div
                    key={message.id}
                    className={cn(
                      'flex items-end gap-2',
                      isOwn && 'flex-row-reverse'
                    )}
                  >
                    {!isOwn && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={otherUser?.avatar_url || undefined} />
                        <AvatarFallback className="text-xs">
                          {otherUser?.full_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        'max-w-[70%] rounded-2xl px-4 py-2',
                        isOwn
                          ? 'rounded-br-sm bg-primary text-primary-foreground'
                          : 'rounded-bl-sm bg-muted'
                      )}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={cn(
                          'mt-1 text-xs',
                          isOwn
                            ? 'text-primary-foreground/70'
                            : 'text-muted-foreground'
                        )}
                      >
                        {format(new Date(message.created_at), 'HH:mm')}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 border-t p-4"
      >
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Scrie un mesaj..."
          disabled={isSending}
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={!newMessage.trim() || isSending}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </Card>
  )
}
