export async function onRequestPost(context) {
  const { request, env } = context;

  // 1. Sécurité
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  // 2. Données reçues du Frontend
  const body = await request.json();
  const { projectId, docType, data } = body;

  // 3. Routage vers le bon Webhook n8n
  let n8nUrl = '';
  
  switch (docType) {
    case 'etude': // Document 1 (Phase 1)
      n8nUrl = env.N8N_HOOK_PROJ_ETUDE;
      break;
    case 'convention': // Document 2 (Phase 1)
      n8nUrl = env.N8N_HOOK_PROJ_CONVENTION;
      break;
    case 'convocation': // Document 3 (Phase 2)
      n8nUrl = env.N8N_HOOK_PROJ_CONVOCATION;
      break;
    case 'livret': // Document 4 (Phase 2)
      n8nUrl = env.N8N_HOOK_PROJ_LIVRET;
      break;
    default:
      return new Response(JSON.stringify({ error: 'Type de document inconnu' }), { status: 400 });
  }

  if (!n8nUrl) return new Response(JSON.stringify({ error: `Webhook non configuré pour ${docType}` }), { status: 500 });

  try {
    // 4. Appel n8n
    const n8nResp = await fetch(n8nUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: projectId, ...data })
    });

    const result = await n8nResp.json();
    
    // n8n doit renvoyer : { "fileName": "nom_fichier.pdf" }
    return new Response(JSON.stringify(result), { status: 200 });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}