import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Globe, Plus } from "lucide-react"
import Link from "next/link"
import { DeleteWebsiteButton } from "@/components/dashboard/delete-website-button"

export default async function WebsitesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: websites } = await supabase
    .from("websites")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })

  const statusLabels: Record<string, string> = {
    completed: "Termine",
    analyzing: "En cours",
    error: "Erreur",
    pending: "En attente",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sites web</h1>
          <p className="text-muted-foreground">Gerez tous vos sites surveilles</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/websites/new">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un site
          </Link>
        </Button>
      </div>

      {!websites || websites.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Globe className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="mb-2 text-lg font-semibold">Aucun site web</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Ajoutez votre premier site pour commencer a obtenir des insights IA.
            </p>
            <Button asChild>
              <Link href="/dashboard/websites/new">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter votre premier site
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {websites.map((website) => (
            <Card key={website.id} className="group relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Globe className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{website.name}</CardTitle>
                      <CardDescription className="truncate max-w-[200px]">
                        {website.url}
                      </CardDescription>
                    </div>
                  </div>
                  <DeleteWebsiteButton websiteId={website.id} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      website.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : website.status === "analyzing"
                          ? "bg-blue-100 text-blue-700"
                          : website.status === "error"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {statusLabels[website.status] || website.status}
                  </span>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/websites/${website.id}`}>
                      Voir les details
                    </Link>
                  </Button>
                </div>
                {website.last_analyzed_at && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    Derniere analyse : {new Date(website.last_analyzed_at).toLocaleDateString("fr-FR")}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
