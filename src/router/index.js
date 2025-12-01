import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Dashboard from '../views/Dashboard.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/contact', component: () => import('../views/Contact.vue') }, // Lazy loading
  { path: '/login', component: () => import('../views/Login.vue') },
  { path: '/dashboard', component: Dashboard }, // Ajoutera une 'meta: { requiresAuth: true }' plus tard
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;