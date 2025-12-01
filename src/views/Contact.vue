<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Button from 'primevue/button';
import Message from 'primevue/message';

const { t } = useI18n();
const form = ref({ name: '', email: '', message: '' });
const submitted = ref(false);

const submitForm = () => {
  // Simulation d'envoi
  setTimeout(() => {
    submitted.value = true;
    form.value = { name: '', email: '', message: '' };
  }, 500);
};
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
      
      <div class="bg-primary p-10 text-white flex flex-col justify-center">
        <h2 class="text-3xl font-bold mb-6">{{ t('contact.intro_title') }}</h2>
        <p class="mb-8 text-white/90">
          {{ t('contact.intro_desc') }}
        </p>
        <div class="space-y-4">
          <div class="flex items-center">
            <i class="pi pi-envelope mr-3 text-xl"></i>
            <span>contact@certiwize.com</span>
          </div>
          <div class="flex items-start">
            <i class="pi pi-map-marker mr-3 text-xl mt-1"></i>
            <span>{{ t('footer.location') }}</span>
          </div>
        </div>
      </div>

      <div class="p-10">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">{{ t('contact.title') }}</h1>
        
        <form @submit.prevent="submitForm" class="space-y-6">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ t('contact.name') }}</label>
            <InputText v-model="form.name" class="w-full" required />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ t('contact.email') }}</label>
            <InputText v-model="form.email" type="email" class="w-full" required />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ t('contact.message') }}</label>
            <Textarea v-model="form.message" rows="4" class="w-full" required />
          </div>

          <Button type="submit" :label="t('contact.submit')" icon="pi pi-send" class="w-full mt-2" />
          
          <Message v-if="submitted" severity="success" :closable="false" class="mt-4">
            {{ t('contact.success') }}
          </Message>
        </form>
      </div>

    </div>
  </div>
</template>