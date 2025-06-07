// supabase/functions/hello-world/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  // Preveri Authorization header (Bearer <jwt>)
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response("Unauthorized", { status: 401 });
  }
  const jwt = authHeader.replace("Bearer ", "");

  // Dekodiraj JWT (brez preverjanja, za test)
  const payload = JSON.parse(
    atob(jwt.split(".")[1])
  );

  // Vrni user_id iz payloada (Supabase daje 'sub')
  const user_id = payload.sub;

  return new Response(
    JSON.stringify({ message: `Hello, ${user_id}!` }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
});
