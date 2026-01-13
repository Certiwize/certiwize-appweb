import { createI18n } from 'vue-i18n';
import fr from './locales/fr.json';
import en from './locales/en.json';

const i18n = createI18n({
  legacy: false, // Pour Vue 3 Composition API
  locale: localStorage.getItem('user-locale') || 'fr',
  fallbackLocale: 'en',
  messages: { fr, en }
});

export default i18n;