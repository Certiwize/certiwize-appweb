<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Message from 'primevue/message';

const auth = useAuthStore();
const router = useRouter();
const password = ref('');
const loading = ref(false);
const msg = ref('');

const handleUpdate = async () => {
  loading.value = true;
  try {
    await auth.updateUserPassword(password.value);
    alert('Mot de passe mis à jour !');
    router.push('/dashboard');
  } catch (error) {
    msg.value = "Erreur: " + error.message;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div class="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
      <h1 class="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">Nouveau mot de passe</h1>
      <form @submit.prevent="handleUpdate" class="space-y-4">
        <div class="flex flex-col gap-2">
          <label class="text-gray-700 dark:text-gray-300">Entrez votre nouveau mot de passe</label>
          <Password v-model="password" toggleMask class="w-full" inputClass="w-full" required />
        </div>
        <Message v-if="msg" severity="error" :closable="false">{{ msg }}</Message>
        <Button type="submit" label="Confirmer" :loading="loading" class="w-full" />
      </form>
    </div>
  </div>
</template>