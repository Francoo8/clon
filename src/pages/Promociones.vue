<template>
  <section class="min-h-screen bg-gray-50 p-8">
    <h1 class="text-3xl font-bold text-center text-red-600 mb-8">
      Promociones 🍔
    </h1>

    <!-- 🔹 Listado de promociones -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="promo in promociones"
        :key="promo.id"
        class="bg-white rounded-xl shadow-md p-5 flex flex-col"
      >
        <img
          :src="promo.imagen_url"
          alt="Promoción"
          class="rounded-lg h-48 w-full object-cover mb-4"
        />
        <h2 class="text-xl font-semibold text-gray-800">{{ promo.titulo }}</h2>
        <p class="text-gray-600 mt-2 flex-1">{{ promo.descripcion }}</p>
        <p class="text-lg font-bold text-red-600 mt-3">Bs. {{ promo.precio }}</p>

        <!-- 🔸 Botones solo visibles para el admin -->
        <div v-if="esAdmin" class="flex justify-between mt-4">
          <button
            @click="editarPromo(promo)"
            class="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
          >
            Editar
          </button>
          <button
            @click="eliminarPromo(promo.id)"
            class="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- 🔹 Formulario solo visible para admin -->
    <div
      v-if="esAdmin"
      class="mt-10 max-w-lg mx-auto bg-white p-6 rounded-xl shadow-md"
    >
      <h2 class="text-2xl font-bold mb-4">
        {{ promoSeleccionada ? "Editar Promoción" : "Nueva Promoción" }}
      </h2>

      <form @submit.prevent="guardarPromo" class="flex flex-col gap-3">
        <input
          v-model="form.titulo"
          type="text"
          placeholder="Título"
          class="border rounded px-3 py-2"
          required
        />
        <textarea
          v-model="form.descripcion"
          placeholder="Descripción"
          class="border rounded px-3 py-2"
          required
        ></textarea>
        <input
          v-model="form.imagen_url"
          type="text"
          placeholder="URL de la imagen"
          class="border rounded px-3 py-2"
          required
        />
        <input
          v-model.number="form.precio"
          type="number"
          placeholder="Precio (Bs.)"
          class="border rounded px-3 py-2"
          required
        />

        <button
          type="submit"
          class="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          {{ promoSeleccionada ? "Actualizar" : "Crear" }}
        </button>

        <button
          v-if="promoSeleccionada"
          @click="cancelarEdicion"
          type="button"
          class="bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 transition"
        >
          Cancelar
        </button>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

// ✅ Definición de tipo para las promociones
interface Promocion {
  id: number;
  titulo: string;
  descripcion: string;
  imagen_url: string;
  precio: number;
}

const router = useRouter();
const API_URL = import.meta.env.VITE_API_URL;

// ✅ Variables reactivas con tipado
const promociones = ref<Promocion[]>([]);
const esAdmin = ref(false);
const promoSeleccionada = ref<Promocion | null>(null);

const form = ref<Omit<Promocion, "id">>({
  titulo: "",
  descripcion: "",
  imagen_url: "",
  precio: 0,
});

// 🔹 Verificar si el usuario es admin
onMounted(() => {
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");

  if (!token) {
    router.push("/inicioSesion");
    return;
  }

  // ✅ Si el correo es exactamente este, puede editar
  esAdmin.value = email === "admin@gmail.com";
  obtenerPromociones();
});

// 🔹 Obtener promociones
const obtenerPromociones = async () => {
  try {
    const res = await axios.get<Promocion[]>(`${API_URL}/api/promociones`);
    promociones.value = res.data;
  } catch (err) {
    console.error("Error al obtener promociones:", err);
  }
};

// 🔹 Guardar o editar promoción
const guardarPromo = async () => {
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  try {
    if (promoSeleccionada.value) {
      await axios.put(
        `${API_URL}/api/promociones/${promoSeleccionada.value.id}`,
        form.value,
        { headers }
      );
      alert("✅ Promoción actualizada");
    } else {
      await axios.post(`${API_URL}/api/promociones`, form.value, { headers });
      alert("✅ Promoción creada");
    }

    form.value = { titulo: "", descripcion: "", imagen_url: "", precio: 0 };
    promoSeleccionada.value = null;
    obtenerPromociones();
  } catch (err) {
    console.error(err);
    alert("❌ Error al guardar la promoción");
  }
};

// 🔹 Editar promoción
const editarPromo = (promo: Promocion) => {
  promoSeleccionada.value = promo;
  form.value = {
    titulo: promo.titulo,
    descripcion: promo.descripcion,
    imagen_url: promo.imagen_url,
    precio: promo.precio,
  };
};

// 🔹 Eliminar promoción
const eliminarPromo = async (id: number) => {
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  if (!confirm("¿Seguro que deseas eliminar esta promoción?")) return;

  try {
    await axios.delete(`${API_URL}/api/promociones/${id}`, { headers });
    alert("🗑️ Promoción eliminada");
    obtenerPromociones();
  } catch (err) {
    console.error(err);
    alert("❌ Error al eliminar promoción");
  }
};

// 🔹 Cancelar edición
const cancelarEdicion = () => {
  promoSeleccionada.value = null;
  form.value = { titulo: "", descripcion: "", imagen_url: "", precio: 0 };
};
</script>

<style scoped>
/* Opcional: estilos personalizados */
</style>
