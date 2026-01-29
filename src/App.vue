<script setup>
import Navbar from './components/Navbar.vue';
import ChatWidget from './components/ChatWidget.vue';
import Toast from 'primevue/toast';
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 flex flex-col">
    <Navbar />
    
    <main class="flex-grow pt-16">
      <router-view />
    </main>
    
    <Toast />
    
    <ChatWidget />
  </div>
</template>