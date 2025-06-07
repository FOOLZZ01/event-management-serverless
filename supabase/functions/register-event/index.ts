import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const supabaseClient = (await import('npm:@supabase/supabase-js')).createClient
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!
  const supabase = supabaseClient(supabaseUrl, supabaseKey)

  const authHeader = req.headers.get('authorization') ?? ''
  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error: userError } = await supabase.auth.getUser(token)
  if (userError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
  }

  const { event_id } = await req.json()
  if (!event_id) {
    return new Response(JSON.stringify({ error: "Missing event_id" }), { status: 400 })
  }

  // Vstavi v tabelo registrations
  const { data, error } = await supabase.from("registrations").insert([{
    event_id,
    user_id: user.id
  }]).select().single()

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 })
  }

  return new Response(JSON.stringify({ registration: data }), { headers: { "Content-Type": "application/json" } })
})
