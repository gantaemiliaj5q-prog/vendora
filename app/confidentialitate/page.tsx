import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export const metadata = {
  title: 'Politica de Confidentialitate',
}

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Politica de Confidentialitate</h1>
          <p className="mt-2 text-muted-foreground">
            Ultima actualizare: {new Date().toLocaleDateString('ro-RO')}
          </p>

          <div className="mt-8 space-y-8 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold text-foreground">1. Introducere</h2>
              <p className="mt-3">
                La Vendora, respectam confidentialitatea dumneavoastra. Aceasta politica descrie modul in care 
                colectam, utilizam si protejam informatiile personale atunci cand utilizati platforma noastra.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">2. Datele pe care le Colectam</h2>
              <p className="mt-3">
                Colectam urmatoarele tipuri de informatii:
              </p>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li><strong>Date de identificare:</strong> nume, adresa de email, numar de telefon</li>
                <li><strong>Date de cont:</strong> parola (criptata), preferinte de utilizator</li>
                <li><strong>Date despre anunturi:</strong> titlu, descriere, imagini, pret, locatie</li>
                <li><strong>Date tehnice:</strong> adresa IP, tipul browserului, pagini vizitate</li>
                <li><strong>Date de comunicare:</strong> mesaje trimise prin platforma</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">3. Cum Utilizam Datele</h2>
              <p className="mt-3">
                Utilizam datele colectate pentru:
              </p>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>Furnizarea si imbunatatirea serviciilor noastre</li>
                <li>Procesarea si afisarea anunturilor</li>
                <li>Comunicarea cu dumneavoastra despre cont si anunturi</li>
                <li>Prevenirea fraudelor si asigurarea securitatii</li>
                <li>Analiza utilizarii platformei pentru imbunatatiri</li>
                <li>Trimiterea de notificari relevante (daca ati optat pentru acestea)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">4. Cookies si Tehnologii Similare</h2>
              <p className="mt-3">
                Folosim cookies pentru:
              </p>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li><strong>Cookies esentiale:</strong> necesare pentru functionarea site-ului</li>
                <li><strong>Cookies de performanta:</strong> pentru analiza traficului</li>
                <li><strong>Cookies de marketing:</strong> pentru publicitate personalizata (optional)</li>
              </ul>
              <p className="mt-3">
                Puteti gestiona preferintele pentru cookies din banner-ul afisat la prima vizita.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">5. Partajarea Datelor</h2>
              <p className="mt-3">
                Nu vindem datele dumneavoastra. Putem partaja date cu:
              </p>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>Alti utilizatori (doar informatiile din anunturi publice)</li>
                <li>Furnizori de servicii (procesatori de plati, hosting)</li>
                <li>Autoritati, daca legea o impune</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">6. Securitatea Datelor</h2>
              <p className="mt-3">
                Implementam masuri de securitate pentru a proteja datele dumneavoastra:
              </p>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>Criptare SSL pentru transmiterea datelor</li>
                <li>Parole criptate in baza de date</li>
                <li>Acces restrictionat la date</li>
                <li>Monitorizare continua pentru detectarea amenintarilor</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">7. Drepturile Dumneavoastra (GDPR)</h2>
              <p className="mt-3">
                Conform GDPR, aveti dreptul la:
              </p>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li><strong>Acces:</strong> sa solicitati o copie a datelor dumneavoastra</li>
                <li><strong>Rectificare:</strong> sa corectati date incorecte</li>
                <li><strong>Stergere:</strong> sa solicitati stergerea datelor</li>
                <li><strong>Portabilitate:</strong> sa primiti datele intr-un format standard</li>
                <li><strong>Opozitie:</strong> sa va opuneti procesarii in anumite situatii</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">8. Retentia Datelor</h2>
              <p className="mt-3">
                Pastram datele dumneavoastra atat timp cat aveti un cont activ sau cat timp este necesar 
                pentru a va furniza serviciile. Dupa stergerea contului, vom pastra anumite date pentru 
                o perioada limitata din motive legale.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">9. Modificari ale Politicii</h2>
              <p className="mt-3">
                Putem actualiza aceasta politica periodic. Va vom notifica despre modificari 
                semnificative prin email sau printr-o notificare pe platforma.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">10. Contact</h2>
              <p className="mt-3">
                Pentru intrebari despre confidentialitate sau pentru a va exercita drepturile, contactati-ne la:
              </p>
              <p className="mt-2">
                Email: <a href="mailto:privacy@vendora.ro" className="text-primary hover:underline">privacy@vendora.ro</a>
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
