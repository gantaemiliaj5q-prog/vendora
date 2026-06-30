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
    siteName: 'Vendora',
    siteDescription: 'Platformă modernă și rapidă de anunțuri de vânzare-cumpărare',
    contactEmail: 'admin@vendora.ro',
    supportPhone: '+40 722 000 111',
    requireApproval: true,
    allowGuestMessages: false,
    maxImagesPerListing: 5,
    maxListingsPerUser: 20,
    featuredDuration: 14,
  })

  async function handleSave() {
    setIsLoading(true)
    
    // Simulare asincronă de salvare persistentă în baza de date locală/config
    await new Promise(resolve => setTimeout(resolve, 800))
    
    toast.success('Setările globale ale platformei au fost salvate cu succes!')
    setIsLoading(false)
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Configurare Platformă</h1>
        <p className="text-muted-foreground">
          Modifică parametrii globali de securitate, listare și mesagerie pentru sistemul Vendora.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Setări Generale */}
        <Card>
          <CardHeader>
            <CardTitle>Informații Identitate</CardTitle>
            <CardDescription>
              Elementele de branding și datele de contact oficiale ale marketplace-ului.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="siteName">Numele aplicației</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email administrativ</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Slogan / Descriere SEO</Label>
              <Input
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supportPhone">Telefon Suport Tehnic</Label>
              <Input
                id="supportPhone"
                value={settings.supportPhone}
                onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Setări Politici Anunțuri */}
        <Card>
          <CardHeader>
            <CardTitle>Reguli și Politici de Listare</CardTitle>
            <CardDescription>
              Setați limitele de încărcare și cerințele de securitate pentru moderare.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Aprobare manuală obligatorie</Label>
                <p className="text-sm text-muted-foreground">
                  Anunțurile noi intră în starea „În așteptare” și necesită verificarea unui administrator înainte de a deveni publice.
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
                <Label htmlFor="maxImages">Limită fotografii per anunț</Label>
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
                <Label htmlFor="maxListings">Limită anunțuri per utilizator</Label>
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

        {/* Setări Promovare */}
        <Card>
          <CardHeader>
            <CardTitle>Sistem de Promovare Anunțuri</CardTitle>
            <CardDescription>
              Configurează parametrii pentru evidențierea ofertelor premium.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="featuredDuration">Valabilitate pachet promovat (zile)</Label>
              <Input
                id="featuredDuration"
                type="number"
                min="1"
                value={settings.featuredDuration}
                onChange={(e) => setSettings({ ...settings, featuredDuration: parseInt(e.target.value) })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Buton Salvare */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isLoading} size="lg" className="px-8">
            {isLoading ? (
              'Se salvează modificările...'
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvează setările globale
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}