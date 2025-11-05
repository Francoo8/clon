/**
 * el guard.ts es un archivo que funciona como un middleware ,
 * esta verificando los accesos a cosas internas del dash
 */
import type { Router } from "vue-router";
import { useAuthStore } from "@/store/authStore";

export default function registerGuards(router: Router) {
  router.beforeEach((to, _, next) => {
    const authStore = useAuthStore();
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      next({ path: "/" }); // redirige a login
    } else {
      next();
    }
  });
}