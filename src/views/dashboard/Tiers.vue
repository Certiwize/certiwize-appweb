<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Gestion des Tiers</h1>
        <p class="text-gray-500 mt-1">Gérez vos clients, prospects et fournisseurs.</p>
      </div>
      <button 
        @click="router.push('/dashboard/tiers/create')"
        class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition shadow-lg shadow-primary/25 flex items-center gap-2"
      >
        <i class="pi pi-plus"></i>
        <span>Nouveau Tiers</span>
      </button>
    </div>

    <!-- Empty State (for now) -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-dashed border-gray-300 dark:border-gray-700">
      <div class="w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
        <i class="pi pi-users text-2xl text-gray-400"></i>
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucun tiers pour le moment</h3>
      <p class="text-gray-500 max-w-sm mx-auto mb-6">Commencez par créer votre premier tiers (client, prospect ou fournisseur) pour gérer votre activité.</p>
      <button 
        @click="router.push('/dashboard/tiers/create')"
        class="text-primary hover:text-primary-600 font-medium hover:underline"
      >
        Créer un tiers maintenant
      </button>
    </div>
  </div>
</template>
