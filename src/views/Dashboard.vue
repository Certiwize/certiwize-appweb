<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// Liste des 15 fonctionnalités automatisées
const features = [
  { id: 1, titleKey: 'dashboard.feature_1', icon: 'pi-file', endpoint: '/webhook/convention' },
  { id: 2, titleKey: 'dashboard.feature_2', icon: 'pi-user-plus', endpoint: '/webhook/sign' },
  { id: 3, titleKey: 'dashboard.feature_3', icon: 'pi-folder-open', endpoint: '/webhook/drive' },
  { id: 4, titleKey: 'dashboard.feature_4', icon: 'pi-calendar-plus', endpoint: '/webhook/convoc-gen' },
  { id: 5, titleKey: 'dashboard.feature_5', icon: 'pi-question-circle', endpoint: '/webhook/quest-pos' },
  { id: 6, titleKey: 'dashboard.feature_6', icon: 'pi-send', endpoint: '/webhook/convoc-send' },
  { id: 7, titleKey: 'dashboard.feature_7', icon: 'pi-list', endpoint: '/webhook/emargement' },
  { id: 8, titleKey: 'dashboard.feature_8', icon: 'pi-star', endpoint: '/webhook/chaud' },
  { id: 9, titleKey: 'dashboard.feature_9', icon: 'pi-euro', endpoint: '/webhook/facture' },
  { id: 10, titleKey: 'dashboard.feature_10', icon: 'pi-replay', endpoint: '/webhook/relance' },
  { id: 11, titleKey: 'dashboard.feature_11', icon: 'pi-verified', endpoint: '/webhook/certif-gen' },
  { id: 12, titleKey: 'dashboard.feature_12', icon: 'pi-briefcase', endpoint: '/webhook/send-resp' },
  { id: 13, titleKey: 'dashboard.feature_13', icon: 'pi-envelope', endpoint: '/webhook/send-appr' },
  { id: 14, titleKey: 'dashboard.feature_14', icon: 'pi-clock', endpoint: '/webhook/froid' },
  { id: 15, titleKey: 'dashboard.feature_15', icon: 'pi-sync', endpoint: '/webhook/pennylane' },
];

const triggerWorkflow = (feature) => {
  const title = t(feature.titleKey);
  console.log(`Déclenchement du workflow : ${title} via ${feature.endpoint}`);
  alert(`${t('dashboard.simulation_prefix')} "${title}" lancé !`);
  // TODO: Appel axios vers le webhook n8n
};
</script>

<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white">{{ t('dashboard.title') }}</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div 
        v-for="feature in features" 
        :key="feature.id"
        class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer border border-transparent hover:border-primary group"
        @click="triggerWorkflow(feature)"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg group-hover:bg-primary transition duration-300">
            <i :class="`pi ${feature.icon} text-primary text-xl group-hover:text-white`"></i>
          </div>
          <span class="text-xs font-mono text-gray-400">#{{ feature.id }}</span>
        </div>
        <h3 class="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-primary">{{ t(feature.titleKey) }}</h3>
        <p class="text-sm text-gray-500 mt-2">{{ t('dashboard.click_to_execute') }}</p>
      </div>
    </div>
  </div>
</template>