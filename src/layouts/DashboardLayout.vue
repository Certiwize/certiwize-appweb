<script setup>
import { ref, watch } from 'vue';
import { useAuthStore } from '../stores/auth';
import Sidebar from '../components/dashboard/Sidebar.vue';

const authStore = useAuthStore();
// La logique de rechargement automatique au changement d'utilisateur (refreshKey)
// a été retirée car elle provoquait des rechargements intempestifs lors du rafraîchissement
// du token (ex: retour sur l'onglet). L'initialisation dans main.js suffit.
</script>

<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Sidebar Fixed -->
    <aside class="hidden md:block h-screen sticky top-0">
      <Sidebar />
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="$route.fullPath" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
