'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast.success('Mesajul a fost trimis cu succes! Te vom contacta în curând.')
    setFormData({ name: '', email: '', subject: '', message: '' })
    setIsLoading(false)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 bg-[#f9fafb]">
        {/* Hero */}
        <section className="border-b bg-zinc-50 py-12">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-3xl font-bold md:text-4xl text-gray-900">Contact</h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Ai întrebări sau sugestii? Contactează-ne și îți vom răspunde
                cât mai curând posibil.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Contact Info - Iconițe mutate pe text-emerald-600 */}
              <div className="space-y-6">
                <Card className="rounded-2xl border-gray-100 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
                      <Mail className="h-5 w-5 text-emerald-600" />
                      Email
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">contact@anunturi.ro</p>
                    <p className="text-muted-foreground">
                      suport@anunturi.ro
                    </p>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-gray-100 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
                      <Phone className="h-5 w-5 text-emerald-600" />
                      Telefon
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">+40 123 456 789</p>
                    <p className="text-sm text-muted-foreground">
                      Luni - Vineri: 09:00 - 18:00
                    </p>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-gray-100 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
                      <MapPin className="h-5 w-5 text-emerald-600" />
                      Adresă
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Str. Exemplu nr. 123
                    </p>
                    <p className="text-muted-foreground">București, România</p>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-gray-100 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
                      <MessageCircle className="h-5 w-5 text-emerald-600" />
                      Întrebări frecvente
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Verifică secțiunea{' '}
                      <a href="/faq" className="text-emerald-600 font-semibold hover:underline">
                        Întrebări frecvente
                      </a>{' '}
                      pentru răspunsuri rapide.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card className="rounded-2xl border-gray-100 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900">Trimite-ne un mesaj</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-gray-700 font-medium">Numele tău *</Label>
                          <Input
                            id="name"
                            required
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            placeholder="Ion Popescu"
                            className="rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 h-10 bg-gray-50/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-gray-700 font-medium">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({ ...formData, email: e.target.value })
                            }
                            placeholder="ion@exemplu.ro"
                            className="rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 h-10 bg-gray-50/50"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-gray-700 font-medium">Subiect *</Label>
                        <Input
                          id="subject"
                          required
                          value={formData.subject}
                          onChange={(e) =>
                            setFormData({ ...formData, subject: e.target.value })
                          }
                          placeholder="Cu ce te putem ajuta?"
                          className="rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 h-10 bg-gray-50/50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-gray-700 font-medium">Mesaj *</Label>
                        <Textarea
                          id="message"
                          required
                          rows={6}
                          value={formData.message}
                          onChange={(e) =>
                            setFormData({ ...formData, message: e.target.value })
                          }
                          placeholder="Descrie în detaliu problema sau întrebarea ta..."
                          className="rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 bg-gray-50/50"
                        />
                      </div>

                      {/* Buton principal - Schimbat pe culoarea Emerald */}
                      <Button
                        type="submit"
                        size="lg"
                        disabled={isLoading}
                        className="w-full sm:w-auto rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm shadow-emerald-900/10 transition-colors h-11 px-6"
                      >
                        {isLoading ? (
                          'Se trimite...'
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Trimite mesajul
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}