<script setup>
import { ref, watch } from 'vue';
import { useAuthStore } from '../stores/auth';
import Sidebar from '../components/dashboard/Sidebar.vue';

const authStore = useAuthStore();
const refreshKey = ref(0);

// Forcer le rechargement du composant quand l'utilisateur est authentifié
// Cela corrige le problème de chargement infini si onMounted s'exécute avant l'auth
watch(() => authStore.user, (newUser) => {
  if (newUser) {
    console.log('🔄 Auth prête, rechargement de la vue...');
    refreshKey.value++;
  }
});
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
          <component :is="Component" :key="$route.fullPath + '-' + refreshKey" />
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
