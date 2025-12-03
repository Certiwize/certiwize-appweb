import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import Home from '../views/Home.vue';
import Dashboard from '../views/Dashboard.vue';
import Login from '../views/Login.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/features', component: () => import('../views/Features.vue') },
  { path: '/contact', component: () => import('../views/Contact.vue') },
  { path: '/faq', component: () => import('../views/FAQ.vue') },
  { path: '/login', component: Login },
  { path: '/register', component: () => import('../views/Register.vue') },
  { path: '/forgot-password', component: () => import('../views/ForgotPassword.vue') },
  { 
    path: '/update-password', 
    component: () => import('../views/UpdatePassword.vue'), 
    // CORRECTION : On retire 'meta: { requiresAuth: true }' ici
    // Supabase va connecter l'utilisateur via le lien URL, mais le routeur
    // doit laisser passer l'utilisateur avant que la connexion ne soit effective.
  },
  { 
    path: '/settings', 
    component: () => import('../views/Settings.vue'), 
    meta: { requiresAuth: true } 
  },
  { 
    path: '/dashboard', 
    component: Dashboard,
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.user) {
    next('/login');
  } else {
    next();
  }
});

export default router;