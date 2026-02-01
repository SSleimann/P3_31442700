<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    
    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
      <div class="mx-auto h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl mb-4 shadow-lg">
        S
      </div>
      <h2 class="text-3xl font-extrabold text-gray-900">Crear cuenta nueva</h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-gray-100">
        
        <form class="space-y-6" @submit.prevent="onSubmit">
          
          <div class="flex gap-4">
            <div class="w-1/2">
              <label class="block text-sm font-medium text-gray-700">Nombre</label>
              <input v-model="firstName" type="text" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div class="w-1/2">
              <label class="block text-sm font-medium text-gray-700">Apellido</label>
              <input v-model="lastName" type="text" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input v-model="email" type="email" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Contraseña</label>
            <input v-model="password" type="password" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>

          <button type="submit" class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition transform hover:-translate-y-0.5">
            Registrarse
          </button>
        </form>

        <div v-if="error" class="mt-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm">
          {{ error }}
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import auth from '../services/auth'

const router = useRouter()
// Variables reactivas separadas
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const error = ref('')

async function onSubmit() {
  error.value = ''
  try {
    // Enviamos el objeto tal cual lo espera tu backend: req.body
    await auth.register({ 
      firstName: firstName.value, 
      lastName: lastName.value, 
      email: email.value, 
      password: password.value 
    })
    // Si todo sale bien, redirigimos al login para que entre
    router.push('/login')
  } catch (e) {
    // Capturamos el mensaje que envía tu backend: res.status(400).json({ message: "..." })
    error.value = e.response?.data?.message || 'Error al registrarse.'
  }
}
</script>