import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Eroare de autentificare</CardTitle>
            <CardDescription>
              A apărut o problemă în procesul de autentificare
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">
              Te rugăm să încerci din nou. Dacă problema persistă, contactează
              echipa de suport.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <Button asChild>
                <Link href="/auth/login">Încearcă din nou</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">Înapoi acasă</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
