<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const features = computed(() => [
  {
    id: 1,
    icon: 'pi-chart-bar',
    title: t('features.modules.dashboard.title'),
    description: t('features.modules.dashboard.description'),
    benefits: [
      t('features.modules.dashboard.benefits[0]'),
      t('features.modules.dashboard.benefits[1]'),
      t('features.modules.dashboard.benefits[2]'),
      t('features.modules.dashboard.benefits[3]')
    ]
  },
  {
    id: 2,
    icon: 'pi-users',
    title: t('features.modules.crm.title'),
    description: t('features.modules.crm.description'),
    benefits: [
      t('features.modules.crm.benefits[0]'),
      t('features.modules.crm.benefits[1]'),
      t('features.modules.crm.benefits[2]'),
      t('features.modules.crm.benefits[3]')
    ]
  },
  {
    id: 3,
    icon: 'pi-book',
    title: t('features.modules.catalogue.title'),
    description: t('features.modules.catalogue.description'),
    benefits: [
      t('features.modules.catalogue.benefits[0]'),
      t('features.modules.catalogue.benefits[1]'),
      t('features.modules.catalogue.benefits[2]'),
      t('features.modules.catalogue.benefits[3]')
    ]
  },
  {
    id: 4,
    icon: 'pi-briefcase',
    title: t('features.modules.workflow.title'),
    description: t('features.modules.workflow.description'),
    benefits: [
      t('features.modules.workflow.benefits[0]'),
      t('features.modules.workflow.benefits[1]'),
      t('features.modules.workflow.benefits[2]'),
      t('features.modules.workflow.benefits[3]')
    ]
  },
  {
    id: 5,
    icon: 'pi-bolt',
    title: t('features.modules.ia.title'),
    description: t('features.modules.ia.description'),
    benefits: [
      t('features.modules.ia.benefits[0]'),
      t('features.modules.ia.benefits[1]'),
      t('features.modules.ia.benefits[2]'),
      t('features.modules.ia.benefits[3]')
    ]
  },
  {
    id: 6,
    icon: 'pi-building',
    title: t('features.modules.config.title'),
    description: t('features.modules.config.description'),
    benefits: [
      t('features.modules.config.benefits[0]'),
      t('features.modules.config.benefits[1]'),
      t('features.modules.config.benefits[2]'),
      t('features.modules.config.benefits[3]')
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
  </div>
</template>