<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

interface Promocion {
  id: number
  titulo: string
  descripcion: string
  imagen_url: string
  precio: number
}

// 🔹 Variables y configuración
const promociones = ref<Promocion[]>([])
const titulo = ref('')
const descripcion = ref('')
const imagen_url = ref('')
const precio = ref('')
const mensaje = ref('')
const esAdmin = ref(false)
const router = useRouter()

const API_URL = import.meta.env.VITE_API_URL
const token = localStorage.getItem('token')
const email = localStorage.getItem('email')

// 🔹 Cargar promociones
const cargarPromociones = async () => {
  try {
    const res = await axios.get<Promocion[]>(`${API_URL}/api/promociones`)
    promociones.value = res.data
  } catch (err) {
    console.error('Error al obtener promociones:', err)
    mensaje.value = '❌ Error al cargar promociones'
  }
}

// 🔹 Agregar promoción
const agregarPromocion = async () => {
  if (!esAdmin.value) {
    mensaje.value = '🚫 No tienes permisos para agregar promociones'
    return
  }

  try {
    await axios.post(
      `${API_URL}/api/promociones`,
      {
        titulo: titulo.value,
        descripcion: descripcion.value,
        imagen_url: imagen_url.value,
        precio: precio.value
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    mensaje.value = '✅ Promoción agregada correctamente'
    titulo.value = ''
    descripcion.value = ''
    imagen_url.value = ''
    precio.value = ''
    cargarPromociones()
  } catch (err) {
    console.error(err)
    mensaje.value = '❌ Error al agregar promoción'
  }
}

// 🔹 Eliminar promoción
const eliminarPromocion = async (id: number) => {
  if (!esAdmin.value) {
    mensaje.value = '🚫 No tienes permisos para eliminar promociones'
    return
  }

  if (!confirm('¿Seguro que deseas eliminar esta promoción?')) return

  try {
    await axios.delete(`${API_URL}/api/promociones/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    mensaje.value = '🗑️ Promoción eliminada correctamente'
    cargarPromociones()
  } catch (err) {
    console.error(err)
    mensaje.value = '❌ Error al eliminar promoción'
  }
}

// 🔹 Verificar si el usuario es admin
onMounted(() => {
  if (!token) {
    router.push('/inicioSesion')
    return
  }

  esAdmin.value = email === 'admin@gmail.com'
  cargarPromociones()
})
</script>

<template>
  <div class="p-6 max-w-3xl mx-auto">
    <h2 class="text-3xl font-bold mb-6 text-center text-red-600">Panel de Administración 🛠️</h2>

    <div v-if="esAdmin">
      <div class="mb-6 flex flex-wrap gap-2">
        <input
          v-model="titulo"
          placeholder="Título"
          class="border px-3 py-1 rounded w-full sm:w-auto"
        />
        <input
          v-model="descripcion"
          placeholder="Descripción"
          class="border px-3 py-1 rounded w-full sm:w-auto"
        />
        <input
          v-model="imagen_url"
          placeholder="URL Imagen"
          class="border px-3 py-1 rounded w-full sm:w-auto"
        />
        <input
          v-model="precio"
          placeholder="Precio"
          type="number"
          class="border px-3 py-1 rounded w-full sm:w-auto"
        />
        <button
          @click="agregarPromocion"
          class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Agregar
        </button>
      </div>
    </div>

    <p class="mb-4 text-sm text-center text-red-600 font-semibold">{{ mensaje }}</p>

    <table class="w-full border rounded-lg shadow-sm overflow-hidden">
      <thead class="bg-gray-100">
        <tr>
          <th class="border px-3 py-2">ID</th>
          <th class="border px-3 py-2">Título</th>
          <th class="border px-3 py-2">Precio</th>
          <th class="border px-3 py-2">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="promo in promociones"
          :key="promo.id"
          class="hover:bg-gray-50 transition"
        >
          <td class="border px-3 py-2 text-center">{{ promo.id }}</td>
          <td class="border px-3 py-2">{{ promo.titulo }}</td>
          <td class="border px-3 py-2 text-center">Bs. {{ promo.precio }}</td>
          <td class="border px-3 py-2 text-center">
            <button
              v-if="esAdmin"
              @click="eliminarPromocion(promo.id)"
              class="text-red-600 hover:text-red-800 transition"
            >
              Eliminar
            </button>
            <span v-else class="text-gray-400 text-sm">Sin permisos</span>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="!esAdmin" class="text-center text-gray-500 mt-6">
      🚫 No tienes permisos para administrar promociones
    </div>
  </div>
</template>
