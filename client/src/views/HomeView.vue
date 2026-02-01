<template>
  <div class="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
    
    <nav class="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            T
          </div>
          <span class="text-2xl font-bold tracking-tight text-gray-900">SleiStore</span>
        </div>

        <div class="flex items-center gap-4">
          <template v-if="!isAuth">
            <router-link to="/login" class="text-sm font-medium text-gray-600 hover:text-indigo-600 transition">
              Iniciar Sesión
            </router-link>
            <router-link to="/register" class="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-indigo-600 transition shadow-lg shadow-gray-200">
              Registrarse
            </router-link>
          </template>
          <template v-else>
            <router-link to="/manage" class="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition">
              Añadir Productos
            </router-link>
            <router-link to="/profile" class="text-sm font-medium text-gray-600 hover:text-indigo-600 transition">
              Mi Perfil
            </router-link>
            <router-link to="/checkout" class="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
              Mi Carrito
            </router-link>
          </template>
        </div>
      </div>
    </nav>

    <header class="flex-1 flex items-center justify-center bg-gray-50 relative overflow-hidden">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
         <div class="absolute top-20 right-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
         <div class="absolute top-40 right-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style="animation-delay: 2s"></div>
      </div>

      <div class="max-w-4xl mx-auto px-6 py-24 text-center relative z-10">
        <h1 class="text-5xl md:text-7xl font-black tracking-tight mb-8 text-gray-900 leading-tight">
          Tu tienda favorita, <br>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            ahora digital.
          </span>
        </h1>
        
        <p class="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          Accede a un catálogo exclusivo de productos variados. 
          {{ isAuth ? 'Gestiona tus pedidos y revisa tu perfil.' : 'Inicia sesión para gestionar tus pedidos y ver ofertas.' }}
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link :to="isAuth ? '/catalog' : '/login'" class="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all">
            {{ isAuth ? 'Explorar Catálogo' : 'Ingresar a la Tienda' }}
          </router-link>
          <router-link v-if="isAuth" to="/profile" class="px-8 py-4 bg-white text-indigo-600 border border-indigo-100 rounded-xl font-bold text-lg shadow-sm hover:bg-indigo-50 hover:-translate-y-1 transition-all">
            Ver Perfil
          </router-link>
        </div>

        <div class="mt-12 pt-8 border-t border-gray-200 flex flex-wrap justify-center gap-8 text-gray-400 font-medium text-sm">
          <div class="flex items-center gap-2">
            <span>🔒</span> Pagos Seguros
          </div>
          <div class="flex items-center gap-2">
            <span>💬</span> Soporte 24/7
          </div>
        </div>
      </div>
    </header>

    <footer class="bg-white border-t border-gray-100 py-8">
      <div class="max-w-7xl mx-auto px-6 text-center text-gray-400 text-sm">
        <p>&copy; 2026 SleiStore. Todos los derechos reservados.</p>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import auth from '../services/auth'

const isAuth = ref(false)

onMounted(() => {
  isAuth.value = auth.isAuthenticated()
})
</script>