<script lang="ts" setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const nombre = ref('')
const email = ref('')
const password = ref('')
const mensaje = ref('')
const router = useRouter()

const registrarUsuario = async () => {
  if (!nombre.value || !email.value || !password.value) {
    mensaje.value = 'Completa todos los campos'
    return
  }

  try {
    // ✅ URL del backend (desde el .env)
    const api = import.meta.env.VITE_API_URL

    // ✅ Enviar datos al backend con Axios
    const res = await axios.post(`${api}/api/register`, {
      nombre: nombre.value,
      email: email.value,
      password: password.value,
    })

    mensaje.value = res.data.message || 'Usuario registrado correctamente'

    // ✅ Limpiar campos
    nombre.value = ''
    email.value = ''
    password.value = ''

    // ✅ Redirigir al login después del registro
    setTimeout(() => router.push('/inicioSesion'), 1500)
  } catch (err: any) {
    console.error(err)
    mensaje.value =
      err.response?.data?.error || 'Error al conectar con el servidor'
  }
}
</script>

<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-xl font-semibold mb-4">Registro de usuario</h2>

    <input
      v-model="nombre"
      type="text"
      placeholder="Nombre"
      class="w-full px-4 py-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
    />

    <input
      v-model="email"
      type="email"
      placeholder="Email"
      class="w-full px-4 py-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
    />

    <input
      v-model="password"
      type="password"
      placeholder="Contraseña"
      class="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
    />

    <button
      @click="registrarUsuario"
      class="w-full py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700"
    >
      Registrarse
    </button>

    <p class="mt-4 text-sm text-red-600">{{ mensaje }}</p>
  </div>
</template>
