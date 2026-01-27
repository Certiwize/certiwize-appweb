import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '../supabase';
import { useAuthStore } from './auth';

export const useCompanyStore = defineStore('company', () => {
  const company = ref(null);
  const loading = ref(false);
  const auth = useAuthStore();

  // Initialiser les données (récupérer ou créer une entrée vide)
  const fetchCompany = async () => {
    loading.value = true;
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', auth.user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // Ignorer erreur "Introuvable"

      if (data) {
        company.value = data;
      } else {
        // Initialisation locale vide si pas encore en base
        company.value = {
          user_id: auth.user.id,
          taxes_config: { vat_subject: true, tax_2: false, tax_3: false, fiscal_stamp: false },
          socials: {},
          opening_hours: {
            lundi: '', mardi: '', mercredi: '', jeudi: '', vendredi: '', samedi: '', dimanche: ''
          },
          accountant_info: {}
        };
      }
    } catch (err) {
      console.error('Erreur chargement société:', err);
    } finally {
      loading.value = false;
    }
  };

  const saveCompany = async (formValues) => {
    loading.value = true;
    console.log('💾 Start saving company...', formValues);
    try {
      // Préparation des données JSONB (fusionner pour ne pas perdre l'existant si partiel)
      const payload = {
        ...formValues,
        user_id: auth.user?.id, // Use optional chaining to avoid crash
        updated_at: new Date()
      };

      if (!payload.user_id) {
        throw new Error("User ID is missing. Are you logged in?");
      }

      console.log('📦 Payload:', payload);

      const { data, error } = await supabase
        .from('companies')
        .upsert(payload, { onConflict: 'user_id' })
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase Error:', error);
        throw error;
      }

      console.log('✅ Saved successfully:', data);
      company.value = data;
      return { success: true };
    } catch (err) {
      console.error('❌ Save Exception:', err);
      return { success: false, error: err.message || 'Unknown error' };
    } finally {
      loading.value = false;
    }
  };

  return { company, loading, fetchCompany, saveCompany };
});