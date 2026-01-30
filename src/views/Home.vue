<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const benefits = computed(() => [
  { 
    icon: 'pi-clock', 
    title: t('home.benefit_time_title'), 
    desc: t('home.benefit_time_desc') 
  },
  { 
    icon: 'pi-check-circle', 
    title: t('home.benefit_compliance_title'), 
    desc: t('home.benefit_compliance_desc') 
  },
  { 
    icon: 'pi-sync', 
    title: t('home.benefit_sync_title'), 
    desc: t('home.benefit_sync_desc') 
  }
]);
</script>

<template>
  <section class="py-20 lg:py-32 text-center bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
    <div class="max-w-7xl mx-auto px-4">
      <h1 class="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight text-gray-900 dark:text-white">
        {{ t('home.hero_title') }} <span class="text-primary">en un clic.</span>
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
        {{ t('home.hero_subtitle') }}
      </p>
      <div class="flex flex-col sm:flex-row justify-center gap-4">
        <router-link to="/register" class="bg-primary text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-primary-dark transition shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-200">
          {{ t('home.cta') }}
        </router-link>
        <router-link to="/features" class="bg-white dark:bg-gray-700 text-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 transition shadow-sm">
          {{ t('home.learn_more') }}
        </router-link>
      </div>
    </div>
  </section>
  
  <section class="py-24 bg-white dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4">
      <h2 class="text-3xl font-bold text-center mb-16 text-gray-900 dark:text-white">{{ t('home.benefits_title') }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div v-for="(benefit, index) in benefits" :key="index" class="p-8 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-primary/50 transition duration-300">
          <div class="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-6">
            <i :class="`pi ${benefit.icon} text-2xl text-primary`"></i>
          </div>
          <h3 class="text-xl font-bold mb-3 text-gray-900 dark:text-white">{{ benefit.title }}</h3>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ benefit.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>