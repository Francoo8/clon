<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-xl font-semibold mb-4">Iniciar Sesión</h2>

    <form @submit.prevent="loginUsuario" class="space-y-4">
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
        required
      />

      <input
        v-model="password"
        type="password"
        placeholder="Contraseña"
        class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
        required
      />

      <button
        type="submit"
        class="w-full py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition"
      >
        Iniciar Sesión
      </button>
    </form>

    <div class="mt-6 text-center">
      <p class="text-sm text-gray-600">
        ¿No tienes cuenta? 
        <a 
          @click="router.push('/register')" 
          class="text-red-600 hover:text-red-700 cursor-pointer font-medium"
        >
          Regístrate aquí
        </a>
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
const API_URL = import.meta.env.VITE_API_URL;

const loginUsuario = async () => {
  try {
    const res = await axios.post(`${API_URL}/login`, {
      email: email.value,
      password: password.value,
    });

    // 🔹 Guardar token y email
    const token = res.data.token;
    localStorage.setItem("token", token);
    localStorage.setItem("email", email.value);

    // 🔹 Redirigir según usuario
    if (email.value === "admin@gmail.com") {
      router.push("/admin");
    } else {
      router.push("/promociones");
    }

    alert("✅ Inicio de sesión exitoso");
  } catch (err: any) {
    console.error(err);
    alert("❌ Error al iniciar sesión. Verifica tus credenciales.");
  }
};
</script>