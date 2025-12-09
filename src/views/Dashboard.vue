<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const { t } = useI18n();

// Définition des fonctionnalités par catégorie
const featuresByCategory = computed(() => [
  {
    category: 'category_documents',
    icon: 'pi-file-pdf',
    color: 'from-blue-100 to-blue-50',
    darkColor: 'dark:from-blue-900/30 dark:to-blue-900/10',
    features: [
      { id: 1, titleKey: 'feature_1', icon: 'pi-file', endpoint: '/webhook/convention', route: '/generate-convention' },
      { id: 4, titleKey: 'feature_4', icon: 'pi-calendar-plus', endpoint: '/webhook/convoc-gen' },
      { id: 7, titleKey: 'feature_7', icon: 'pi-list', endpoint: '/webhook/emargement' },
      { id: 11, titleKey: 'feature_11', icon: 'pi-verified', endpoint: '/webhook/certif-gen' }
    ]
  },
  {
    category: 'category_questionnaires',
    icon: 'pi-question-circle',
    color: 'from-purple-100 to-purple-50',
    darkColor: 'dark:from-purple-900/30 dark:to-purple-900/10',
    features: [
      { id: 5, titleKey: 'feature_5', icon: 'pi-question-circle', endpoint: '/webhook/quest-pos' },
      { id: 8, titleKey: 'feature_8', icon: 'pi-star', endpoint: '/webhook/chaud' },
      { id: 10, titleKey: 'feature_10', icon: 'pi-replay', endpoint: '/webhook/relance' },
      { id: 14, titleKey: 'feature_14', icon: 'pi-clock', endpoint: '/webhook/froid' }
    ]
  },
  {
    category: 'category_signature',
    icon: 'pi-user-plus',
    color: 'from-green-100 to-green-50',
    darkColor: 'dark:from-green-900/30 dark:to-green-900/10',
    features: [
      { id: 2, titleKey: 'feature_2', icon: 'pi-user-plus', endpoint: '/webhook/sign' },
      { id: 6, titleKey: 'feature_6', icon: 'pi-send', endpoint: '/webhook/convoc-send' }
    ]
  },
  {
    category: 'category_archiving',
    icon: 'pi-folder-open',
    color: 'from-orange-100 to-orange-50',
    darkColor: 'dark:from-orange-900/30 dark:to-orange-900/10',
    features: [
      { id: 3, titleKey: 'feature_3', icon: 'pi-folder-open', endpoint: '/webhook/drive' },
      { id: 12, titleKey: 'feature_12', icon: 'pi-briefcase', endpoint: '/webhook/send-resp' },
      { id: 13, titleKey: 'feature_13', icon: 'pi-envelope', endpoint: '/webhook/send-appr' }
    ]
  },
  {
    category: 'category_billing',
    icon: 'pi-euro',
    color: 'from-red-100 to-red-50',
    darkColor: 'dark:from-red-900/30 dark:to-red-900/10',
    features: [
      { id: 9, titleKey: 'feature_9', icon: 'pi-euro', endpoint: '/webhook/facture' },
      { id: 15, titleKey: 'feature_15', icon: 'pi-sync', endpoint: '/webhook/pennylane' }
    ]
  }
]);

const triggerWorkflow = async (feature) => {
  // Si la feature a une route associée, rediriger vers elle
  if (feature.route) {
    router.push(feature.route);
    return;
  }

  // Sinon, déclencher le workflow n8n
  const title = t(feature.titleKey);
  
  if (!confirm(`${t('dashboard.confirm_trigger').replace('{title}', title)}`)) return;

  try {
    const response = await fetch('/api/trigger-workflow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.session?.access_token}`
      },
      body: JSON.stringify({
        featureId: feature.id,
        data: {
          timestamp: new Date().toISOString(),
          userEmail: authStore.user?.email
        }
      })
    });

    const result = await response.json();

    if (response.ok) {
      alert(`${t('dashboard.success').replace('{title}', title)}`);
      console.log('Réponse n8n:', result);
    } else {
      alert(`${t('dashboard.error').replace('{error}', result.error)}`);
    }

  } catch (error) {
    console.error(error);
    alert(t('dashboard.communication_error'));
  } 
};

</script>

<template>
  <div class="p-4 sm:p-8">
    <!-- Header -->
    <div class="mb-12">
      <h1 class="text-3xl sm:text-4xl font-bold mb-2 text-gray-900 dark:text-white">
        {{ t('dashboard.title') }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        {{ t('dashboard.welcome') }}
      </p>
    </div>

    <!-- Catégories -->
    <div class="space-y-10">
      <div 
        v-for="category in featuresByCategory" 
        :key="category.category"
        class="space-y-4"
      >
        <!-- En-tête de catégorie -->
        <div class="flex items-center gap-3 mb-6">
          <div 
            class="p-3 rounded-lg transition-all duration-300"
            :class="`bg-gradient-to-br ${category.color} ${category.darkColor}`"
          >
            <i :class="`pi ${category.icon} text-xl text-gray-700 dark:text-gray-300`"></i>
          </div>
          <div>
            <h2 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {{ t(`dashboard.${category.category}`) }}
            </h2>
            <div class="h-1 w-12 bg-primary rounded mt-1"></div>
          </div>
        </div>

        <!-- Grille de fonctionnalités -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div 
            v-for="feature in category.features" 
            :key="feature.id"
            class="group bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-700 hover:border-primary/50"
            @click="triggerWorkflow(feature)"
          >
            <!-- Icône + ID -->
            <div class="flex items-center justify-between mb-4">
              <div 
                class="p-3 rounded-lg bg-green-50 dark:bg-green-900/30 group-hover:bg-primary group-hover:text-white transition duration-300"
              >
                <i :class="`pi ${feature.icon} text-lg text-primary group-hover:text-white`"></i>
              </div>
              <span class="text-xs font-mono text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                #{{ feature.id }}
              </span>
            </div>

            <!-- Titre -->
            <h3 class="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-primary transition mb-2 line-clamp-2">
              {{ t(feature.titleKey) }}
            </h3>

            <!-- CTA -->
            <p class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <i class="pi pi-play text-primary"></i>
              {{ t('dashboard.click_to_execute') }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Info -->
    <div class="mt-16 p-6 bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/5 rounded-xl border border-primary/20">
      <div class="flex items-start gap-3">
        <i class="pi pi-info-circle text-primary text-xl mt-1"></i>
        <div>
          <h3 class="font-semibold text-gray-900 dark:text-white mb-1">{{ t('dashboard.actions') }}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Cliquez sur l'une des automatisations ci-dessus pour déclencher le workflow correspondant. Chaque action sera envoyée à vos outils (n8n, Airtable, Google Drive, etc.).
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>