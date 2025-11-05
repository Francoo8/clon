<script lang="ts" setup>
import { ref } from 'vue'

// Estado de los modales
const showLogin = ref(false)
const showRegister = ref(false)

// Datos de ejemplo
const categories = [
  'Pizzas',
  'Hamburguesas',
  'Sushi',
  'Empanadas',
  'Cafetería',
  'Postres',
]

const restaurants = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  name: `Restaurante ${i + 1}`,
  rating: (4 + (i % 2) * 0.3).toFixed(1),
  delivery: `${20 + i * 5}–${30 + i * 5} min`,
  price: i % 3 === 0 ? '$' : i % 3 === 1 ? '$$' : '$$$',
  img: `https://picsum.photos/seed/py${i}/400/300`,
}))

// Datos del formulario
const loginData = ref({ email: '', password: '' })
const registerData = ref({ name: '', email: '', password: '' })

// Funciones de ejemplo
const handleLogin = () => {
  alert(`Inicio de sesión de: ${loginData.value.email}`)
  showLogin.value = false
}

const handleRegister = () => {
  alert(`Usuario registrado: ${registerData.value.name}`)
  showRegister.value = false
}

import { useRouter } from 'vue-router'
const router = useRouter()
const irARegister = () => router.push('/register')

const irAInicioSesion = () => {
  router.push('/inicioSesion')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-slate-800">
    <!-- HEADER -->
    <header class="bg-white shadow-sm sticky top-0 z-30">
      <div class="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <div class="flex items-center gap-4">
          <div class="font-bold text-2xl text-red-600">PEDIDOSYA</div>
          <nav class="hidden md:flex gap-3 text-sm">
            <a class="px-3 py-2 rounded-md hover:bg-red-100">Restaurantes</a>
            <a class="px-3 py-2 rounded-md hover:bg-red-100">Ofertas</a>
            <a class="px-3 py-2 rounded-md hover:bg-red-100">Categorías</a>
          </nav>
        </div>

        <div class="flex-1 px-4">
          <div class="max-w-2xl mx-auto">
            <div class="flex items-center gap-3 bg-gray-100 rounded-full px-3 py-2">
              <input
                class="flex-1 bg-transparent outline-none text-sm"
                placeholder="Buscar restaurante o plato"
              />
              <button class="hover:bg-red-700 text-sm font-medium px-3 py-1 rounded-full bg-red-600 text-white">
                Buscar
              </button>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button
          @click="irAInicioSesion"
          class="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition"
        >
          Iniciar Sesión
        </button>
          <button @click="irARegister" class="px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700">
            Registrarse
          </button>
        </div>
      </div>
    </header>

    <!-- HERO -->
    <section class="bg-red-50 py-8">
      <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        <div class="lg:col-span-2">
          <h1 class="text-3xl sm:text-4xl font-extrabold">
            Pide comida a domicilio de tus restaurantes favoritos
          </h1>
          <p class="mt-2 text-slate-600">
            Encuentra promociones, menús y tiempos de entrega estimados.
          </p>

          <div class="mt-6 flex gap-3">
            <input class="flex-1 rounded-md border px-4 py-3" placeholder="Ingresa tu dirección" />
            <button class="px-4 py-3 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700">Buscar</button>
          </div>

          <div class="mt-6 flex gap-3 flex-wrap">
            <span
              v-for="tag in ['Envío gratis', 'Ofertas', 'Nuevos', 'Top valorados']"
              :key="tag"
              class="text-xs px-3 py-1 bg-white border rounded-full"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <div class="hidden lg:block">
          <div class="rounded-xl overflow-hidden shadow-lg bg-white">
            <img src="https://picsum.photos/seed/pya/640/400" alt="hero" class="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>

    <!-- CATEGORIES -->
    <section class="max-w-7xl mx-auto px-4 py-6">
      <h2 class="text-xl font-semibold mb-4">Categorías populares</h2>
      <div class="grid grid-cols-3 sm:grid-cols-6 gap-4">
        <div
          v-for="c in categories"
          :key="c"
          class="bg-white rounded-lg p-3 flex flex-col items-center gap-2 shadow-sm"
        >
          <div class="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">🍽️</div>
          <div class="text-sm font-medium">{{ c }}</div>
        </div>
      </div>
    </section>

    <!-- RESTAURANTS -->
    <main class="max-w-7xl mx-auto px-4 py-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold">Restaurantes</h3>
        <div class="text-sm text-slate-600">Mostrando {{ restaurants.length }} resultados</div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <article
          v-for="r in restaurants"
          :key="r.id"
          class="bg-white rounded-lg overflow-hidden shadow-md"
        >
          <div class="h-44 overflow-hidden">
            <img :src="r.img" :alt="r.name" class="w-full h-full object-cover" />
          </div>
          <div class="p-4">
            <div class="flex items-center justify-between">
              <h4 class="font-semibold">{{ r.name }}</h4>
              <div class="text-xs px-2 py-1 bg-gray-100 rounded-md">{{ r.price }}</div>
            </div>
            <p class="text-sm text-slate-600 mt-2">{{ r.delivery }} • ⭐ {{ r.rating }}</p>
            <div class="mt-4 flex gap-2">
              <button class="flex-1 px-3 py-2 rounded-md border">Ver menú</button>
              <button class="px-3 py-2 rounded-md bg-red-500 text-white">Pedido rápido</button>
            </div>
          </div>
        </article>
      </div>
    </main>

    <!-- FOOTER -->
    <footer class="bg-white border-t mt-8">
      <div class="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between gap-6">
        <div>
          <div class="font-bold text-xl text-red-600">PEDIDOSYA</div>
          <p class="text-sm text-slate-600 mt-2">Aplicación de ejemplo — solo para fines educativos.</p>
        </div>

        <div class="grid grid-cols-2 gap-4 text-sm text-slate-600">
          <div>
            <div class="font-semibold">Empresa</div>
            <ul class="mt-2">
              <li>Sobre nosotros</li>
              <li>Trabaja con nosotros</li>
            </ul>
          </div>
          <div>
            <div class="font-semibold">Ayuda</div>
            <ul class="mt-2">
              <li>Contacto</li>
              <li>Preguntas frecuentes</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>

    <!-- MODALES -->
    <div v-if="showLogin" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
        <h2 class="text-xl font-semibold mb-4 text-center text-red-600">Iniciar sesión</h2>
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="text-sm font-medium">Correo electrónico</label>
            <input
              v-model="loginData.email"
              type="email"
              class="w-full mt-1 border rounded-md px-3 py-2"
              required
            />
          </div>
          <div>
            <label class="text-sm font-medium">Contraseña</label>
            <input
              v-model="loginData.password"
              type="password"
              class="w-full mt-1 border rounded-md px-3 py-2"
              required
            />
          </div>
          <div class="flex justify-end gap-2">
            <button type="button" @click="showLogin = false" class="px-3 py-2 rounded-md border">
              Cancelar
            </button>
            <button
              type="submit"
              class="px-4 py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showRegister" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
        <h2 class="text-xl font-semibold mb-4 text-center text-red-600">Crear cuenta</h2>
        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label class="text-sm font-medium">Nombre completo</label>
            <input
              v-model="registerData.name"
              type="text"
              class="w-full mt-1 border rounded-md px-3 py-2"
              required
            />
          </div>
          <div>
            <label class="text-sm font-medium">Correo electrónico</label>
            <input
              v-model="registerData.email"
              type="email"
              class="w-full mt-1 border rounded-md px-3 py-2"
              required
            />
          </div>
          <div>
            <label class="text-sm font-medium">Contraseña</label>
            <input
              v-model="registerData.password"
              type="password"
              class="w-full mt-1 border rounded-md px-3 py-2"
              required
            />
          </div>
          <div class="flex justify-end gap-2">
            <button type="button" @click="showRegister = false" class="px-3 py-2 rounded-md border">
              Cancelar
            </button>
            <button
              type="submit"
              class="px-4 py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700"
            >
              Registrarse
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
