<script setup>
import { onMounted, computed } from 'vue';
import { useDataStore } from '../../stores/data';
import { useTrainingStore } from '../../stores/training';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '../../stores/auth';
import Button from 'primevue/button';

const authStore = useAuthStore();
const dataStore = useDataStore();
const trainingStore = useTrainingStore();
const { stats, loading } = storeToRefs(dataStore);
const { formations } = storeToRefs(trainingStore);

// Calculer le nombre total de formations
const totalFormations = computed(() => formations.value.length);

onMounted(() => {
    // Charger les tiers pour calculer les stats
    if (dataStore.tiers.length === 0) {
        dataStore.fetchTiers();
    }
    // Charger les vraies formations
    trainingStore.fetchFormations();
});
</script>

<template>
    <div class="space-y-8">
        <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ $t('dashboard.hello') }}, {{ authStore.user?.user_metadata?.full_name || 'Utilisateur' }} 👋
            </h1>
            <p class="text-gray-500 dark:text-gray-400">{{ $t('dashboard.status_today') }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 border-primary">
                <div class="text-gray-500 mb-1 text-sm font-medium">{{ $t('dashboard.total_clients') }}</div>
                <div class="text-3xl font-bold" v-if="!loading">{{ stats.totalTiers }}</div>
                <div class="text-3xl font-bold animate-pulse" v-else>...</div>
            </div>
            
            <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                <div class="text-gray-500 mb-1 text-sm font-medium">{{ $t('dashboard.active_formations') }}</div>
                <div class="text-3xl font-bold" v-if="!trainingStore.loading">{{ totalFormations }}</div>
                <div class="text-3xl font-bold animate-pulse" v-else>...</div>
            </div>

            <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border-l-4 border-orange-500">
                <div class="text-gray-500 mb-1 text-sm font-medium">{{ $t('dashboard.active_projects') }}</div>
                <div class="text-3xl font-bold">{{ stats.activeProjects }}</div> 
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <!-- Derniers Tiers -->
            <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <h3 class="font-bold text-gray-800 dark:text-gray-100 mb-4 border-b pb-2">{{ $t('dashboard.recent_clients') }}</h3>
                <ul class="space-y-3" v-if="!loading">
                    <li v-for="tier in dataStore.tiers.slice(0, 3)" :key="tier.id" class="flex justify-between items-center text-sm">
                        <span class="font-medium text-gray-700 dark:text-gray-300">{{ tier.name }}</span>
                        <span class="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{{ tier.state }}</span>
                    </li>
                    <li v-if="dataStore.tiers.length === 0" class="text-gray-400 text-sm italic">{{ $t('dashboard.no_clients') }}</li>
                </ul>
                <div v-else class="text-sm text-gray-400">{{ $t('dashboard.loading') }}</div>
            </div>

            <!-- Dernières Formations -->
            <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <h3 class="font-bold text-gray-800 dark:text-gray-100 mb-4 border-b pb-2">{{ $t('dashboard.recent_formations') }}</h3>
                <ul class="space-y-3" v-if="!trainingStore.loading">
                    <li v-for="formation in formations.slice(0, 3)" :key="formation.id" class="flex justify-between items-center text-sm">
                        <span class="font-medium text-gray-700 dark:text-gray-300">{{ formation.title }}</span>
                        <span class="text-xs text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
                            {{ new Date(formation.updated_at).toLocaleDateString('fr-FR') }}
                        </span>
                    </li>
                    <li v-if="formations.length === 0" class="text-gray-400 text-sm italic">Aucune formation créée</li>
                </ul>
                <div v-else class="text-sm text-gray-400">{{ $t('dashboard.loading') }}</div>
            </div>

            <!-- Derniers Projets -->
            <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                <h3 class="font-bold text-gray-800 dark:text-gray-100 mb-4 border-b pb-2">{{ $t('dashboard.recent_projects') }}</h3>
                <ul class="space-y-3">
                    <li v-for="project in dataStore.projects.slice(0, 3)" :key="project.id" class="flex justify-between items-center text-sm">
                        <span class="font-medium text-gray-700 dark:text-gray-300">{{ project.name }}</span>
                        <span class="text-xs text-orange-600 bg-orange-50 dark:bg-orange-900/30 px-2 py-1 rounded">{{ project.status }}</span>
                    </li>
                </ul>
            </div>
        </div>

        <div class="bg-blue-50 dark:bg-gray-800/50 p-6 rounded-xl border border-blue-100 dark:border-gray-700">
            <h3 class="font-bold mb-2">{{ $t('dashboard.quick_action_title') }}</h3>
            <div class="flex gap-4">
                <router-link to="/dashboard/tiers/create" class="text-primary hover:underline font-medium">
                    {{ $t('dashboard.add_client') }}
                </router-link>
                <router-link to="/dashboard/catalogue" class="text-primary hover:underline font-medium">
                     {{ $t('dashboard.launch_automation') }}
                </router-link>
                <router-link to="/dashboard/projets/create">
                    <Button label="Nouveau Projet" icon="pi pi-plus" />
                </router-link>
            </div>
        </div>
    </div>
</template>