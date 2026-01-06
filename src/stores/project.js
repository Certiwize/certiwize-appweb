import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '../supabase';
import { useAuthStore } from './auth';

export const useProjectStore = defineStore('project', () => {
    const currentProject = ref(null);
    const loading = ref(false);
    const auth = useAuthStore();

    // Créer ou Mettre à jour (Sauvegarde Brouillon)
    const saveProject = async (projectData, step = 1) => {
        loading.value = true;
        try {
            const user = auth.user;

            const payload = {
                user_id: user.id,
                name: projectData.name || 'Nouveau Projet',
                step_progress: step,
                form_data: projectData.form_data, // Le JSON avec vos balises
                updated_at: new Date()
            };

            let query = supabase.from('projects');

            if (projectData.id) {
                // Mise à jour
                const { data, error } = await query
                    .update(payload)
                    .eq('id', projectData.id)
                    .select()
                    .single();
                if (error) throw error;
                currentProject.value = data;
            } else {
                // Création
                const { data, error } = await query
                    .insert([payload])
                    .select()
                    .single();
                if (error) throw error;
                currentProject.value = data;
            }

            return { success: true, id: currentProject.value.id };
        } catch (err) {
            console.error('Erreur sauvegarde projet:', err);
            return { success: false, error: err.message };
        } finally {
            loading.value = false;
        }
    };

    // Récupérer un projet par ID
    const fetchProject = async (id) => {
        loading.value = true;
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            currentProject.value = data;
        } catch (err) {
            console.error(err);
        } finally {
            loading.value = false;
        }
    };

    // Générer un document du projet
    const generateDoc = async (docType, formData) => {
        if (!currentProject.value?.id) return { success: false, error: "Sauvegardez d'abord le projet" };

        loading.value = true;
        try {
            // 1. Appel API Cloudflare -> n8n
            const response = await fetch('/api/generate-project-doc', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.session?.access_token}`
                },
                body: JSON.stringify({
                    projectId: currentProject.value.id,
                    docType: docType,
                    data: formData
                })
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || "Erreur génération");

            // 2. Récupérer l'URL publique via Supabase Storage
            const { data: urlData } = supabase.storage
                .from('project-docs')
                .getPublicUrl(result.fileName);

            // 3. Mettre à jour la base de données (colonne documents)
            const newDocs = {
                ...currentProject.value.documents,
                [docType]: urlData.publicUrl
            };

            const { error: updateError } = await supabase
                .from('projects')
                .update({ documents: newDocs })
                .eq('id', currentProject.value.id);

            if (updateError) throw updateError;

            // Mise à jour locale
            currentProject.value.documents = newDocs;

            return { success: true, url: urlData.publicUrl };

        } catch (err) {
            console.error(err);
            return { success: false, error: err.message };
        } finally {
            loading.value = false;
        }
    };

    // Changer le statut du projet
    const updateStatus = async (newStatus) => {
        try {
            await supabase.from('projects').update({ status: newStatus }).eq('id', currentProject.value.id);
            currentProject.value.status = newStatus;
        } catch (e) {
            console.error(e);
        }
    };

    return { currentProject, loading, saveProject, fetchProject, generateDoc, updateStatus };
});