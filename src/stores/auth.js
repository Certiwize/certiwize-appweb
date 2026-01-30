import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '../supabase';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const session = ref(null);
  const initialized = ref(false);
  const userRole = ref('user'); // 'admin' ou 'user'
  const router = useRouter();

  // Computed pour vérifier si l'utilisateur est admin
  const isAdmin = computed(() => userRole.value === 'admin');

  // Charger le rôle depuis la table profiles
  const fetchUserRole = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('[AuthStore] Error fetching user role:', error);
        userRole.value = 'user';
      } else {
        userRole.value = data.role || 'user';
      }
    } catch (err) {
      console.error('[AuthStore] Exception fetching user role:', err);
      userRole.value = 'user';
    }
  };

  const initializeAuth = async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      session.value = data.session;
      user.value = data.session.user;
      await fetchUserRole(data.session.user.id);
    }
    initialized.value = true;

    supabase.auth.onAuthStateChange(async (event, _session) => {
      session.value = _session;
      user.value = _session ? _session.user : null;

      if (_session?.user) {
        await fetchUserRole(_session.user.id);
      } else {
        userRole.value = 'user';
      }

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
    initialized,
    userRole,
    isAdmin,
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