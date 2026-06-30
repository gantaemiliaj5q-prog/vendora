'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Camera, AlertCircle, CheckCircle2, Trash2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface Profile {
  id: string
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  location: string | null
}

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    location: '',
  })
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login?redirect=/cont/setari')
        return
      }

      setEmail(user.email || '')

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileData) {
        setProfile(profileData)
        setFormData({
          full_name: profileData.full_name || '',
          phone: profileData.phone || '',
          location: profileData.location || '',
        })
      }

      setLoading(false)
    }

    loadProfile()
  }, [router, supabase])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !profile) return

    setUploading(true)

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${profile.id}/avatar.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', profile.id)

      if (updateError) throw updateError

      setProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : null)
      toast.success('Fotografia de profil a fost actualizată')
    } catch {
      toast.error('Eroare la încărcarea fotografiei')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name.trim() || null,
          phone: formData.phone.trim() || null,
          location: formData.location.trim() || null,
        })
        .eq('id', profile.id)

      if (error) throw error

      setSuccess('Profilul a fost actualizat cu succes')
      toast.success('Setările au fost salvate')
    } catch {
      setError('Eroare la salvarea setărilor')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    // This would need server-side implementation for full account deletion
    toast.error('Pentru a șterge contul, te rugăm să ne contactezi la support@vendora.ro')
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

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
          <Button variant="ghost" className="mb-6" asChild>
            <Link href="/cont">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Înapoi la cont
            </Link>
          </Button>

          <div className="mb-8">
            <h1 className="text-2xl font-bold sm:text-3xl">Setări cont</h1>
            <p className="mt-1 text-muted-foreground">
              Gestionează informațiile tale personale
            </p>
          </div>

          <div className="space-y-6">
            {/* Avatar */}
            <Card>
              <CardHeader>
                <CardTitle>Fotografie de profil</CardTitle>
                <CardDescription>
                  Această fotografie va fi afișată pe anunțurile tale
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={profile?.avatar_url || undefined} />
                      <AvatarFallback className="text-xl">
                        {formData.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <label className="absolute -bottom-1 -right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                      {uploading ? (
                        <Spinner className="h-4 w-4" />
                      ) : (
                        <Camera className="h-4 w-4" />
                      )}
                    </label>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>JPG, PNG sau GIF</p>
                    <p>Maximum 5MB</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informații personale</CardTitle>
                <CardDescription>
                  Actualizează-ți informațiile de profil
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="mb-4 border-green-500 bg-green-50 text-green-700">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      Emailul nu poate fi modificat
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="full_name">Nume complet</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      placeholder="Ion Popescu"
                      value={formData.full_name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="0712 345 678"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Locație</Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="București, Sector 1"
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </div>

                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <>
                        <Spinner className="mr-2" />
                        Se salvează...
                      </>
                    ) : (
                      'Salvează modificările'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive">Zonă periculoasă</CardTitle>
                <CardDescription>
                  Acțiuni ireversibile pentru contul tău
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Separator className="mb-4" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Șterge contul</p>
                    <p className="text-sm text-muted-foreground">
                      Această acțiune este permanentă și nu poate fi anulată
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Șterge cont
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Ești sigur?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Această acțiune nu poate fi anulată. Contul tău și toate datele
                          asociate (anunțuri, mesaje, favorite) vor fi șterse permanent.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Anulează</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Șterge definitiv
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
