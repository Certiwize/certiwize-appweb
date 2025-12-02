import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '../supabase';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const session = ref(null);
  const router = useRouter();

  const initializeAuth = async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      session.value = data.session;
      user.value = data.session.user;
    }

    supabase.auth.onAuthStateChange((event, _session) => {
      session.value = _session;
      user.value = _session ? _session.user : null;
      
      if (event === 'PASSWORD_RECOVERY') {
        router.push('/update-password');
      }
    });
  };

  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email, password, fullName) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    user.value = null;
    session.value = null;
    router.push('/login');
  };

  const resetPasswordEmail = async (email) => {
    const redirectTo = `${window.location.origin}/update-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    if (error) throw error;
  };

  // Vérifier le mot de passe actuel avant de le changer
  const verifyCurrentPassword = async (email, currentPassword) => {
    const { error } = await supabase.auth.signInWithPassword({ 
      email, 
      password: currentPassword 
    });
    if (error) throw new Error('Mot de passe actuel incorrect');
  };

  const updateUserPassword = async (newPassword) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  };

  const updateProfile = async (fullName) => {
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName }
    });
    if (error) throw error;
    
    // Mettre à jour l'utilisateur local
    if (user.value) {
      user.value.user_metadata.full_name = fullName;
    }
  };

  return { 
    user, 
    session, 
    initializeAuth, 
    signIn, 
    signUp, 
    signOut, 
    resetPasswordEmail, 
    verifyCurrentPassword,
    updateUserPassword,
    updateProfile
  };
});