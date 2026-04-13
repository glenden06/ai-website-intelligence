import { streamText, convertToModelMessages } from "ai"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { analysisId, websiteUrl, analysisType, messages } = await req.json()

  const systemPrompt = getSystemPrompt(analysisType, websiteUrl)

  const result = streamText({
    model: "openai/gpt-4o-mini",
    system: systemPrompt,
    messages: messages ? await convertToModelMessages(messages) : [
      { role: "user", content: `Please analyze the website: ${websiteUrl}` }
    ],
  })

  return result.toUIMessageStreamResponse()
}

function getSystemPrompt(analysisType: string, websiteUrl: string): string {
  const baseContext = `You are an expert website analyst AI assistant. You are analyzing the website: ${websiteUrl}.

IMPORTANT: Since you cannot actually crawl websites, provide realistic mock analysis data based on common patterns for similar websites. Be specific and actionable in your recommendations.

Format your response with clear sections using markdown headers.`

  switch (analysisType) {
    case "ux":
      return `${baseContext}

You specialize in UX (User Experience) analysis. Analyze and provide insights on:
1. **Navigation & Information Architecture** - How easy is it to find information?
2. **User Journey Mapping** - Common paths users might take
3. **Conversion Funnel Analysis** - Potential friction points
4. **Mobile Responsiveness** - Mobile user experience considerations
5. **Accessibility** - WCAG compliance considerations
6. **Call-to-Action Effectiveness** - CTA placement and clarity

Provide a UX score out of 100 and prioritized recommendations.`

    case "bugs":
      return `${baseContext}

You specialize in technical bug detection. Analyze and provide insights on:
1. **Broken Links** - Potential 404 errors and dead links
2. **Performance Issues** - Loading time concerns, large assets
3. **SEO Problems** - Missing meta tags, heading structure issues
4. **Security Concerns** - HTTPS, mixed content, vulnerable patterns
5. **Browser Compatibility** - Cross-browser issues
6. **Console Errors** - Common JavaScript errors

Provide a technical health score out of 100 and prioritized fixes.`

    case "competitive":
      return `${baseContext}

You specialize in competitive analysis. Analyze and provide insights on:
1. **Market Positioning** - How the site positions itself
2. **Unique Value Proposition** - What sets it apart
3. **Pricing Strategy** - If applicable, pricing competitiveness
4. **Feature Comparison** - Key features vs typical competitors
5. **Content Strategy** - Content quality and messaging
6. **Brand Perception** - Visual identity and trust signals

Provide competitive strength score out of 100 and strategic recommendations.`

    case "full":
      return `${baseContext}

Provide a comprehensive analysis covering:
1. **UX Analysis** - User experience and navigation
2. **Technical Health** - Bugs, performance, security
3. **Competitive Position** - Market standing and differentiation
4. **SEO Assessment** - Search engine optimization
5. **Conversion Optimization** - Improving business outcomes
6. **AI Recommendations** - Top 5 prioritized actions

Provide an overall website score out of 100 and a detailed action plan.`

    default:
      return baseContext
  }
}
