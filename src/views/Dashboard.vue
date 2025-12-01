<script setup>
import { ref } from 'vue';

// Liste des 15 fonctionnalités automatisées
const features = ref([
  { id: 1, title: 'Convention de formation', icon: 'pi-file', endpoint: '/webhook/convention' },
  { id: 2, title: 'Signature & Airtable', icon: 'pi-user-plus', endpoint: '/webhook/sign' },
  { id: 3, title: 'Dossier Drive Client', icon: 'pi-folder-open', endpoint: '/webhook/drive' },
  { id: 4, title: 'Générer Convocation', icon: 'pi-calendar-plus', endpoint: '/webhook/convoc-gen' },
  { id: 5, title: 'Questionnaire Positionnement', icon: 'pi-question-circle', endpoint: '/webhook/quest-pos' },
  { id: 6, title: 'Envoi Convocation', icon: 'pi-send', endpoint: '/webhook/convoc-send' },
  { id: 7, title: 'Feuille d\'émargement', icon: 'pi-list', endpoint: '/webhook/emargement' },
  { id: 8, title: 'Questionnaire À chaud', icon: 'pi-star', endpoint: '/webhook/chaud' },
  { id: 9, title: 'Génération Factures', icon: 'pi-euro', endpoint: '/webhook/facture' },
  { id: 10, title: 'Relance À chaud', icon: 'pi-replay', endpoint: '/webhook/relance' },
  { id: 11, title: 'Génération Certifications', icon: 'pi-verified', endpoint: '/webhook/certif-gen' },
  { id: 12, title: 'Envoi Docs Responsable', icon: 'pi-briefcase', endpoint: '/webhook/send-resp' },
  { id: 13, title: 'Envoi Certifs Apprenants', icon: 'pi-envelope', endpoint: '/webhook/send-appr' },
  { id: 14, title: 'Questionnaire À froid', icon: 'pi-clock', endpoint: '/webhook/froid' },
  { id: 15, title: 'Synchro Pennylane', icon: 'pi-sync', endpoint: '/webhook/pennylane' },
]);

const triggerWorkflow = (feature) => {
  console.log(`Déclenchement du workflow : ${feature.title} via ${feature.endpoint}`);
  alert(`Simulation : Workflow "${feature.title}" lancé !`);
  // TODO: Appel axios vers le webhook n8n
};
</script>

<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Tableau de bord Automation</h1>
    
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
        <h3 class="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-primary">{{ feature.title }}</h3>
        <p class="text-sm text-gray-500 mt-2">Cliquer pour exécuter</p>
      </div>
    </div>
  </div>
</template>