<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center py-12 sm:px-6 lg:px-8">
    <div class="w-full max-w-3xl">
      <div class="text-center mb-6">
        <h2 class="text-3xl font-extrabold text-gray-900">Mi Perfil</h2>
        <p class="text-sm text-gray-600 mt-2">Información de tu cuenta</p>
      </div>

      <div class="bg-white py-8 px-6 shadow-xl sm:rounded-xl sm:px-10 border border-gray-100">
        <div v-if="loading" class="text-center text-gray-500">Cargando...</div>

        <div v-else>
          <div class="flex items-center gap-4">
            <div class="h-16 w-16 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">{{ initials }}</div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ user.first_name }} {{ user.last_name }}</h3>
              <p class="text-sm text-gray-600">{{ user.email }}</p>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <strong class="block text-xs text-gray-500">Creado</strong>
              <div class="mt-1">{{ formatDate(user.createdAt) }}</div>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <strong class="block text-xs text-gray-500">Última actualización</strong>
              <div class="mt-1">{{ formatDate(user.updatedAt) }}</div>
            </div>
          </div>

          <div class="mt-6 flex gap-3">
            <button @click="onLogout" class="py-2 px-4 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition">Cerrar sesión</button>
            <router-link to="/" class="py-2 px-4 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100 transition">Volver</router-link>
          </div>

          <div v-if="error" class="mt-4 text-sm text-red-600">{{ error }}</div>
        </div>
      </div>

      <!-- Historial de Pedidos -->
      <div class="mt-8">
        <h3 class="text-xl font-bold text-gray-900 mb-4 px-2">Historial de Pedidos</h3>
        
        <div v-if="loadingOrders" class="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
          <p class="mt-2 text-gray-500">Cargando pedidos...</p>
        </div>

        <div v-else-if="orders.length === 0" class="bg-white py-12 px-6 shadow-sm rounded-xl border border-gray-100 text-center">
          <div class="text-5xl mb-4">📦</div>
          <h4 class="text-lg font-medium text-gray-900">No tienes pedidos aún</h4>
          <p class="text-gray-500 mt-1">Cuando realices una compra, aparecerá aquí.</p>
          <router-link to="/catalog" class="mt-6 inline-block text-indigo-600 font-semibold hover:underline">Ir a comprar</router-link>
        </div>

        <div v-else class="space-y-4">
          <div v-for="order in orders" :key="order.id" class="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
            <div class="p-4 sm:p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <div>
                <p class="text-xs text-gray-500 uppercase tracking-wider font-semibold">Pedido #{{ order.id.slice(0, 8) }}</p>
                <p class="text-sm font-medium text-gray-900">{{ formatDate(order.createdAt) }}</p>
              </div>
              <div class="text-right">
                <p class="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total</p>
                <p class="text-lg font-bold text-indigo-600">${{ Number(order.totalAmount || 0).toFixed(2) }}</p>
              </div>
            </div>
            
            <div class="p-4 sm:p-6">
              <div class="flow-root">
                <ul role="list" class="-my-4 divide-y divide-gray-100">
                  <li v-for="item in order.orderItems" :key="item.id" class="py-4 flex items-center">
                    <div class="flex-1">
                      <h4 class="text-sm font-medium text-gray-900">{{ item.product?.name || 'Producto eliminado' }}</h4>
                      <p class="text-xs text-gray-500">Cantidad: {{ item.quantity }} × ${{ Number(item.unitPrice).toFixed(2) }}</p>
                    </div>
                    <div class="text-right">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Pagado
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import auth from '../services/auth'
import ordersApi from '../services/orders'

const router = useRouter()
const user = ref({})
const orders = ref([])
const loading = ref(true)
const loadingOrders = ref(false)
const error = ref('')

const initials = computed(() => {
  if (!user.value.first_name) return 'U'
  return (user.value.first_name[0] || '') + (user.value.last_name?.[0] || '')
})

function formatDate(d) {
  if (!d) return '-'
  try {
    return new Date(d).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (e) {
    return d
  }
}

async function fetchProfile() {
  loading.value = true
  error.value = ''
  try {
    user.value = await auth.me()
    fetchOrders()
  } catch (e) {
    error.value = e.response?.data?.message || e.message || 'Error cargando perfil.'
  } finally {
    loading.value = false
  }
}

async function fetchOrders() {
  loadingOrders.value = true
  try {
    const data = await ordersApi.getMyOrders()
    orders.value = data.orders || []
  } catch (e) {
    console.error('Error fetching orders:', e)
  } finally {
    loadingOrders.value = false
  }
}

function onLogout() {
  auth.logout()
  router.push('/login')
}

onMounted(() => {
  fetchProfile()
})
</script>

<style scoped></style>
