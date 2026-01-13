<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const features = computed(() => [
  {
    id: 1,
    icon: 'pi-chart-bar',
    title: "Tableau de Bord & KPI",
    description: "Visualisez en un coup d'œil l'activité de votre organisme de formation. Suivez les indicateurs clés (CA, nombre de stagiaires, taux de satisfaction) pour piloter votre activité.",
    benefits: [
      "Vues synthétiques et graphiques",
      "Suivi des entrées/sorties",
      "Indicateurs Qualiopi",
      "Alertes et notifications"
    ]
  },
  {
    id: 2,
    icon: 'pi-users',
    title: "Gestion des Tiers (CRM)",
    description: "Centralisez la gestion de vos Clients, Formateurs et Fournisseurs. Une base de données unique pour retrouver facilement toutes les coordonnées et documents associés.",
    benefits: [
      "Fiches détaillées (Clients, Formateurs...)",
      "Gestion des contacts",
      "Assignation de référents",
      "Historique des échanges"
    ]
  },
  {
    id: 3,
    icon: 'pi-book',
    title: "Catalogue de Formations",
    description: "Gérez votre offre de formation avec précision. Créez des fiches programmes complètes, définissez les objectifs, prérequis et modalités d'évaluation.",
    benefits: [
      "Fiches programmes conformes",
      "Gestion des versions",
      "Tarification et modalités",
      "Programme détaillé par module"
    ]
  },
  {
    id: 4,
    icon: 'pi-briefcase',
    title: "Gestion de Projets (Workflow)",
    description: "Un workflow complet pour gérer le cycle de vie de vos sessions de formation, de la demande initiale jusqu'à la clôture du dossier et l'envoi des documents.",
    benefits: [
      "Workflow guidé (Identification -> Clôture)",
      "Génération automatique de documents",
      "Conventions et Convocations",
      "Suivi des émargements"
    ]
  },
  {
    id: 5,
    icon: 'pi-bolt',
    title: "Analyse IA de Documents",
    description: "Gagnez du temps grâce à l'intelligence artificielle. Analysez automatiquement vos documents (CV, Certificats, Programmes) pour en extraire les données essentielles.",
    benefits: [
      "Reconnaissance automatique (OCR)",
      "Extractions de données clés",
      "Support PDF, DOCX, Images",
      "Intégration fluide au dossier"
    ]
  },
  {
    id: 6,
    icon: 'pi-building',
    title: "Configuration & Conformité",
    description: "Administrez votre organisme sereinement. Configurez vos informations légales, logos, documents de référence (CGV, Règlement intérieur) et suivis Qualité.",
    benefits: [
      "Informations légales et logos",
      "Gestion des taxes et TVA",
      "Documents de référence (CGV...)",
      "Suivi des référents (Handicap...)"
    ]
  }
]);
</script>

<template>
  <div class="py-16 px-4 bg-gray-50 dark:bg-gray-900">
    <!-- Hero Section -->
    <div class="max-w-7xl mx-auto text-center mb-16">
      <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
        {{ t('features.title') }} <span class="text-primary">{{ t('features.title_highlight') }}</span>
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
        {{ t('features.subtitle') }}
      </p>
    </div>

    <!-- Features Grid -->
    <div class="max-w-7xl mx-auto space-y-8">
      <div 
        v-for="(feature, index) in features" 
        :key="feature.id"
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
        :class="index % 2 === 0 ? 'lg:grid lg:grid-cols-2' : 'lg:grid lg:grid-cols-2'"
      >
        <!-- Icon & Title Section -->
        <div 
          class="p-8 lg:p-12 flex flex-col justify-center"
          :class="index % 2 === 1 ? 'lg:order-2' : ''"
        >
          <div class="flex items-center mb-6">
            <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mr-4">
              <i :class="`pi ${feature.icon} text-3xl text-primary`"></i>
            </div>
            <span class="text-sm font-mono text-gray-400">#{{ feature.id }}</span>
          </div>
          
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {{ feature.title }}
          </h2>
          
          <p class="text-lg text-gray-600 dark:text-gray-300 mb-6">
            {{ feature.description }}
          </p>

          <!-- Benefits List -->
          <div class="space-y-3">
            <div 
              v-for="(benefit, i) in feature.benefits" 
              :key="i"
              class="flex items-center"
            >
              <i class="pi pi-check-circle text-primary mr-3"></i>
              <span class="text-gray-700 dark:text-gray-300">{{ benefit }}</span>
            </div>
          </div>
        </div>

        <!-- Visual Section -->
        <div 
          class="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/5 p-8 lg:p-12 flex items-center justify-center"
          :class="index % 2 === 1 ? 'lg:order-1' : ''"
        >
          <div class="w-full max-w-md aspect-square bg-white/50 dark:bg-gray-900/50 rounded-2xl backdrop-blur-sm border border-gray-200 dark:border-gray-700 flex items-center justify-center">
            <i :class="`pi ${feature.icon} text-8xl text-primary/30`"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="max-w-4xl mx-auto text-center mt-20 bg-gradient-to-r from-primary to-primary-dark text-white p-12 rounded-2xl shadow-2xl">
      <h2 class="text-3xl font-bold mb-4">{{ t('features.cta_title') }}</h2>
      <p class="text-xl mb-8 text-white/90">
        {{ t('features.cta_subtitle') }}
      </p>
      <div class="flex flex-col sm:flex-row justify-center gap-4">
        <router-link 
          to="/contact" 
          class="bg-white text-primary px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition shadow-lg"
        >
          {{ t('features.cta_demo') }}
        </router-link>
        <router-link 
          to="/faq" 
          class="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-white/10 transition"
        >
          {{ t('features.cta_faq') }}
        </router-link>
      </div>
    </div>
  </div>
</template>