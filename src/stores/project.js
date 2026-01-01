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

  return { currentProject, loading, saveProject, fetchProject };
});