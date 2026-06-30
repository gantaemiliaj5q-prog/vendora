'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Spinner } from '@/components/ui/spinner'
import { AlertCircle, CheckCircle2, ArrowLeft, Flag } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

const reportReasons = [
  { value: 'fraud', label: 'Fraudă sau înșelătorie' },
  { value: 'spam', label: 'Spam sau reclame repetate' },
  { value: 'inappropriate', label: 'Conținut inadecvat sau ofensator' },
  { value: 'fake', label: 'Informații false sau înșelătoare' },
  { value: 'illegal', label: 'Produse ilegale' },
  { value: 'other', label: 'Alt motiv' },
]

function ReportForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const listingId = searchParams.get('listing')

  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [listing, setListing] = useState<{ id: string; title: string } | null>(null)
  const [reason, setReason] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push(`/auth/login?redirect=/raportare${listingId ? `?listing=${listingId}` : ''}`)
        return
      }

      if (listingId) {
        const { data } = await supabase
          .from('listings')
          .select('id, title')
          .eq('id', listingId)
          .single()

        if (data) {
          setListing(data)
        }
      }

      setLoading(false)
    }

    checkAuth()
  }, [router, supabase, listingId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!reason) {
      setError('Te rugăm să selectezi un motiv pentru raportare')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }

      const { error: insertError } = await supabase
        .from('reports')
        .insert({
          reporter_id: user.id,
          listing_id: listingId || null,
          reason,
          description: description.trim() || null,
          status: 'pending',
        })

      if (insertError) throw insertError

      setSuccess(true)
      toast.success('Raportarea a fost trimisă cu succes')
    } catch {
      setError('A apărut o eroare. Te rugăm să încerci din nou.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <Spinner className="h-8 w-8" />
        </main>
        <Footer />
      </div>
    )
  }

  if (success) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-muted/30">
          <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 lg:px-8">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-xl font-bold">Raportare trimisă</h2>
                <p className="mt-2 text-muted-foreground">
                  Mulțumim pentru raportare. Echipa noastră va analiza cererea ta în cel mai scurt timp.
                </p>
                <Button className="mt-6" asChild>
                  <Link href={listingId ? `/anunturi/${listingId}` : '/anunturi'}>
                    Înapoi
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        <div className="mx-auto max-w-lg px-4 py-8 sm:px-6 lg:px-8">
          {listingId && (
            <Button variant="ghost" className="mb-6" asChild>
              <Link href={`/anunturi/${listingId}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Înapoi la anunț
              </Link>
            </Button>
          )}

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Flag className="h-5 w-5 text-destructive" />
                <CardTitle>Raportează</CardTitle>
              </div>
              <CardDescription>
                {listing
                  ? `Raportează anunțul "${listing.title}"`
                  : 'Raportează o problemă'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label>Motivul raportării *</Label>
                  <RadioGroup value={reason} onValueChange={setReason}>
                    {reportReasons.map((r) => (
                      <div key={r.value} className="flex items-center space-x-3">
                        <RadioGroupItem value={r.value} id={r.value} />
                        <Label htmlFor={r.value} className="font-normal cursor-pointer">
                          {r.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Detalii suplimentare (opțional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Descrie problema în detaliu..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    maxLength={1000}
                  />
                  <p className="text-xs text-muted-foreground">
                    {description.length}/1000 caractere
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Spinner className="mr-2" />
                      Se trimite...
                    </>
                  ) : (
                    'Trimite raportarea'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function ReportPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center">
          <Spinner className="h-8 w-8" />
        </main>
        <Footer />
      </div>
    }>
      <ReportForm />
    </Suspense>
  )
}
