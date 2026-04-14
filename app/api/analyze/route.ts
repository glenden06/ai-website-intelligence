import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { websiteId, websiteUrl, analysisType, websiteData } = await req.json()

  if (!websiteId || !websiteUrl || !analysisType) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  // Create analysis record with scraped data if available
  const { data: analysis, error } = await supabase
    .from("analyses")
    .insert({
      website_id: websiteId,
      user_id: user.id,
      type: analysisType,
      status: "pending",
      results: websiteData ? { scrapedData: websiteData } : null,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Update website status
  await supabase
    .from("websites")
    .update({ status: "analyzing" })
    .eq("id", websiteId)

  return NextResponse.json({ 
    analysisId: analysis.id,
    hasWebsiteData: !!websiteData 
  })
}
