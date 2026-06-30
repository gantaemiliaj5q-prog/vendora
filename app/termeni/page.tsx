import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export const metadata = {
  title: 'Termeni si Conditii',
}

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Termeni si Conditii</h1>
          <p className="mt-2 text-muted-foreground">
            Ultima actualizare: {new Date().toLocaleDateString('ro-RO')}
          </p>

          <div className="mt-8 space-y-8 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold text-foreground">1. Acceptarea Termenilor</h2>
              <p className="mt-3">
                Prin accesarea si utilizarea platformei Vendora, acceptati sa respectati acesti termeni si conditii. 
                Daca nu sunteti de acord cu oricare dintre acesti termeni, va rugam sa nu utilizati serviciile noastre.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">2. Descrierea Serviciului</h2>
              <p className="mt-3">
                Vendora este o platforma online de anunturi care permite utilizatorilor sa publice si sa vizualizeze 
                anunturi de vanzare-cumparare. Platforma faciliteaza contactul intre vanzatori si cumparatori, 
                dar nu este parte in tranzactiile dintre acestia.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">3. Inregistrarea Contului</h2>
              <p className="mt-3">
                Pentru a publica anunturi, trebuie sa va creati un cont. Sunteti responsabil pentru:
              </p>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>Furnizarea de informatii corecte si actualizate</li>
                <li>Pastrarea confidentialitatii parolei</li>
                <li>Toate activitatile desfasurate prin contul dumneavoastra</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">4. Reguli pentru Anunturi</h2>
              <p className="mt-3">
                Anunturile publicate trebuie sa respecte urmatoarele reguli:
              </p>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>Continutul trebuie sa fie veridic si sa nu induca in eroare</li>
                <li>Imaginile trebuie sa reprezinte produsul real</li>
                <li>Nu sunt permise anunturi pentru produse ilegale</li>
                <li>Nu este permis spam-ul sau publicarea repetata a aceluiasi anunt</li>
                <li>Pretul trebuie sa fie real si actualizat</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">5. Continut Interzis</h2>
              <p className="mt-3">
                Este strict interzisa publicarea de anunturi care contin:
              </p>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>Produse contrafacute sau furate</li>
                <li>Arme, droguri sau substante controlate</li>
                <li>Continut pentru adulti sau pornografic</li>
                <li>Materiale care incalca drepturile de autor</li>
                <li>Informatii false sau inselatoare</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">6. Promovarea Anunturilor</h2>
              <p className="mt-3">
                Oferim servicii de promovare platite pentru a creste vizibilitatea anunturilor. 
                Platile sunt procesate prin Stripe si sunt nerambursabile odata ce serviciul a fost activat.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">7. Limitarea Raspunderii</h2>
              <p className="mt-3">
                Vendora nu este responsabil pentru:
              </p>
              <ul className="mt-2 list-disc pl-6 space-y-1">
                <li>Tranzactiile dintre utilizatori</li>
                <li>Calitatea sau conformitatea produselor vandute</li>
                <li>Pierderile rezultate din utilizarea platformei</li>
                <li>Continutul publicat de utilizatori</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">8. Modificari ale Termenilor</h2>
              <p className="mt-3">
                Ne rezervam dreptul de a modifica acesti termeni in orice moment. 
                Modificarile vor fi publicate pe aceasta pagina si vor intra in vigoare imediat dupa publicare.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">9. Contact</h2>
              <p className="mt-3">
                Pentru intrebari despre acesti termeni, ne puteti contacta la:
              </p>
              <p className="mt-2">
                Email: <a href="mailto:contact@vendora.ro" className="text-primary hover:underline">contact@vendora.ro</a>
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
