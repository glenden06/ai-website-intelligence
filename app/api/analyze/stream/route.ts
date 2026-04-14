import { streamText } from "ai"
import { createClient } from "@/lib/supabase/server"

const analysisPrompts: Record<string, string> = {
  ux: `Tu es un expert UX/UI senior spécialisé dans l'analyse de sites web. Analyse les données du site web fourni et génère un rapport détaillé en français.

Structure ton analyse avec ces sections (utilise le format Markdown):

## Score Global UX
Donne un score de 0 à 100 et justifie-le brièvement.

## Points Forts
Liste les aspects positifs de l'UX (navigation, lisibilité, structure, etc.)

## Points à Améliorer
- Identifie les problèmes de navigation
- Analyse la hiérarchie de l'information (titres H1, H2)
- Évalue l'accessibilité des formulaires
- Vérifie la cohérence du design

## Recommandations Prioritaires
Liste 5 actions concrètes à mettre en place, classées par impact.

## Analyse du Parcours Utilisateur
Décris le parcours type d'un visiteur et identifie les points de friction potentiels.

Sois précis, actionnable et base ton analyse sur les données fournies.`,

  bugs: `Tu es un expert en qualité web et détection de bugs. Analyse les données du site web fourni et génère un rapport détaillé en français.

Structure ton analyse avec ces sections (utilise le format Markdown):

## Score de Santé Technique
Donne un score de 0 à 100 basé sur les problèmes détectés.

## Erreurs Critiques
Liste les problèmes majeurs qui impactent le fonctionnement du site.

## Problèmes SEO
- Balises meta manquantes ou incorrectes
- Problèmes de structure des titres
- Images sans attribut alt
- Absence de données structurées

## Problèmes de Performance
- Taille du HTML
- Scripts inline
- Styles inline

## Problèmes d'Accessibilité
- Images sans texte alternatif
- Formulaires mal structurés
- Navigation clavier

## Plan d'Action
Liste les corrections à apporter par ordre de priorité (critique > important > mineur).

Sois technique et précis dans tes recommandations.`,

  competitive: `Tu es un analyste stratégique spécialisé dans l'analyse concurrentielle de sites web. Analyse les données du site web fourni et génère un rapport détaillé en français.

Structure ton analyse avec ces sections (utilise le format Markdown):

## Positionnement
Analyse le positionnement apparent du site basé sur son contenu et sa structure.

## Points Différenciants
Identifie ce qui pourrait distinguer ce site de ses concurrents.

## Benchmark SEO
- Qualité des balises meta
- Présence sur les réseaux sociaux (Open Graph, Twitter Cards)
- Données structurées

## Opportunités de Marché
Suggère des améliorations pour se démarquer de la concurrence.

## Analyse du Message
Évalue la clarté et l'efficacité du message principal (basé sur les titres et le contenu).

## Recommandations Stratégiques
5 actions pour améliorer le positionnement concurrentiel.`,

  full: `Tu es un consultant digital senior. Réalise une analyse complète du site web fourni en français.

Structure ton analyse avec ces sections (utilise le format Markdown):

## Résumé Exécutif
Score global et principales conclusions (2-3 phrases).

## Analyse UX
- Score UX: /100
- Navigation et structure
- Expérience utilisateur globale

## Analyse Technique
- Score Technique: /100
- SEO on-page
- Performance
- Accessibilité

## Analyse Stratégique
- Positionnement
- Message et proposition de valeur

## Top 10 Recommandations
Liste les 10 actions prioritaires avec leur impact estimé (fort/moyen/faible).

## Conclusion
Synthèse et prochaines étapes recommandées.`
}

