import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Login from '@/pages/login.vue'
import Register from '@/pages/register.vue'
import InicioSesion from '@/pages/inicioSesion.vue'
import Promociones from '@/pages/Promociones.vue'
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  
  { path: '/register', component: Register }
  ,
  { path: '/inicioSesion', component: InicioSesion }
  ,
  { path: '/promociones', component: Promociones },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
