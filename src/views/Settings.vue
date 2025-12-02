<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Message from 'primevue/message';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';

const authStore = useAuthStore();
const router = useRouter();

// Onglet Profil
const fullName = ref(authStore.user?.user_metadata?.full_name || '');
const email = ref(authStore.user?.email || '');
const loadingProfile = ref(false);
const profileMsg = ref({ type: '', content: '' });

const updateProfile = async () => {
  loadingProfile.value = true;
  profileMsg.value = { type: '', content: '' };
  
  try {
    await authStore.updateProfile(fullName.value);
    profileMsg.value = { type: 'success', content: 'Profil mis à jour avec succès !' };
  } catch (error) {
    profileMsg.value = { type: 'error', content: error.message };
  } finally {
    loadingProfile.value = false;
  }
};

// Onglet Mot de passe
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const loadingPassword = ref(false);
const passwordMsg = ref({ type: '', content: '' });

const updatePassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    passwordMsg.value = { type: 'error', content: 'Les mots de passe ne correspondent pas.' };
    return;
  }

  if (!currentPassword.value) {
    passwordMsg.value = { type: 'error', content: 'Veuillez entrer votre mot de passe actuel.' };
    return;
  }

  loadingPassword.value = true;
  passwordMsg.value = { type: '', content: '' };
  
  try {
    // D'abord vérifier que le mot de passe actuel est correct en essayant de se reconnecter
    await authStore.verifyCurrentPassword(email.value, currentPassword.value);
    
    // Si la vérification réussit, mettre à jour le mot de passe
    await authStore.updateUserPassword(newPassword.value);
    
    passwordMsg.value = { type: 'success', content: 'Mot de passe mis à jour avec succès !' };
    currentPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
  } catch (error) {
    passwordMsg.value = { type: 'error', content: error.message || 'Mot de passe actuel incorrect.' };
  } finally {
    loadingPassword.value = false;
  }
};

const deleteAccount = async () => {
  if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
    try {
      // TODO: Implémenter la suppression de compte
      alert('Fonctionnalité de suppression de compte à venir');
    } catch (error) {
      alert('Erreur lors de la suppression du compte');
    }
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Paramètres</h1>
        <p class="text-gray-600 dark:text-gray-400">Gérez votre profil et vos préférences</p>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <Tabs value="0">
          <TabList>
            <Tab value="0">
              <i class="pi pi-user mr-2"></i>
              Profil
            </Tab>
            <Tab value="1">
              <i class="pi pi-lock mr-2"></i>
              Mot de passe
            </Tab>
            <Tab value="2">
              <i class="pi pi-cog mr-2"></i>
              Préférences
            </Tab>
          </TabList>

          <TabPanels>
            <!-- Onglet Profil -->
            <TabPanel value="0">
              <div class="p-6">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Informations personnelles</h2>
                
                <form @submit.prevent="updateProfile" class="space-y-6">
                  <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Nom complet</label>
                    <InputText v-model="fullName" class="w-full" />
                  </div>

                  <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                    <InputText v-model="email" type="email" class="w-full" disabled />
                    <small class="text-gray-500">L'email ne peut pas être modifié</small>
                  </div>

                  <Message v-if="profileMsg.content" :severity="profileMsg.type" :closable="false">
                    {{ profileMsg.content }}
                  </Message>

                  <Button type="submit" label="Enregistrer les modifications" :loading="loadingProfile" />
                </form>
              </div>
            </TabPanel>

            <!-- Onglet Mot de passe -->
            <TabPanel value="1">
              <div class="p-6">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Changer le mot de passe</h2>
                
                <form @submit.prevent="updatePassword" class="space-y-6">
                  <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Mot de passe actuel</label>
                    <Password v-model="currentPassword" toggleMask :feedback="false" class="w-full" inputClass="w-full" required />
                    <small class="text-gray-500">Pour des raisons de sécurité, veuillez confirmer votre mot de passe actuel</small>
                  </div>

                  <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Nouveau mot de passe</label>
                    <Password v-model="newPassword" toggleMask class="w-full" inputClass="w-full" required />
                  </div>

                  <div class="flex flex-col gap-2">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Confirmer le mot de passe</label>
                    <Password v-model="confirmPassword" toggleMask :feedback="false" class="w-full" inputClass="w-full" required />
                  </div>

                  <Message v-if="passwordMsg.content" :severity="passwordMsg.type" :closable="false">
                    {{ passwordMsg.content }}
                  </Message>

                  <Button type="submit" label="Mettre à jour le mot de passe" :loading="loadingPassword" />
                </form>
              </div>
            </TabPanel>

            <!-- Onglet Préférences -->
            <TabPanel value="2">
              <div class="p-6">
                <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Préférences du compte</h2>
                
                <div class="space-y-6">
                  <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 class="text-lg font-semibold text-red-600 mb-4">Zone dangereuse</h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-4">
                      La suppression de votre compte est irréversible. Toutes vos données seront définitivement supprimées.
                    </p>
                    <Button 
                      label="Supprimer mon compte" 
                      severity="danger" 
                      outlined
                      @click="deleteAccount"
                    />
                  </div>
                </div>
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </div>
  </div>
</template>