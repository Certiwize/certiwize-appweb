<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';

const { t } = useI18n();

const faqCategories = computed(() => [
  {
    title: t('faq.category_general'),
    items: [
      { q: t('faq.q1'), a: t('faq.a1') },
      { q: t('faq.q2'), a: t('faq.a2') }
    ]
  },
  {
    title: t('faq.category_technical'),
    items: [
      { q: t('faq.q3'), a: t('faq.a3') },
      { q: t('faq.q4'), a: t('faq.a4') }
    ]
  }
]);
</script>

<template>
  <div class="py-16 px-4 max-w-4xl mx-auto">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">{{ t('faq.title') }}</h1>
      <p class="text-xl text-gray-600 dark:text-gray-400">{{ t('faq.subtitle') }}</p>
    </div>

    <div class="space-y-8">
      <div v-for="(category, index) in faqCategories" :key="index">
        <h2 class="text-2xl font-semibold text-primary mb-4">{{ category.title }}</h2>
        
        <Accordion value="0">
          <AccordionPanel v-for="(item, i) in category.items" :key="i" :value="index + '-' + i">
            <AccordionHeader>{{ item.q }}</AccordionHeader>
            <AccordionContent>
              <p class="text-gray-600 dark:text-gray-300">{{ item.a }}</p>
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
      </div>
    </div>
  </div>
</template>