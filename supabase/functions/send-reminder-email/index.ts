import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

interface EmailRequest {
  to: string
  subject: string
  text: string
  html?: string
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ ok: false, error: "Method not allowed" }),
      { 
        status: 405, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    )
  }

  try {
    // Get SMTP credentials from Supabase Secrets
    const SMTP_HOST = Deno.env.get("SMTP_HOST")
    const SMTP_PORT = parseInt(Deno.env.get("SMTP_PORT") || "587")
    const SMTP_USER = Deno.env.get("SMTP_USER")
    const SMTP_PASS = Deno.env.get("SMTP_PASS")
    const SMTP_FROM = Deno.env.get("SMTP_FROM")

    // Validate environment variables
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
      console.error("Missing SMTP configuration in Supabase Secrets")
      return new Response(
        JSON.stringify({ 
          ok: false, 
          error: "Server configuration error: SMTP not configured" 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      )
    }

    // Parse and validate request body
    const body: EmailRequest = await req.json()
    
    if (!body.to || !body.subject || !body.text) {
      return new Response(
        JSON.stringify({ 
          ok: false, 
          error: "Missing required fields: to, subject, text" 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.to)) {
      return new Response(
        JSON.stringify({ 
          ok: false, 
          error: "Invalid email address format" 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      )
    }

    // Initialize SMTP client
    const client = new SMTPClient({
      connection: {
        hostname: SMTP_HOST,
        port: SMTP_PORT,
        tls: true,
        auth: {
          username: SMTP_USER,
          password: SMTP_PASS,
        },
      },
    })

    // Send email
    await client.send({
      from: SMTP_FROM,
      to: body.to,
      subject: body.subject,
      content: body.text,
      html: body.html,
    })

    await client.close()

    console.log(`✅ Email sent successfully to ${body.to}`)

    return new Response(
      JSON.stringify({ ok: true }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    )

  } catch (error) {
    console.error("❌ Error sending email:", error)
    
    return new Response(
      JSON.stringify({ 
        ok: false, 
        error: error instanceof Error ? error.message : "Failed to send email" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    )
  }
})
