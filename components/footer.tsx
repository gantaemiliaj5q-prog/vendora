import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-12 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Coloana 1: Logo ABSOLUT IDENTIC cu cel din Header (Aceeași pictogramă, aceleași linii) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {/* Containerul oficial verde mint/emerald cu pictograma extrasă exact din Header */}
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10b981] shadow-sm">
                <svg 
                  className="h-5 w-5 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
                  />
                </svg>
              </div>
              {/* Textul oficial al brandului */}
              <span className="text-2xl font-bold text-gray-900 tracking-tight uppercase">Vendora</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Vendora - platforma ta de încredere pentru anunțuri de vânzare-cumpărare. Găsește cele mai bune oferte sau publică propriile tale anunțuri gratuit.
            </p>
          </div>

          {/* Coloana 2: Categorii */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Categorii</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/anunturi?categorie=imobiliare" className="hover:text-emerald-600 transition-colors">Imobiliare</Link></li>
              <li><Link href="/anunturi?categorie=vehicule" className="hover:text-emerald-600 transition-colors">Auto-Moto</Link></li>
              <li><Link href="/anunturi?categorie=electronice" className="hover:text-emerald-600 transition-colors">Electronice</Link></li>
              <li><Link href="/anunturi?categorie=moda" className="hover:text-emerald-600 transition-colors">Moda</Link></li>
              <li><Link href="/anunturi" className="hover:text-emerald-600 transition-colors font-medium text-emerald-600">Toate categoriile</Link></li>
            </ul>
          </div>

          {/* Coloana 3: Informatii */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Informații</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/despre" className="hover:text-emerald-600 transition-colors">Despre noi</Link></li>
              <li><Link href="/contact" className="hover:text-emerald-600 transition-colors">Contact</Link></li>
              <li><Link href="/termeni" className="hover:text-emerald-600 transition-colors">Termeni și condiții</Link></li>
              <li><Link href="/confidentialitate" className="hover:text-emerald-600 transition-colors">Politica de confidențialitate</Link></li>
            </ul>
          </div>

          {/* Coloana 4: Contact */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="hover:text-emerald-600 transition-colors">Email: contact@vendora.ro</li>
              <li>Telefon: +40 123 456 789</li>
              <li className="text-xs text-gray-400 pt-1">Luni - Vineri: 9:00 - 18:00</li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-200 mt-12 pt-6 text-center text-xs text-gray-400">
          © 2026 Vendora. Toate drepturile rezervate.
        </div>
      </div>
    </footer>
  )
}