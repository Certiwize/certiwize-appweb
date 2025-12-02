import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth'; // Import du store
import Home from '../views/Home.vue';
import Dashboard from '../views/Dashboard.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/features', component: () => import('../views/Features.vue') },
  { path: '/contact', component: () => import('../views/Contact.vue') },
  { path: '/faq', component: () => import('../views/FAQ.vue') },
  { path: '/login', component: () => import('../views/Login.vue') },
  { 
    path: '/dashboard', 
    component: Dashboard,
    meta: { requiresAuth: true } // Marqueur pour protection
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard global
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.user) {
    // Si la route demande l'auth et qu'on n'a pas d'user -> Login
    next('/login');
  } else {
    next();
  }
});

export default router;