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
