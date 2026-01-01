export async function onRequestPost(context) {
  const { request, env } = context;

  // 1. Auth check
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  // 2. Data
  const body = await request.json();
  const { trainingId, data } = body;

  // 3. Webhook n8n (à configurer dans Cloudflare ENV)
  const n8nUrl = env.N8N_HOOK_GENERATE_TRAINING; 

  if (!n8nUrl) return new Response(JSON.stringify({ error: 'Webhook URL missing' }), { status: 500 });

  try {
    // Appel n8n
    const n8nResp = await fetch(n8nUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: trainingId,
        ...data // Envoie tous les champs {titre}, {maj}, etc.
      })
    });

    const result = await n8nResp.json();
    
    // n8n doit renvoyer : { "pdfUrl": "https://supabase..../fichier.pdf" }
    return new Response(JSON.stringify(result), { status: 200 });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}