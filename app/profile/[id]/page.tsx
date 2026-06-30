'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Star, MessageSquare, ShieldCheck, Send, User } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { ro } from 'date-fns/locale'

interface ProfilePageProps {
  params: Promise<{ id: string }>
}

export default function PublicProfilePage({ params }: ProfilePageProps) {
  const resolvedParams = React.use(params)
  const profileId = resolvedParams.id
  
  const supabase = createClient()
  const [profile, setProfile] = useState<any>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
  
  // Stări formular recenzie conform documentației Zod/React Hooks
  const [rating, setRating] = useState<number>(5)
  const [comment, setComment] = useState<string>('')
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProfileData() {
      setLoading(true)
      try {
        // 1. Preluare profil utilizator vizualizat
        const { data: prof } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', profileId)
          .single()
        setProfile(prof)

        // 2. Preluare sesiune curentă
        const { data: { user } } = await supabase.auth.getUser()
        setCurrentUser(user)

        // 3. Preluare recenzii existente din tabelă
        const { data: revs } = await supabase
          .from('reviews')
          .select('*, author:profiles!reviews_author_id_fkey(*)')
          .eq('target_id', profileId)
          .order('created_at', { ascending: false })
        
        setReviews(revs || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (profileId) loadProfileData()
  }, [profileId, supabase])

  const handleSendReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) {
      toast.error('Trebuie să fii autentificat pentru a lăsa o recenzie!')
      return
    }

    if (currentUser.id === profileId) {
      toast.error('Aplicația blochează acordarea unei autoevaluări!')
      return
    }

    if (comment.trim().length < 5) {
      toast.error('Comentariul trebuie să conțină minimum 5 caractere!')
      return
    }

    setIsSubmitting(true)
    try {
      // Inserare recenzie în tabela din Supabase (Simulare Server Action/Zod)
      const { error } = await supabase
        .from('reviews')
        .insert({
          author_id: currentUser.id,
          target_id: profileId,
          rating,
          comment: comment.trim(),
        })

      if (error) throw error

      toast.success('Recenzia a fost înregistrată cu succes!')
      setComment('')
      setRating(5)
      
      // Reîncărcare listă recenzii
      const { data: revs } = await supabase
        .from('reviews')
        .select('*, author:profiles!reviews_author_id_fkey(*)')
        .eq('target_id', profileId)
        .order('created_at', { ascending: false })
      setReviews(revs || [])
    } catch (err) {
      toast.error('Ai lăsat deja o evaluare recentă acestui utilizator!')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Calculare medie rating general
  const totalReviews = reviews.length
  const averageRating = totalReviews > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : '0.0'

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f9fafb]">
        <Header />
        <div className="flex-1 flex items-center justify-center font-medium text-muted-foreground">
          Se încarcă istoricul profilului...
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f9fafb]">
      <Header />
      <main className="flex-1 py-10">
        <div className="mx-auto max-w-4xl px-4">
          
          {/* Card Profil Utilizator Evaluat */}
          <Card className="rounded-2xl border-gray-100 shadow-sm bg-white p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <Avatar className="h-16 w-16 ring-4 ring-emerald-50">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-emerald-50 text-emerald-700 font-bold text-lg">
                  {profile?.full_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-gray-900 flex items-center justify-center sm:justify-start gap-2">
                  {profile?.full_name || 'Utilizator Vendora'}
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                </h1>
                <p className="text-xs font-medium text-muted-foreground mt-1">
                  Membru din {profile?.created_at ? format(new Date(profile.created_at), 'MMMM yyyy', { locale: ro }) : 'N/A'}
                </p>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center px-6">
                <div className="text-2xl font-black text-emerald-600 flex items-center gap-1 justify-center">
                  {averageRating} <Star className="h-5 w-5 fill-emerald-500 text-emerald-500" />
                </div>
                <p className="text-[11px] font-bold text-emerald-700/80 uppercase tracking-wider mt-0.5">{totalReviews} {totalReviews === 1 ? 'Evaluare' : 'Evaluări'}</p>
              </div>
            </div>
          </Card>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Formular Adăugare Recenzie (Apare doar dacă nu e propriul cont) */}
            <div className="md:col-span-1">
              {currentUser && currentUser.id !== profileId ? (
                <Card className="rounded-2xl border-gray-100 shadow-sm bg-white p-4 sticky top-24">
                  <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wide mb-4">Adaugă o recenzie</h3>
                  <form onSubmit={handleSendReview} className="space-y-4">
                    
                    {/* Stele Interactive Lucide React conform documentației */}
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1.5">Calificativ *</label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(null)}
                            className="transition-transform active:scale-95"
                          >
                            <Star
                              className={cn(
                                "h-6 w-6 transition-colors",
                                star <= (hoverRating ?? rating)
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-gray-200 fill-transparent"
                              )}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-600 block">Comentariu text *</label>
                      <Textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Descrie experiența ta de colaborare..."
                        rows={4}
                        className="rounded-xl border-gray-200 text-sm focus:border-emerald-500 focus:ring-emerald-500 bg-gray-50/50"
                        required
                      />
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-emerald-600 text-white font-bold text-xs h-10 hover:bg-emerald-700 transition-colors shadow-sm">
                      <Send className="mr-2 h-3.5 w-3.5" />
                      TRIMITE FEEDBACK
                    </Button>
                  </form>
                </Card>
              ) : (
                <Card className="rounded-2xl border-gray-100 shadow-sm bg-gray-50/50 p-4 text-center text-xs font-medium text-gray-400 border-dashed">
                  {currentUser?.id === profileId 
                    ? "Vizualizezi propriul tău istoric public de feedback." 
                    : "Autentifică-te pentru a acorda un calificativ."}
                </Card>
              )}
            </div>

            {/* Istoric Comentarii Recenzii publice */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wide flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-emerald-600" />
                Comunitatea spune ({totalReviews})
              </h3>
              
              {reviews.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm font-medium text-muted-foreground bg-white">
                  Acest utilizator nu a primit încă nicio recenzie de la alți membri.
                </div>
              ) : (
                reviews.map((rev) => (
                  <Card key={rev.id} className="rounded-2xl border-gray-100 shadow-sm bg-white p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={rev.author?.avatar_url || undefined} />
                        <AvatarFallback className="bg-gray-100 text-gray-600 font-bold text-xs">
                          {rev.author?.full_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <p className="text-sm font-bold text-gray-900">{rev.author?.full_name || 'Utilizator anonim'}</p>
                          <span className="text-[10px] font-semibold text-gray-400">
                            {format(new Date(rev.created_at), 'd MMMM yyyy', { locale: ro })}
                          </span>
                        </div>
                        
                        {/* Randare Stele primite */}
                        <div className="flex items-center gap-0.5 mt-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star 
                              key={s} 
                              className={cn(
                                "h-3.5 w-3.5", 
                                s <= rev.rating ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-transparent"
                              )} 
                            />
                          ))}
                        </div>
                        
                        <p className="text-xs font-medium text-gray-600 mt-2.5 leading-relaxed bg-gray-50/50 p-3 rounded-xl border border-gray-100/50">
                          {rev.comment}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}

// Funcție utilitară internă pentru concatenare clase
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
