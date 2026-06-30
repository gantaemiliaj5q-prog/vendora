'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/ui/spinner'
import { Eye, EyeOff, Mail, Lock, User, Phone, AlertCircle, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
export const dynamic = 'force-dynamic';

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const supabase = createClient()

  const passwordRequirements = [
    { label: 'Cel puțin 8 caractere', valid: formData.password.length >= 8 },
    { label: 'Cel puțin o literă mare', valid: /[A-Z]/.test(formData.password) },
    { label: 'Cel puțin o cifră', valid: /[0-9]/.test(formData.password) },
  ]

  const isPasswordValid = passwordRequirements.every((req) => req.valid)
  const passwordsMatch = formData.password === formData.confirmPassword

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!isPasswordValid) {
      setError('Parola nu îndeplinește cerințele de securitate')
      setIsLoading(false)
      return
    }

    if (!passwordsMatch) {
      setError('Parolele nu coincid')
      setIsLoading(false)
      return
    }

    if (!acceptTerms) {
      setError('Trebuie să accepți termenii și condițiile')
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
            `http://localhost:3000/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
          data: {
            full_name: formData.fullName,
            phone: formData.phone,
          },
        },
      })

      if (error) {
        if (error.message.includes('already registered')) {
          setError('Acest email este deja înregistrat')
        } else {
          setError(error.message)
        }
        return
      }

      setSuccess(true)
      toast.success('Cont creat cu succes!')
    } catch {
      setError('A apărut o eroare. Te rugăm să încerci din nou.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthRegister = async (provider: 'google' | 'facebook') => {
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
        },
      })

      if (error) {
        setError(error.message)
      }
    } catch {
      setError('A apărut o eroare. Te rugăm să încerci din nou.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f9fafb] px-4 py-12">
        <div className="w-full max-w-md">
          <Card className="rounded-2xl border-gray-100 shadow-sm">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Verifică-ți emailul</CardTitle>
              <CardDescription className="text-gray-500">
                Am trimis un link de confirmare la adresa{' '}
                <span className="font-semibold text-gray-900">{formData.email}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-sm text-gray-500 leading-relaxed">
                Apasă pe link-ul din email pentru a-ți activa contul. Verifică și
                folderul de spam dacă nu găsești emailul.
              </p>
              <Button variant="outline" asChild className="rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50">
                <Link href="/auth/login">Înapoi la autentificare</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f9fafb] px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo Uniformizat după cel din Footer */}
<Link href="/" className="mb-8 flex items-center justify-center gap-2 group">
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#10b981]">
    <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  </div>
  <span className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Vendora</span>
</Link>

        <Card className="rounded-2xl border-gray-100 shadow-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">Creează cont</CardTitle>
            <CardDescription className="text-gray-500">
              Înregistrează-te pentru a publica anunțuri
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4 rounded-xl">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* OAuth Buttons */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full h-10 rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50 font-medium text-sm"
                onClick={() => handleOAuthRegister('google')}
                disabled={isLoading}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continuă cu Google
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-10 rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50 font-medium text-sm"
                onClick={() => handleOAuthRegister('facebook')}
                disabled={isLoading}
              >
                <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Continuă cu Facebook
              </Button>
            </div>

            <div className="relative my-6">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-muted-foreground">
                sau cu email
              </span>
            </div>

            {/* Email Register Form */}
            <form onSubmit={handleEmailRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-gray-700 font-medium">Nume complet</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Ion Popescu"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="pl-10 h-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl bg-gray-50/50"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="nume@exemplu.ro"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 h-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl bg-gray-50/50"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700 font-medium">Telefon (opțional)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="0712 345 678"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-10 h-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl bg-gray-50/50"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">Parolă</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Creează o parolă"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10 h-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl bg-gray-50/50"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {formData.password && (
                  <div className="mt-2 space-y-1">
                    {passwordRequirements.map((req, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-2 text-xs ${
                          req.valid ? 'text-emerald-600 font-medium' : 'text-muted-foreground'
                        }`}
                      >
                        <CheckCircle2 className={`h-3 w-3 ${req.valid ? 'text-emerald-600 opacity-100' : 'opacity-30'}`} />
                        {req.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirmă parola</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Repetă parola"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10 h-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl bg-gray-50/50"
                    required
                    disabled={isLoading}
                  />
                </div>
                {formData.confirmPassword && !passwordsMatch && (
                  <p className="text-xs text-destructive font-medium pl-1">Parolele nu coincid</p>
                )}
              </div>

              {/* Checkbox-ul pentru Termeni mutat pe nuanța Emerald */}
              <div className="flex items-start gap-2 pt-1">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  disabled={isLoading}
                  className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 rounded-md focus-visible:ring-emerald-500"
                />
                <Label htmlFor="terms" className="text-sm font-normal leading-tight text-gray-600 cursor-pointer select-none">
                  Accept{' '}
                  <Link href="/termeni" className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline">
                    Termenii și condițiile
                  </Link>{' '}
                  și{' '}
                  <Link href="/confidentialitate" className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline">
                    Politica de confidențialitate
                  </Link>
                  .
                </Label>
              </div>

              {/* Butonul principal de trimitere - Stil Premium Emerald */}
              <Button
                type="submit"
                className="w-full h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm shadow-emerald-900/10 transition-colors"
                disabled={isLoading || !acceptTerms || !isPasswordValid || !passwordsMatch}
              >
                {isLoading ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4 text-white" />
                    Se creează contul...
                  </>
                ) : (
                  'Creează cont'
                )}
              </Button>
            </form>

            {/* Link Autentificare sub formular */}
            <p className="mt-6 text-center text-sm text-gray-500">
              Ai deja cont?{' '}
              <Link
                href={`/auth/login${redirectTo !== '/' ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}
                className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                Autentifică-te
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}