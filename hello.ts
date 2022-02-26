import { serve } from "https://deno.land/std@0.114.0/http/server.ts";

function handler(_req: Request): Response {
  return new Response("continue-jump を deno で構築中！");
}

console.log("Listening on http://localhost:8000");
serve(handler);

