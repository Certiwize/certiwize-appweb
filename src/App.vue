<script setup>
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import ChatWidget from './components/ChatWidget.vue';
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 flex flex-col">
    <Navbar />
    
    <main class="flex-grow pt-16">
      <router-view />
    </main>
    
    <Footer />
    
    <ChatWidget />
  </div>
</template>