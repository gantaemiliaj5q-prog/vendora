'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  Plus,
  User,
  Heart,
  MessageSquare,
  Menu,
  X,
  LogOut,
  Settings,
  LayoutDashboard,
  Shield,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import type { Profile } from '@/lib/types'

export function Header() {
  const pathname = usePathname()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfile(profile)
      }
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const isActive = (path: string) => pathname === path
  const isAdmin = !!profile?.is_admin

  return (
    <header className="sticky top-0 z-50 bg-[#111827] border-b border-zinc-800 shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-6">
          
          {/* Logo Uniformizat */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#10b981]">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white uppercase tracking-tight">Vendora</span>
          </Link>

          {/* Desktop Navigation Links (Fără CATEGORII) */}
          <nav className="hidden items-center gap-8 lg:flex">
            <Link
              href="/"
              className={`text-xs font-medium uppercase tracking-wider transition-all duration-200 hover:text-white ${
                isActive('/') ? 'text-white border-b-2 border-emerald-400 pb-1' : 'text-gray-400'
              }`}
            >
              Acasă
            </Link>
            <Link
              href="/anunturi"
              className={`text-xs font-medium uppercase tracking-wider transition-all duration-200 hover:text-white ${
                isActive('/anunturi') ? 'text-white border-b-2 border-emerald-400 pb-1' : 'text-gray-400'
              }`}
            >
              Anunțuri
            </Link>
            <Link
              href="/despre"
              className={`text-xs font-medium uppercase tracking-wider transition-all duration-200 hover:text-white ${
                isActive('/despre') ? 'text-white border-b-2 border-emerald-400 pb-1' : 'text-gray-400'
              }`}
            >
              Despre Noi
            </Link>
            <Link
              href="/contact"
              className={`text-xs font-medium uppercase tracking-wider transition-all duration-200 hover:text-white ${
                isActive('/contact') ? 'text-white border-b-2 border-emerald-400 pb-1' : 'text-gray-400'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="hidden items-center gap-4 md:flex">
            {user ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full"
                  style={isAdmin ? { display: 'none' } : undefined}
                >
                  <Link href="/favorite">
                    <Heart className="h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full"
                  style={isAdmin ? { display: 'none' } : undefined}
                >
                  <Link href="/mesaje">
                    <MessageSquare className="h-5 w-5" />
                  </Link>
                </Button>

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 rounded-full border border-zinc-700 px-3 h-10 text-gray-300 hover:bg-white/10 hover:text-white"
                    >
                      <User className="h-4 w-4" />
                      <span className="text-sm">Contul Meu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-[#1f2937] border-gray-700 text-white rounded-xl shadow-xl">
                    <div className="px-2 py-1.5">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white">
                          {profile?.full_name || user.email}
                        </p>
                        {isAdmin && (
                          <Badge variant="secondary" className="text-xs bg-emerald-600 text-white">
                            Admin
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem asChild className="text-gray-300 focus:bg-white/10 focus:text-white cursor-pointer rounded-lg">
                      <Link href="/cont">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Contul meu
                      </Link>
                    </DropdownMenuItem>
                    {!isAdmin && (
                      <>
                        <DropdownMenuItem asChild className="text-gray-300 focus:bg-white/10 focus:text-white cursor-pointer rounded-lg">
                          <Link href="/cont/anunturi">
                            <Settings className="mr-2 h-4 w-4" />
                            Anunțurile mele
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="text-gray-300 focus:bg-white/10 focus:text-white cursor-pointer rounded-lg">
                          <Link href="/favorite">
                            <Heart className="mr-2 h-4 w-4" />
                            Favorite
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="text-gray-300 focus:bg-white/10 focus:text-white cursor-pointer rounded-lg">
                          <Link href="/mesaje">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Mesaje
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator className="bg-gray-700" />
                        <DropdownMenuItem asChild className="text-gray-300 focus:bg-white/10 focus:text-white cursor-pointer rounded-lg">
                          <Link href="/admin">
                            <Shield className="mr-2 h-4 w-4" />
                            Panou Admin
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="text-red-400 focus:bg-red-500/10 focus:text-red-300 cursor-pointer rounded-lg"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Deconectare
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Publish Button (Micsorat si redenumit) */}
                <Button
                  asChild
                  className="rounded-xl bg-emerald-600 px-4 h-10 text-xs font-bold text-white transition-colors hover:bg-emerald-500"
                  style={isAdmin ? { display: 'none' } : undefined}
                >
                  <Link href="/anunturi/adauga">
                    <Plus className="mr-1 h-3.5 w-3.5" />
                    ADAUGA ANUNT
                  </Link>
                </Button>
              </>
            ) : (
              <>
                {/* REPARAT: Când NU ești logată, apar butoanele originale conforme cu cerința ta */}
                <Link 
                  href="/auth/login" 
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors px-2"
                >
                  Autentificare
                </Link>
                <Button
                  asChild
                  className="rounded-xl bg-emerald-600 px-4 h-10 text-xs font-bold text-white transition-colors hover:bg-emerald-500 shadow-md shadow-emerald-900/10"
                >
                  <Link href="/auth/inregistrare">
                    + Inregistrare
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-gray-400 hover:text-white hover:bg-white/10 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-zinc-800 bg-[#111827] md:hidden">
          <div className="space-y-1 px-4 py-3">
            <div className="border-b border-zinc-800 pb-3 mb-3 space-y-1">
              <Link href="/" className="block text-sm text-gray-400 hover:text-white py-2" onClick={() => setMobileMenuOpen(false)}>Acasă</Link>
              <Link href="/anunturi" className="block text-sm text-gray-400 hover:text-white py-2" onClick={() => setMobileMenuOpen(false)}>Anunțuri</Link>
              <Link href="/despre" className="block text-sm text-gray-400 hover:text-white py-2" onClick={() => setMobileMenuOpen(false)}>Despre Noi</Link>
              <Link href="/contact" className="block text-sm text-gray-400 hover:text-white py-2" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            </div>

            {user ? (
              <>
                <div className="pb-3 mb-3 border-b border-zinc-800">
                  <p className="font-medium text-white text-sm">{profile?.full_name || user.email}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
                <Button variant="ghost" className="w-full justify-start text-gray-300 py-2" asChild onClick={() => setMobileMenuOpen(false)}>
                  <Link href="/cont"><LayoutDashboard className="mr-2 h-4 w-4" /> Contul meu</Link>
                </Button>
                <Button className="mt-3 w-full bg-emerald-600 text-white hover:bg-emerald-500 rounded-xl" asChild onClick={() => setMobileMenuOpen(false)}>
                  <Link href="/anunturi/adauga"><Plus className="mr-2 h-4 w-4" /> ADAUGA ANUNT</Link>
                </Button>
              </>
            ) : (
              <>
                {/* Sincronizare butoane meniu mobil */}
                <Button variant="ghost" className="w-full justify-start text-gray-300 py-2" asChild onClick={() => setMobileMenuOpen(false)}>
                  <Link href="/auth/login">Autentificare</Link>
                </Button>
                <Button className="w-full bg-emerald-600 text-white hover:bg-emerald-500 rounded-xl" asChild onClick={() => setMobileMenuOpen(false)}>
                  <Link href="/auth/inregistrare">+ Inregistrare</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}