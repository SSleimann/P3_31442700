<template>
  <div class="min-h-screen bg-gray-50 pb-12">
    <!-- Navbar unificada -->
    <nav class="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <router-link to="/" class="flex items-center gap-2">
          <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">T</div>
          <span class="text-xl font-bold text-gray-900">SleiStore</span>
        </router-link>
        <div class="flex items-center gap-4">
          <router-link to="/catalog" class="text-sm font-medium text-gray-600 hover:text-indigo-600">Catálogo</router-link>
          <router-link to="/manage" class="text-sm font-medium text-gray-600 hover:text-indigo-600">Añadir Productos</router-link>
          <router-link to="/profile" class="text-sm font-medium text-gray-600 hover:text-indigo-600">Mi Perfil</router-link>
        </div>
      </div>
    </nav>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-extrabold text-gray-900 mb-8">Finalizar Compra</h1>

      <!-- Debug info (puedes borrar esto luego) -->
      <div v-if="loading" class="mb-4 p-3 bg-blue-50 text-blue-700 text-xs rounded-lg border border-blue-100">
        ⌛ Enviando petición al servidor... por favor espera.
      </div>

      <div v-if="cart.items.length === 0 && !orderSuccess" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
        <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">🛒</div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h2>
        <p class="text-gray-500 mb-6">Parece que aún no has añadido nada a tu selección antes de proceder al pago.</p>
        <router-link to="/catalog" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition">
          Volver al Catálogo
        </router-link>
      </div>

      <div v-else-if="orderSuccess" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
        <div class="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">✅</div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">¡Compra exitosa!</h2>
        <p class="text-gray-500 mb-6">Tu pedido ha sido procesado correctamente.</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link to="/catalog" class="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition">Seguir comprando</router-link>
          <router-link to="/profile" class="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition">Ver mis pedidos</router-link>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Izquierda: Formulario de Pago y Resumen mobile -->
        <div class="lg:col-span-7 space-y-6">
          <!-- Datos de Pago -->
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span class="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm">1</span>
              Método de Pago
            </h2>
            
            <form @submit.prevent="handleCheckout" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre en la Tarjeta</label>
                <input 
                  v-model="payment.fullName" 
                  type="text" 
                  placeholder="JUAN PEREZ"
                  required
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Número de Tarjeta</label>
                <input 
                  v-model="payment.cardNumber" 
                  type="text" 
                  placeholder="4242 4242 4242 4242"
                  required
                  maxlength="16"
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>
              
              <div class="grid grid-cols-3 gap-4">
                <div class="col-span-1">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Mes Exp.</label>
                  <input 
                    v-model="payment.expirationMonth" 
                    type="text" 
                    placeholder="MM"
                    required
                    maxlength="2"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                </div>
                <div class="col-span-1">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Año Exp.</label>
                  <input 
                    v-model="payment.expirationYear" 
                    type="text" 
                    placeholder="YYYY"
                    required
                    maxlength="4"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                </div>
                <div class="col-span-1">
                  <label class="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                  <input 
                    v-model="payment.cvv" 
                    type="password" 
                    placeholder="***"
                    required
                    maxlength="3"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <div v-if="error" class="p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100 flex gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
                {{ error }}
              </div>

              <button 
                type="submit" 
                :disabled="loading"
                class="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-indigo-600 transition shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
              >
                <span v-if="loading">Procesando...</span>
                <span v-else>Confirmar Pago de ${{ cart.getTotalPrice().toFixed(2) }}</span>
              </button>
            </form>
          </div>

          <!-- Items del Carrito -->
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span class="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm">2</span>
              Revisar Productos
            </h2>
            <div class="divide-y divide-gray-100">
              <div v-for="item in cart.items" :key="item.id" class="py-4 flex flex-col sm:flex-row sm:items-center gap-4">
                <div class="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center text-2xl">📦</div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-bold text-gray-900 truncate">{{ item.name }}</h3>
                  <div class="flex items-center gap-2">
                    <p class="text-indigo-600 font-bold text-sm">${{ item.price }}</p>
                    <span class="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">Stock: {{ item.stock }}</span>
                  </div>
                </div>
                
                <!-- Controles de Edición -->
                <div class="flex items-center gap-4">
                  <div class="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                    <button 
                      type="button"
                      @click="cart.updateQuantity(item.id, item.quantity - 1)" 
                      class="px-2 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                      </svg>
                    </button>
                    <span class="px-3 py-1 text-sm font-bold w-10 text-center">{{ item.quantity }}</span>
                    <button 
                      type="button"
                      @click="cart.updateQuantity(item.id, item.quantity + 1)" 
                      class="px-2 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  
                  <button 
                    type="button"
                    @click="cart.removeItem(item.id)" 
                    class="p-2 text-gray-400 hover:text-red-500 transition"
                    title="Eliminar producto"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                <div class="text-right hidden sm:block min-w-[80px]">
                  <p class="font-bold text-gray-900">${{ (item.price * item.quantity).toFixed(2) }}</p>
                </div>
              </div>
            </div>
            
            <div class="mt-4 pt-4 border-t border-gray-100 flex justify-end">
              <button 
                type="button"
                @click="cart.clear()" 
                class="text-sm font-medium text-red-500 hover:text-red-700 flex items-center gap-1 transition"
              >
                Vaciar Carrito
              </button>
            </div>
          </div>
        </div>

        <!-- Derecha: Resumen de Totales -->
        <div class="lg:col-span-5">
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h2 class="text-lg font-bold text-gray-900 mb-6">Resumen del pedido</h2>
            <div class="space-y-4 mb-6">
              <div class="flex justify-between text-gray-600">
                <span>Subtotal ({{ cart.getTotalItems() }} items)</span>
                <span>${{ cart.getTotalPrice().toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Impuestos (estimado)</span>
                <span>$0.00</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Envío</span>
                <span class="text-green-500 font-medium">Gratis</span>
              </div>
              <div class="border-t border-gray-100 pt-4 flex justify-between">
                <span class="text-lg font-bold text-gray-900">Total</span>
                <span class="text-3xl font-black text-indigo-600">${{ cart.getTotalPrice().toFixed(2) }}</span>
              </div>
            </div>
            
            <div class="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
              <p class="text-xs text-indigo-700 leading-relaxed font-medium">
                🔒 Tu pago está protegido. Al confirmar, aceptas nuestras condiciones de venta y políticas de privacidad.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import cart from '../services/cart'
import auth from '../services/auth'

const loading = ref(false)
const error = ref('')
const orderSuccess = ref(false)
const orderId = ref('')

const payment = reactive({
  cardNumber: '',
  expirationMonth: '',
  expirationYear: '',
  cvv: '',
  fullName: '', 
  currency: 'USD'
})

async function handleCheckout() {
  loading.value = true
  error.value = ''
  
  try {
    // 1. Preparar items para el backend
    const items = cart.items.map(item => ({
      productId: item.id,
      quantity: item.quantity
    }))

    // 2. Llamada a la API de órdenes
    const response = await auth.api.post('/orders', {
      items,
      paymentMethod: 'CreditCard',
      paymentDetails: { ...payment }
    })

    // 3. Manejo de éxito
    if (response.data.status === 'success') {
      orderSuccess.value = true
      cart.clear() // Limpiar el carrito después de la compra
    }
  } catch (err) {
    // 4. Manejo de errores específicos (Stock, Pago, etc)
    const serverMessage = err.response?.data?.message
    const status = err.response?.status
    
    if (status === 403) {
      error.value = 'Sesión inválida o expirada (403). Intenta cerrar sesión y volver a entrar.'
    } else if (serverMessage?.includes('stock')) {
      error.value = 'Lo sentimos, no hay stock suficiente para uno de tus productos.'
    } else if (serverMessage?.includes('payment')) {
      error.value = 'Error al procesar el pago. Por favor, verifica los datos de tu tarjeta.'
    } else {
      error.value = serverMessage || 'Ocurrió un error inesperado al procesar tu pedido.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Estilos adicionales si fueran necesarios */
</style>


<style scoped>
/* Tailwind maneja los estilos */
</style>
