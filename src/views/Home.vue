<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>

<template>
  <div class="py-20 text-center">
    <h1 class="text-5xl font-bold mb-6 text-gray-900 dark:text-white">
      {{ t('home.hero_title') }}
    </h1>
    <p class="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
      {{ t('home.hero_subtitle') }}
    </p>
    <div class="flex justify-center gap-4">
      <router-link to="/contact" class="bg-primary text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-dark transition shadow-lg hover:shadow-xl">
        {{ t('home.cta') }}
      </router-link>
    </div>
    
    <div class="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
      <div class="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <i class="pi pi-bolt text-4xl text-primary mb-4"></i>
        <h3 class="text-xl font-bold mb-2">Automatisation</h3>
        <p class="text-gray-600 dark:text-gray-400">Générez vos conventions et convocations en un clic.</p>
      </div>
      </div>
  </div>
</template>