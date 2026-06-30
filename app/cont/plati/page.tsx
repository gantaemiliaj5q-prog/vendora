import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CreditCard, ArrowLeft, Receipt } from 'lucide-react'
import { format } from 'date-fns'
import { ro } from 'date-fns/locale'
import Link from 'next/link'

export const metadata = {
  title: 'Istoric plăți',
}

export default async function PaymentsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?redirect=/cont/plati')
  }

  const { data: payments } = await supabase
    .from('payments')
    .select('*, listing:listings(id, title), package:promotion_packages(name)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const formatAmount = (cents: number, currency: string) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(cents / 100)
  }

  const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    pending: { label: 'În așteptare', variant: 'secondary' },
    completed: { label: 'Finalizat', variant: 'default' },
    failed: { label: 'Eșuat', variant: 'destructive' },
    refunded: { label: 'Rambursat', variant: 'outline' },
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <Button variant="ghost" className="mb-6" asChild>
            <Link href="/cont">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Înapoi la cont
            </Link>
          </Button>

          <div className="mb-8">
            <h1 className="text-2xl font-bold sm:text-3xl">Istoric plăți</h1>
            <p className="mt-1 text-muted-foreground">
              Toate tranzacțiile tale pentru promovarea anunțurilor
            </p>
          </div>

          {payments && payments.length > 0 ? (
            <div className="space-y-4">
              {payments.map((payment) => (
                <Card key={payment.id}>
                  <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Receipt className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {payment.package?.name || 'Promovare anunț'}
                        </p>
                        {payment.listing && (
                          <Link 
                            href={`/anunturi/${payment.listing.id}`}
                            className="text-sm text-muted-foreground hover:text-foreground"
                          >
                            {payment.listing.title}
                          </Link>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(payment.created_at), 'd MMMM yyyy, HH:mm', { locale: ro })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 sm:text-right">
                      <div>
                        <p className="font-bold">
                          {formatAmount(payment.amount_cents, payment.currency)}
                        </p>
                        <Badge variant={statusLabels[payment.status]?.variant || 'secondary'}>
                          {statusLabels[payment.status]?.label || payment.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <CreditCard className="h-12 w-12 text-muted-foreground" />
                <h2 className="mt-4 text-lg font-semibold">Nicio plată</h2>
                <p className="mt-2 text-muted-foreground">
                  Nu ai efectuat încă nicio plată pentru promovarea anunțurilor
                </p>
                <Button className="mt-4" asChild>
                  <Link href="/promovare">Promovează un anunț</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
