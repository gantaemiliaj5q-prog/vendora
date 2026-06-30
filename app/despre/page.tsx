import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ShieldCheck, Users, Zap } from 'lucide-react'

export const metadata = {
  title: 'Despre Noi | Vendora',
  description: 'Află mai multe despre platforma de anunțuri Vendora',
}

export default function DesprePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      <main className="flex-1 bg-[#f9fafb]">
        {/* Banner Titlu */}
        <section className="border-b bg-zinc-50 py-16">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Despre Platforma Vendora
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Vendora este un marketplace modern dezvoltat ca proiect de licență, conceput pentru a simplifica procesul de vânzare și cumpărare a produselor verificate pe teritoriul României.
            </p>
          </div>
        </section>

        {/* Puncte forte */}
        <section className="py-16 max-w-5xl mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Siguranță înainte de toate</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Platforma integrează sisteme de verificare a anunțurilor pentru a asigura o comunitate curată și lipsită de fraude.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Performanță și Viteză</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Construit pe tehnologii de ultimă generație precum Next.js și Supabase, site-ul oferă o navigare fluidă și instantanee.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Comunitate Locală</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Facilităm legătura directă dintre cumpărătorii și vânzătorii locali din județele și orașele din România.
              </p>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}