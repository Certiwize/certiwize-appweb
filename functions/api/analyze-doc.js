export async function onRequestPost({ request, env }) {
    try {
        // 1. Authentification (optionnel, mais recommandé)
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        // 2. Parser le FormData (fichier + docType)
        const formData = await request.formData();
        const file = formData.get('file');
        const docType = formData.get('docType');

        if (!file || !docType) {
            return new Response(JSON.stringify({ error: 'Fichier ou docType manquant' }), { status: 400 });
        }

        // 3. Récupérer le nom du fichier
        const fileName = file.name;

        // 4. Préparer l'envoi vers n8n
        // n8n webhook peut recevoir du multipart/form-data
        // Nous devons recréer un FormData pour l'envoyer à n8n
        const n8nFormData = new FormData();
        n8nFormData.append('file', file);
        n8nFormData.append('docType', docType);
        n8nFormData.append('fileName', fileName);

        // 5. Envoyer à n8n
        // URL du webhook (à définir dans .dev.vars)
        const n8nUrl = env.N8N_HOOK_ANALYZE_DOC;

        if (!n8nUrl) {
            throw new Error('URL n8n non configurée (N8N_HOOK_ANALYZE_DOC)');
        }

        const n8nResponse = await fetch(n8nUrl, {
            method: 'POST',
            body: n8nFormData,
        });

        if (!n8nResponse.ok) {
            const errorText = await n8nResponse.text();
            throw new Error(`Erreur n8n: ${n8nResponse.status} ${errorText}`);
        }

        const result = await n8nResponse.json();

        return new Response(JSON.stringify({ success: true, ...result }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
