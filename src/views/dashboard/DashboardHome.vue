<script setup>
import { ref } from 'vue';

const stats = [
  { 
    title: "Chiffre d'Affaires", 
    value: "N/A", 
    trend: "N/A", 
    trendUp: true, 
    icon: "pi-euro",
    color: "bg-emerald-500" 
  },
  { 
    title: "Projets Actifs", 
    value: "N/A", 
    trend: "N/A", 
    trendUp: true, 
    icon: "pi-folder-open",
    color: "bg-blue-500" 
  },
  { 
    title: "Satisfaction Client", 
    value: "N/A", 
    trend: "N/A", 
    trendUp: true, 
    icon: "pi-heart",
    color: "bg-rose-500" 
  },
  { 
    title: "Nouveaux Prospects", 
    value: "N/A", 
    trend: "N/A", 
    trendUp: false, 
    icon: "pi-user-plus",
    color: "bg-amber-500" 
  },
];

const recentProjects = [
  { id: 1, name: "Formation Vue.js Avancé", client: "TechCorp", status: "En cours", progress: 75, date: "22 Déc 2025" },
  { id: 2, name: "Audit Sécurité", client: "SARL Data", status: "Terminé", progress: 100, date: "20 Déc 2025" },
  { id: 3, name: "Coaching Agile", client: "StartUp Nation", status: "Planifié", progress: 0, date: "25 Déc 2025" },
  { id: 4, name: "Workshop UX/UI", client: "DesignAgency", status: "En cours", progress: 45, date: "28 Déc 2025" },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'En cours': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
    case 'Terminé': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
    case 'Planifié': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    default: return 'bg-gray-100 text-gray-700';
  }
};
</script>

<template>
  <div class="p-8 space-y-8">
    <!-- Header -->
    <div class="flex justify-between items-end">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Tableau de bord</h1>
        <p class="text-gray-500 mt-2">Bienvenue sur votre espace de gestion.</p>
      </div>
      <div class="flex gap-3">
        <button class="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-2">
          <i class="pi pi-calendar"></i>
          <span>Cette semaine</span>
        </button>
        <button class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition shadow-lg shadow-primary/25 flex items-center gap-2">
          <i class="pi pi-plus"></i>
          <span>Nouveau Projet</span>
        </button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="stat in stats" :key="stat.title" class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
        <div class="flex justify-between items-start mb-4">
          <div class="p-3 rounded-xl bg-opacity-10" :class="[stat.color.replace('bg-', 'bg-opacity-10 '), stat.color.replace('bg-', 'text-')]"> 
            <!-- Note: simplistic class manipulation for demo, ideally use proper color props -->
            <i class="pi text-xl" :class="[stat.icon, stat.color.replace('bg-', 'text-')]"></i>
          </div>
          <span class="text-sm font-medium px-2.5 py-1 rounded-full flex items-center gap-1"
            :class="stat.trendUp ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'">
            <i class="pi text-xs" :class="stat.trendUp ? 'pi-arrow-up' : 'pi-arrow-down'"></i>
            {{ stat.trend }}
          </span>
        </div>
        <h3 class="text-gray-500 dark:text-gray-400 text-sm font-medium">{{ stat.title }}</h3>
        <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ stat.value }}</p>
      </div>
    </div>

    <!-- Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Recent Projects -->
      <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div class="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">Projets Récents</h2>
          <button class="text-primary hover:text-primary-600 text-sm font-medium">Voir tout</button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Projet</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Client</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Statut</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Progression</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
              <tr v-for="project in recentProjects" :key="project.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td class="px-6 py-4">
                  <span class="font-medium text-gray-900 dark:text-white">{{ project.name }}</span>
                </td>
                <td class="px-6 py-4 text-gray-600 dark:text-gray-400">{{ project.client }}</td>
                <td class="px-6 py-4">
                  <span class="px-2.5 py-1 rounded-md text-xs font-medium" :class="getStatusColor(project.status)">
                    {{ project.status }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="flex-1 w-24 bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                      <div class="bg-primary h-2 rounded-full" :style="{ width: project.progress + '%' }"></div>
                    </div>
                    <span class="text-xs text-gray-500">{{ project.progress }}%</span>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">{{ project.date }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Quick Actions / Notifications (Placeholder for now) -->
      <div class="space-y-6">
        <div class="bg-gradient-to-br from-primary to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/30">
          <h3 class="text-lg font-bold mb-2">Besoin d'aide ?</h3>
          <p class="text-blue-100 mb-6 text-sm">Consultez notre documentation ou contactez le support pour toute question sur la certification.</p>
          <button class="w-full py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-medium transition backdrop-blur-sm">
            Centre d'aide
          </button>
        </div>

         <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
          <h3 class="font-bold text-gray-900 dark:text-white mb-4">Activité Récente</h3>
          <div class="space-y-4">
            <div class="flex gap-3">
              <div class="w-2 h-2 mt-2 rounded-full bg-blue-500 shrink-0"></div>
              <div>
                <p class="text-sm text-gray-800 dark:text-gray-200">Nouveau document généré</p>
                <p class="text-xs text-gray-500">Il y a 2 heures</p>
              </div>
            </div>
             <div class="flex gap-3">
              <div class="w-2 h-2 mt-2 rounded-full bg-green-500 shrink-0"></div>
              <div>
                <p class="text-sm text-gray-800 dark:text-gray-200">Facture #REF-2024 payée</p>
                <p class="text-xs text-gray-500">Il y a 5 heures</p>
              </div>
            </div>
             <div class="flex gap-3">
              <div class="w-2 h-2 mt-2 rounded-full bg-purple-500 shrink-0"></div>
              <div>
                <p class="text-sm text-gray-800 dark:text-gray-200">Nouveau prospect ajouté</p>
                <p class="text-xs text-gray-500">Hier</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
