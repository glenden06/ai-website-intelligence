import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const { url } = await request.json()
  
  if (!url) {
    return NextResponse.json({ error: "URL requise" }, { status: 400 })
  }

  try {
    // Fetch the website content
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; WebsiteIntelligenceBot/1.0)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
      },
      signal: AbortSignal.timeout(15000),
    })

    if (!response.ok) {
      return NextResponse.json({ 
        error: `Erreur HTTP: ${response.status}`,
        status: response.status 
      }, { status: 400 })
    }

    const html = await response.text()
    
    // Extract useful information from HTML
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    const title = titleMatch ? titleMatch[1].trim() : ""
    
    const metaDescriptionMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)
    const metaDescription = metaDescriptionMatch ? metaDescriptionMatch[1].trim() : ""
    
    const h1Matches = html.match(/<h1[^>]*>([^<]+)<\/h1>/gi) || []
    const h1s = h1Matches.map(h => h.replace(/<[^>]+>/g, "").trim()).slice(0, 5)
    
    const h2Matches = html.match(/<h2[^>]*>([^<]+)<\/h2>/gi) || []
    const h2s = h2Matches.map(h => h.replace(/<[^>]+>/g, "").trim()).slice(0, 10)
    
    // Extract links
    const linkMatches = html.match(/<a[^>]*href=["']([^"']+)["'][^>]*>/gi) || []
    const links = linkMatches.length
    
    // Extract images
    const imgMatches = html.match(/<img[^>]*>/gi) || []
    const imagesWithAlt = imgMatches.filter(img => /alt=["'][^"']+["']/.test(img)).length
    const imagesWithoutAlt = imgMatches.length - imagesWithAlt
    
    // Extract forms
    const formMatches = html.match(/<form[^>]*>/gi) || []
    const forms = formMatches.length
    
    // Check for common elements
    const hasViewport = /<meta[^>]*name=["']viewport["']/i.test(html)
    const hasCanonical = /<link[^>]*rel=["']canonical["']/i.test(html)
    const hasRobots = /<meta[^>]*name=["']robots["']/i.test(html)
    const hasOpenGraph = /<meta[^>]*property=["']og:/i.test(html)
    const hasTwitterCard = /<meta[^>]*name=["']twitter:/i.test(html)
    const hasStructuredData = /<script[^>]*type=["']application\/ld\+json["']/i.test(html)
    
    // Check for performance issues
    const inlineStyles = (html.match(/style=["'][^"']+["']/gi) || []).length
    const inlineScripts = (html.match(/<script[^>]*>[^<]+<\/script>/gi) || []).length
    
    // Extract text content (simplified)
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)
    let textContent = ""
    if (bodyMatch) {
      textContent = bodyMatch[1]
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 5000) // Limit text content
    }

    return NextResponse.json({
      success: true,
      data: {
        url,
        title,
        metaDescription,
        headings: { h1s, h2s },
        links: { total: links },
        images: { total: imgMatches.length, withAlt: imagesWithAlt, withoutAlt: imagesWithoutAlt },
        forms,
        seo: {
          hasViewport,
          hasCanonical,
          hasRobots,
          hasOpenGraph,
          hasTwitterCard,
          hasStructuredData,
        },
        performance: {
          inlineStyles,
          inlineScripts,
          htmlSize: html.length,
        },
        textContent,
      }
    })
  } catch (error) {
    console.error("Scraping error:", error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Erreur lors du scraping" 
    }, { status: 500 })
  }
}
