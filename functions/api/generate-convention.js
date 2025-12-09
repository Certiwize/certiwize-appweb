export async function onRequestPost(context) {
  const { request, env } = context;

  // 1. Vérification du token d'authentification
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Non autorisé : Token manquant' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 2. Récupération des données
  let payload;
  try {
    payload = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: 'JSON invalide' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 3. Validation des données requises
  const requiredFields = [
    'trainingName', 'companyName', 'companyAddress', 'siret', 
    'managerName', 'trainingType', 'duration', 'period', 
    'nbDays', 'date', 'rate', 'fees', 'total'
  ];

  for (const field of requiredFields) {
    if (!payload[field]) {
      return new Response(
        JSON.stringify({ error: `Champ manquant : ${field}` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // 4. Vérifier que le SIRET a 14 chiffres
  if (payload.siret.length !== 14 || isNaN(payload.siret)) {
    return new Response(
      JSON.stringify({ error: 'SIRET invalide : doit contenir 14 chiffres' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 5. Appel au webhook n8n pour générer le PDF
  const n8nWebhookUrl = env.N8N_HOOK_CONVENTION;

  if (!n8nWebhookUrl) {
    return new Response(
      JSON.stringify({ error: 'Configuration manquante pour la génération de convention' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Source': 'Certiwize-App'
      },
      body: JSON.stringify({
        ...payload,
        userToken: authHeader
      })
    });

    if (!n8nResponse.ok) {
      throw new Error(`Erreur n8n: ${n8nResponse.statusText}`);
    }

    const result = await n8nResponse.json();

    // n8n doit retourner { "pdfUrl": "https://..." }
    if (!result.pdfUrl) {
      throw new Error('n8n n\'a pas retourné l\'URL du PDF');
    }

    return new Response(JSON.stringify({ 
      success: true, 
      pdfUrl: result.pdfUrl,
      message: 'Convention générée avec succès'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error('Erreur lors de la génération:', err);
    return new Response(JSON.stringify({ 
      error: 'Erreur lors de la génération du document',
      details: err.message 
    }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}