<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

const route = useRoute();
const { t } = useI18n();

const navigation = [
  { name: 'dashboard', href: '/dashboard', icon: 'pi-home' },
  { name: 'tiers', href: '/dashboard/tiers', icon: 'pi-users' },
  { name: 'catalogue', href: '/dashboard/catalogue', icon: 'pi-book' },
  { name: 'projects', href: '/dashboard/projets', icon: 'pi-briefcase' },
  { name: 'analysis', href: '/dashboard/analyse-doc', icon: 'pi-search' },
  { name: 'manual', href: '/dashboard/manuel-qualiopi', icon: 'pi-book' },
  { name: 'genedoc', href: 'https://qualiopi-modelisation.genedoc.fr/', icon: 'pi-link' },
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
      <a
        v-for="item in navigation"
        :key="item.name"
        :href="item.href"
        :target="item.href.startsWith('http') ? '_blank' : undefined"
        :rel="item.href.startsWith('http') ? 'noopener noreferrer' : undefined"
        class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group no-underline cursor-pointer"
        :class="[
          isCurrent(item.href)
            ? 'bg-primary text-white shadow-lg shadow-primary/25'
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        ]"
      >
        <i class="pi" :class="[item.icon, isCurrent(item.href) ? 'text-white' : 'text-slate-400 group-hover:text-white']"></i>
        <span class="font-medium">{{ t(`nav.${item.name}`) }}</span>
      </a>
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
