<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
      <h2 class="text-2xl font-bold text-center text-red-600 mb-6">
        Iniciar Sesión 🔐
      </h2>

      <form @submit.prevent="loginUsuario" class="flex flex-col gap-4">
        <input
          v-model="email"
          type="email"
          placeholder="Correo electrónico"
          class="border rounded px-4 py-2"
          required
        />

        <input
          v-model="password"
          type="password"
          placeholder="Contraseña"
          class="border rounded px-4 py-2"
          required
        />

        <button
          type="submit"
          class="bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
        >
          Iniciar sesión
        </button>
      </form>

      <p class="text-sm text-center text-gray-500 mt-4">
        ¿No tienes cuenta?
        <router-link to="/register" class="text-red-600 hover:underline">
          Regístrate aquí
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const email = ref("");
const password = ref("");
const API_URL = "http://localhost:3000/api";

const loginUsuario = async () => {
  try {
    const res = await axios.post(`${API_URL}/login`, {
      email: email.value,
      password: password.value,
    });

    // Si el login es exitoso, guarda los datos
    const token = res.data.token;
    localStorage.setItem("token", token);
    localStorage.setItem("email", email.value);

    alert("✅ Inicio de sesión exitoso");
    router.push("/promociones"); 
  } catch (err: any) {
    console.error(err);
    alert("❌ Error al iniciar sesión. Verifica tus credenciales.");
  }
};
</script>
