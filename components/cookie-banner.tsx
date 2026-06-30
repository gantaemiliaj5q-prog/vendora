'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Cookie, X } from 'lucide-react'

interface CookiePreferences {
  essential: boolean
  analytics: boolean
  marketing: boolean
}

const COOKIE_CONSENT_KEY = 'cookie-consent'

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!consent) {
      setShowBanner(true)
    }
  }, [])

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(prefs))
    setShowBanner(false)
    setShowSettings(false)
  }

  const acceptAll = () => {
    const allAccepted = { essential: true, analytics: true, marketing: true }
    savePreferences(allAccepted)
  }

  const acceptEssential = () => {
    const essentialOnly = { essential: true, analytics: false, marketing: false }
    savePreferences(essentialOnly)
  }

  const saveCustom = () => {
    savePreferences(preferences)
  }

  if (!showBanner) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4">
      <Card className="mx-auto max-w-2xl shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cookie className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Setări Cookie-uri</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={acceptEssential}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Folosim cookie-uri pentru a îmbunătăți experiența ta pe site. Alege ce tipuri
            de cookie-uri dorești să accepți.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showSettings ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <Label className="font-medium">Cookie-uri esențiale</Label>
                  <p className="text-sm text-muted-foreground">
                    Necesare pentru funcționarea site-ului
                  </p>
                </div>
                <Switch checked disabled />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <Label htmlFor="analytics" className="font-medium">
                    Cookie-uri analitice
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Ne ajută să înțelegem cum folosești site-ul
                  </p>
                </div>
                <Switch
                  id="analytics"
                  checked={preferences.analytics}
                  onCheckedChange={(checked) =>
                    setPreferences((p) => ({ ...p, analytics: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <Label htmlFor="marketing" className="font-medium">
                    Cookie-uri de marketing
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Folosite pentru reclame personalizate
                  </p>
                </div>
                <Switch
                  id="marketing"
                  checked={preferences.marketing}
                  onCheckedChange={(checked) =>
                    setPreferences((p) => ({ ...p, marketing: checked }))
                  }
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={saveCustom} className="flex-1">
                  Salvează preferințele
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowSettings(false)}
                  className="flex-1"
                >
                  Înapoi
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button onClick={acceptAll} className="flex-1">
                Acceptă toate
              </Button>
              <Button onClick={acceptEssential} variant="outline" className="flex-1">
                Doar esențiale
              </Button>
              <Button
                onClick={() => setShowSettings(true)}
                variant="ghost"
                className="flex-1"
              >
                Personalizează
              </Button>
            </div>
          )}
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Spre deosebire de aplicațiile mobile care folosesc notificări push pentru
            a te anunța despre oferte și mesaje, site-urile web folosesc cookie-uri
            pentru a-ți personaliza experiența. Poți afla mai multe în{' '}
            <a href="/confidentialitate" className="underline hover:text-foreground">
              Politica de confidențialitate
            </a>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
