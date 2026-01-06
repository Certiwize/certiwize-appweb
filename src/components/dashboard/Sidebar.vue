<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const navigation = [
  { name: 'Acceuil', href: '/dashboard', icon: 'pi-home' },
  { name: 'Tiers', href: '/dashboard/tiers', icon: 'pi-users' },
  { name: 'Catalogue', href: '/dashboard/catalogue', icon: 'pi-book' },
  { name: 'Projets', href: '/dashboard/projets', icon: 'pi-briefcase' },
  { name: 'Analyse Doc', href: '/dashboard/analyse-doc', icon: 'pi-search' },
  { name: 'Manuel Qualiopi', href: '/dashboard/manuel-qualiopi', icon: 'pi-book' },
];

const isCurrent = (path) => {
  if (path === '/dashboard') {
    return route.path === '/dashboard'; 
  }
  return route.path.startsWith(path);
};
</script>

<template>
  <div class="flex flex-col h-full bg-slate-900 w-64 text-white">
    <div class="p-6 flex items-center justify-center border-b border-slate-800">
      <h1 class="text-xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">Certiwize</h1>
    </div>

    <nav class="flex-1 p-4 space-y-2">
      <router-link
        v-for="item in navigation"
        :key="item.name"
        :to="item.href"
        class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group"
        :class="[
          isCurrent(item.href)
            ? 'bg-primary text-white shadow-lg shadow-primary/25'
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        ]"
      >
        <i class="pi" :class="[item.icon, isCurrent(item.href) ? 'text-white' : 'text-slate-400 group-hover:text-white']"></i>
        <span class="font-medium">{{ item.name }}</span>
      </router-link>
    </nav>
    
    <div class="p-4 border-t border-slate-800">
      <router-link
        to="/login"
        class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
      >
        <i class="pi pi-sign-out"></i>
        <span class="font-medium">Déconnexion</span>
      </router-link>
    </div>
  </div>
</template>
