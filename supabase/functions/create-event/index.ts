// functions/create-event/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const supabaseClient = (await import('npm:@supabase/supabase-js')).createClient
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!

  const supabase = supabaseClient(supabaseUrl, supabaseKey)

  // Preveri JWT token in pridobi userja
  const authHeader = req.headers.get('authorization') ?? ''
  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error: userError } = await supabase.auth.getUser(token)
  if (userError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }

  // Parse body
  const { title, description, start_time, end_time } = await req.json()
  if (!title || !start_time || !end_time) {
    return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 })
  }

  // Vstavi event v tabelo
  const { data, error } = await supabase.from("events").insert([{
    title, description, start_time, end_time, created_by: user.id
  }]).select().single()

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 })
  }

  return new Response(JSON.stringify({ event: data }), { headers: { "Content-Type": "application/json" } })
})
