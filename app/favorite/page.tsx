"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ListingCard } from "@/components/listing-card"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import Link from "next/link"

//export const metadata = {
//  title: "Favorite",


export default function FavoritesPage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [listings, setListings] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchFavorites = async () => {
      const supabase = await createClient()
      // Fetch user session
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.replace('/auth/login?redirect=/favorite')
        return
      }

      setUser(user)

      // Fetch the user's favorites and populate related listing
      const { data: favorites, error } = await supabase
        .from("favorites")
        .select("*, listing:listings(*, category:categories(*))")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (!error && favorites) {
        const realListings =
          favorites
            ?.map((f) => f.listing)
            .filter((l) => !!l) || []
        setListings(realListings)
      } else {
        setListings([])
      }
      setLoading(false)
    }

    fetchFavorites()
    // Only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold sm:text-3xl">Anunțuri favorite</h1>
            <p className="mt-1 text-muted-foreground">
              Anunțurile pe care le-ai salvat pentru mai târziu
            </p>
          </div>

          {loading ? (
            <div className="rounded-lg border border-dashed border-border bg-muted/50 p-12 text-center">
              <span className="text-muted-foreground">Se încarcă favoritele...</span>
            </div>
          ) : listings && listings.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {listings.map((listing: any) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border bg-muted/50 p-12 text-center">
              <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
              <h2 className="mt-4 text-lg font-semibold">Nu ai niciun anunț salvat la favorite</h2>
              <p className="mt-2 text-muted-foreground">
                Salvează anunțurile care te interesează pentru a le găsi mai ușor
              </p>
              <Button className="mt-4" asChild>
                <Link href="/anunturi">Explorează anunțuri</Link>
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
