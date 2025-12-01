<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const features = computed(() => [
  {
    id: 1,
    icon: 'pi-file',
    title: t('features.feature_1_title'),
    description: t('features.feature_1_desc'),
    benefits: [
      t('features.feature_1_benefit_1'),
      t('features.feature_1_benefit_2'),
      t('features.feature_1_benefit_3'),
      t('features.feature_1_benefit_4')
    ]
  },
  {
    id: 2,
    icon: 'pi-user-plus',
    title: t('features.feature_2_title'),
    description: t('features.feature_2_desc'),
    benefits: [
      t('features.feature_2_benefit_1'),
      t('features.feature_2_benefit_2'),
      t('features.feature_2_benefit_3'),
      t('features.feature_2_benefit_4')
    ]
  },
  {
    id: 3,
    icon: 'pi-folder-open',
    title: t('features.feature_3_title'),
    description: t('features.feature_3_desc'),
    benefits: [
      t('features.feature_3_benefit_1'),
      t('features.feature_3_benefit_2'),
      t('features.feature_3_benefit_3'),
      t('features.feature_3_benefit_4')
    ]
  },
  {
    id: 4,
    icon: 'pi-calendar-plus',
    title: t('features.feature_4_title'),
    description: t('features.feature_4_desc'),
    benefits: [
      t('features.feature_4_benefit_1'),
      t('features.feature_4_benefit_2'),
      t('features.feature_4_benefit_3'),
      t('features.feature_4_benefit_4')
    ]
  },
  {
    id: 5,
    icon: 'pi-question-circle',
    title: t('features.feature_5_title'),
    description: t('features.feature_5_desc'),
    benefits: [
      t('features.feature_5_benefit_1'),
      t('features.feature_5_benefit_2'),
      t('features.feature_5_benefit_3'),
      t('features.feature_5_benefit_4')
    ]
  },
  {
    id: 6,
    icon: 'pi-send',
    title: t('features.feature_6_title'),
    description: t('features.feature_6_desc'),
    benefits: [
      t('features.feature_6_benefit_1'),
      t('features.feature_6_benefit_2'),
      t('features.feature_6_benefit_3'),
      t('features.feature_6_benefit_4')
    ]
  },
  {
    id: 7,
    icon: 'pi-list',
    title: t('features.feature_7_title'),
    description: t('features.feature_7_desc'),
    benefits: [
      t('features.feature_7_benefit_1'),
      t('features.feature_7_benefit_2'),
      t('features.feature_7_benefit_3'),
      t('features.feature_7_benefit_4')
    ]
  },
  {
    id: 8,
    icon: 'pi-star',
    title: t('features.feature_8_title'),
    description: t('features.feature_8_desc'),
    benefits: [
      t('features.feature_8_benefit_1'),
      t('features.feature_8_benefit_2'),
      t('features.feature_8_benefit_3'),
      t('features.feature_8_benefit_4')
    ]
  },
  {
    id: 9,
    icon: 'pi-euro',
    title: t('features.feature_9_title'),
    description: t('features.feature_9_desc'),
    benefits: [
      t('features.feature_9_benefit_1'),
      t('features.feature_9_benefit_2'),
      t('features.feature_9_benefit_3'),
      t('features.feature_9_benefit_4')
    ]
  },
  {
    id: 10,
    icon: 'pi-replay',
    title: t('features.feature_10_title'),
    description: t('features.feature_10_desc'),
    benefits: [
      t('features.feature_10_benefit_1'),
      t('features.feature_10_benefit_2'),
      t('features.feature_10_benefit_3'),
      t('features.feature_10_benefit_4')
    ]
  },
  {
    id: 11,
    icon: 'pi-verified',
    title: t('features.feature_11_title'),
    description: t('features.feature_11_desc'),
    benefits: [
      t('features.feature_11_benefit_1'),
      t('features.feature_11_benefit_2'),
      t('features.feature_11_benefit_3'),
      t('features.feature_11_benefit_4')
    ]
  },
  {
    id: 12,
    icon: 'pi-briefcase',
    title: t('features.feature_12_title'),
    description: t('features.feature_12_desc'),
    benefits: [
      t('features.feature_12_benefit_1'),
      t('features.feature_12_benefit_2'),
      t('features.feature_12_benefit_3'),
      t('features.feature_12_benefit_4')
    ]
  },
  {
    id: 13,
    icon: 'pi-envelope',
    title: t('features.feature_13_title'),
    description: t('features.feature_13_desc'),
    benefits: [
      t('features.feature_13_benefit_1'),
      t('features.feature_13_benefit_2'),
      t('features.feature_13_benefit_3'),
      t('features.feature_13_benefit_4')
    ]
  },
  {
    id: 14,
    icon: 'pi-clock',
    title: t('features.feature_14_title'),
    description: t('features.feature_14_desc'),
    benefits: [
      t('features.feature_14_benefit_1'),
      t('features.feature_14_benefit_2'),
      t('features.feature_14_benefit_3'),
      t('features.feature_14_benefit_4')
    ]
  },
  {
    id: 15,
    icon: 'pi-sync',
    title: t('features.feature_15_title'),
    description: t('features.feature_15_desc'),
    benefits: [
      t('features.feature_15_benefit_1'),
      t('features.feature_15_benefit_2'),
      t('features.feature_15_benefit_3'),
      t('features.feature_15_benefit_4')
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