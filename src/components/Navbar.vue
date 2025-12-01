<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useThemeStore } from '../stores/theme';
import { useRouter } from 'vue-router';

const { t, locale } = useI18n();
const themeStore = useThemeStore();
const router = useRouter();

const isScrolled = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const toggleLanguage = () => {
  locale.value = locale.value === 'fr' ? 'en' : 'fr';
};

const isAuthenticated = false;
</script>

<template>
  <nav 
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="isScrolled 
      ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md border-b border-gray-200 dark:border-gray-700' 
      : 'bg-transparent border-b border-transparent'"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center cursor-pointer" @click="router.push('/')">
          <img src="/certiwize-logo.png" alt="Certiwize Logo" class="h-10 w-auto" />
        </div>

        <div class="flex items-center space-x-4">
          <router-link 
            to="/" 
            class="text-gray-600 dark:text-gray-300 hover:text-primary transition"
            :class="!isScrolled ? 'text-gray-700 dark:text-white' : ''"
          >
            {{ t('nav.home') }}
          </router-link>

          <router-link 
            to="/features" 
            class="text-gray-600 dark:text-gray-300 hover:text-primary transition"
            :class="!isScrolled ? 'text-gray-700 dark:text-white' : ''"
          >
            {{ t('nav.features') }}
          </router-link>
          
          <router-link 
            v-if="!isAuthenticated" 
            to="/contact" 
            class="text-gray-600 dark:text-gray-300 hover:text-primary transition"
            :class="!isScrolled ? 'text-gray-700 dark:text-white' : ''"
          >
            {{ t('nav.contact') }}
          </router-link>

          <router-link 
            to="/faq" 
            class="text-gray-600 dark:text-gray-300 hover:text-primary transition"
            :class="!isScrolled ? 'text-gray-700 dark:text-white' : ''"
          >
            {{ t('nav.faq') }}
          </router-link>
          
          <router-link 
            v-if="!isAuthenticated" 
            to="/login" 
            class="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition"
          >
            {{ t('nav.login') }}
          </router-link>
          
          <router-link 
            v-else 
            to="/dashboard" 
            class="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition"
          >
            {{ t('nav.dashboard') }}
          </router-link>

          <div class="flex items-center border-l pl-4 ml-4 space-x-2 border-gray-300 dark:border-gray-600">
            <button 
              @click="themeStore.toggleDark()" 
              class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <i :class="themeStore.isDark ? 'pi pi-sun' : 'pi pi-moon'" class="text-lg"></i>
            </button>
            
            <button 
              @click="toggleLanguage" 
              class="p-2 font-bold text-sm hover:text-primary transition"
            >
              {{ locale.toUpperCase() }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>