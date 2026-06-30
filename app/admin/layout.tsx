'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard,
  FileText,
  Users,
  Flag,
  FolderOpen,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/anunturi', label: 'Anunțuri', icon: FileText },
  { href: '/admin/utilizatori', label: 'Utilizatori', icon: Users },
  { href: '/admin/categorii', label: 'Categorii', icon: FolderOpen },
  { href: '/admin/raportari', label: 'Raportări', icon: Flag },
  { href: '/admin/setari', label: 'Setări', icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    async function checkAdmin() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      // DEBLOCARE LICENȚĂ: Verificăm direct e-mailul tău administrativ din screenshot sau metadate
      let isUserAdmin = 
        user.email === 'dariaganta44@gmail.com' || 
        user.user_metadata?.is_admin === true

      // Verificăm suplimentar și în tabela profiles
      if (!isUserAdmin) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle()

        isUserAdmin = profile?.role === 'admin'
      }

      setIsAdmin(isUserAdmin)

      if (!isUserAdmin) {
        // Dacă din greșeală intră altcineva, îl trimitem pe prima pagină
        router.push('/')
      }
    }

    checkAdmin()
  }, [router, supabase.auth])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (isAdmin === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="h-8 w-8 text-emerald-600" />
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-[#f9fafb]">
      {/* Mobile sidebar toggle */}
      <Button
        variant="outline"
        size="icon"
        className="fixed left-4 top-4 z-50 lg:hidden border-gray-200 text-gray-700"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar Administrativ dedicat */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 transform bg-white border-r border-gray-100 shadow-sm transition-transform duration-200 ease-in-out lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Brand/Logo Admin - Schimbat complet pe Emerald Verde */}
          <div className="flex h-16 items-center gap-2 border-b border-gray-100 px-6">
            <ShieldCheck className="h-6 w-6 text-emerald-600" />
            <span className="text-lg font-bold text-emerald-600 tracking-tight">Vendora Control</span>
          </div>

          {/* Navigație Meniu Stânga - Schimbat highlighted state pe Emerald/Verde */}
          <nav className="flex-1 space-y-1 p-4">
            {adminNavItems.map((item) => {
              const isItemActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all font-semibold text-sm",
                    isItemActive 
                      ? "bg-emerald-50 text-emerald-600" 
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className={cn("h-5 w-5", isItemActive ? "text-emerald-600" : "text-gray-400 group-hover:text-gray-600")} />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Subsol Sidebar */}
          <div className="border-t border-gray-100 p-4 space-y-1">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 text-sm font-semibold transition-colors"
            >
              <LayoutDashboard className="h-5 w-5 text-gray-400" />
              Înapoi la Marketplace
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 text-sm font-semibold"
            >
              <LogOut className="h-5 w-5 text-gray-400" />
              Deconectare Admin
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay fundal pentru ecrane mici (Mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Spațiul central unde se randează paginile noastre reparate */}
      <main className="flex-1 overflow-auto bg-white">
        <div className="container mx-auto p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}