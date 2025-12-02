import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '../supabase';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const session = ref(null);
  const router = useRouter();

  // Initialiser la session au chargement de l'app
  const initializeAuth = async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      session.value = data.session;
      user.value = data.session.user;
    }

    // Écouter les changements d'état (connexion, déconnexion, refresh token)
    supabase.auth.onAuthStateChange((_event, _session) => {
      session.value = _session;
      user.value = _session ? _session.user : null;
    });
  };

  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    user.value = null;
    session.value = null;
    // Redirection forcée vers la home ou login
    // Note: router.push doit être géré dans le composant ou ici si le router est injecté correctement
  };

  return { user, session, initializeAuth, signIn, signOut };
});