<script lang="ts" setup>
import { ref } from 'vue'

const nombre = ref('')
const email = ref('')
const password = ref('')
const mensaje = ref('')

const registrarUsuario = async () => {
  if (!nombre.value || !email.value || !password.value) {
    mensaje.value = 'Completa todos los campos'
    return
  }

  try {
    const res = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: nombre.value,
        email: email.value,
        password: password.value
      })
    })

    const data = await res.json()
    if (res.ok) {
      mensaje.value = data.message
      // Limpiar campos
      nombre.value = ''
      email.value = ''
      password.value = ''
    } else {
      mensaje.value = data.error || 'Ocurrió un error'
    }
  } catch (err) {
    mensaje.value = 'No se pudo conectar al servidor'
    console.error(err)
  }
}
</script>

<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
    <h2 class="text-xl font-semibold mb-4">Registro de usuario</h2>

    <input v-model="nombre" type="text" placeholder="Nombre"
      class="w-full px-4 py-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"/>
    
    <input v-model="email" type="email" placeholder="Email"
      class="w-full px-4 py-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"/>
    
    <input v-model="password" type="password" placeholder="Contraseña"
      class="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"/>
    
    <button @click="registrarUsuario"
      class="w-full py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700">
      Registrarse
    </button>

    <p class="mt-4 text-sm text-red-600">{{ mensaje }}</p>
  </div>
</template>