export async function POST(request: Request) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return new Response("Non autorisé", { status: 401 })
  }

  const { websiteId, analysisId, type, websiteData } = await request.json()

  if (!websiteId || !analysisId || !type) {
    return new Response("Paramètres manquants", { status: 400 })
  }

  // Get website info
  const { data: website } = await supabase
    .from("websites")
    .select("*")
    .eq("id", websiteId)
    .single()

  if (!website) {
    return new Response("Site non trouvé", { status: 404 })
  }

  // Update analysis status to running
  await supabase
    .from("analyses")
    .update({ status: "running" })
    .eq("id", analysisId)

  const systemPrompt = analysisPrompts[type] || analysisPrompts.full

  // Build context from scraped data
  let contextInfo = `
URL du site: ${website.url}
Nom du site: ${website.name}
`

  if (websiteData) {
    contextInfo += `
Titre de la page: ${websiteData.title || "Non défini"}
Meta description: ${websiteData.metaDescription || "Non définie"}

Titres H1: ${websiteData.headings?.h1s?.join(", ") || "Aucun"}
Titres H2: ${websiteData.headings?.h2s?.join(", ") || "Aucun"}

Statistiques:
- Nombre de liens: ${websiteData.links?.total || 0}
- Images totales: ${websiteData.images?.total || 0}
- Images avec alt: ${websiteData.images?.withAlt || 0}
- Images sans alt: ${websiteData.images?.withoutAlt || 0}
- Formulaires: ${websiteData.forms || 0}

SEO:
- Viewport meta: ${websiteData.seo?.hasViewport ? "Oui" : "Non"}
- Canonical: ${websiteData.seo?.hasCanonical ? "Oui" : "Non"}
- Robots meta: ${websiteData.seo?.hasRobots ? "Oui" : "Non"}
- Open Graph: ${websiteData.seo?.hasOpenGraph ? "Oui" : "Non"}
- Twitter Cards: ${websiteData.seo?.hasTwitterCard ? "Oui" : "Non"}
- Données structurées: ${websiteData.seo?.hasStructuredData ? "Oui" : "Non"}

Performance:
- Taille HTML: ${websiteData.performance?.htmlSize ? Math.round(websiteData.performance.htmlSize / 1024) + " Ko" : "Inconnue"}
- Styles inline: ${websiteData.performance?.inlineStyles || 0}
- Scripts inline: ${websiteData.performance?.inlineScripts || 0}

Extrait du contenu:
${websiteData.textContent?.slice(0, 2000) || "Contenu non disponible"}
`
  }

  try {
    const result = streamText({
      model: "openai/gpt-4o-mini",
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Analyse ce site web:\n${contextInfo}`
        }
      ],
      onFinish: async ({ text }) => {
        // Extract score from the response
        const scoreMatch = text.match(/(\d{1,3})\s*[\/sur]*\s*100/i)
        const score = scoreMatch ? Math.min(100, parseInt(scoreMatch[1])) : null

        // Update analysis with results
        await supabase
          .from("analyses")
          .update({
            status: "completed",
            results: { 
              markdown: text,
              score,
              type,
              analyzedAt: new Date().toISOString()
            },
            score,
            completed_at: new Date().toISOString()
          })
          .eq("id", analysisId)

        // Update website last_analyzed_at
        await supabase
          .from("websites")
          .update({ 
            last_analyzed_at: new Date().toISOString(),
            status: "completed"
          })
          .eq("id", websiteId)

        // Create alert if score is low
        if (score && score < 50) {
          await supabase
            .from("alerts")
            .insert({
              user_id: user.id,
              website_id: websiteId,
              analysis_id: analysisId,
              type: type === "bugs" ? "bug" : type === "ux" ? "ux" : "info",
              severity: score < 30 ? "critical" : "high",
              title: `Score faible détecté: ${score}/100`,
              message: `L'analyse ${type} de ${website.name} a révélé un score de ${score}/100. Des améliorations sont nécessaires.`
            })
        }
      }
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("Analysis error:", error)
    
    // Update analysis status to error
    await supabase
      .from("analyses")
      .update({ status: "error" })
      .eq("id", analysisId)

    return new Response("Erreur lors de l'analyse", { status: 500 })
  }
}
