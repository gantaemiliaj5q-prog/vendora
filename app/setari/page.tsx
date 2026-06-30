'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Save } from 'lucide-react'

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState({
    siteName: 'AnunțuriRO',
    siteDescription: 'Platformă modernă de anunțuri de vânzare-cumpărare',
    contactEmail: 'contact@anunturi.ro',
    supportPhone: '+40 123 456 789',
    requireApproval: true,
    allowGuestMessages: false,
    maxImagesPerListing: 10,
    maxListingsPerUser: 50,
    featuredDuration: 7,
  })

  async function handleSave() {
    setIsLoading(true)
    
    // Simulate saving
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.success('Setările au fost salvate')
    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Setări</h1>
        <p className="text-muted-foreground">
          Configurează setările generale ale platformei
        </p>
      </div>

      <div className="grid gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Setări generale</CardTitle>
            <CardDescription>
              Informații de bază despre platformă
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="siteName">Numele site-ului</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email de contact</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Descrierea site-ului</Label>
              <Input
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supportPhone">Telefon suport</Label>
              <Input
                id="supportPhone"
                value={settings.supportPhone}
                onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Listings Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Setări anunțuri</CardTitle>
            <CardDescription>
              Configurează regulile pentru anunțuri
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Aprobare manuală</Label>
                <p className="text-sm text-muted-foreground">
                  Anunțurile noi necesită aprobare de la admin înainte de publicare
                </p>
              </div>
              <Switch
                checked={settings.requireApproval}
                onCheckedChange={(checked) => setSettings({ ...settings, requireApproval: checked })}
              />
            </div>
            
            <Separator />
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="maxImages">Imagini maxime per anunț</Label>
                <Input
                  id="maxImages"
                  type="number"
                  min="1"
                  max="20"
                  value={settings.maxImagesPerListing}
                  onChange={(e) => setSettings({ ...settings, maxImagesPerListing: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxListings">Anunțuri maxime per utilizator</Label>
                <Input
                  id="maxListings"
                  type="number"
                  min="1"
                  value={settings.maxListingsPerUser}
                  onChange={(e) => setSettings({ ...settings, maxListingsPerUser: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messaging Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Setări mesagerie</CardTitle>
            <CardDescription>
              Configurează sistemul de mesaje
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Permite mesaje de la vizitatori</Label>
                <p className="text-sm text-muted-foreground">
                  Utilizatorii neautentificați pot trimite mesaje
                </p>
              </div>
              <Switch
                checked={settings.allowGuestMessages}
                onCheckedChange={(checked) => setSettings({ ...settings, allowGuestMessages: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Promotion Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Setări promovare</CardTitle>
            <CardDescription>
              Configurează pachetele de promovare
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="featuredDuration">Durata standard promovare (zile)</Label>
              <Input
                id="featuredDuration"
                type="number"
                min="1"
                value={settings.featuredDuration}
                onChange={(e) => setSettings({ ...settings, featuredDuration: parseInt(e.target.value) })}
              />
              <p className="text-sm text-muted-foreground">
                Durata implicită pentru pachete de promovare
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isLoading} size="lg">
            {isLoading ? (
              'Se salvează...'
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvează setările
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
