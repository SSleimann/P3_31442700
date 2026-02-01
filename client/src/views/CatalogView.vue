<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Navbar simplificada para el catálogo -->
    <nav class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <router-link to="/" class="flex items-center gap-2">
          <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">T</div>
          <span class="text-xl font-bold text-gray-900">SleiStore</span>
        </router-link>
        <div class="flex items-center gap-4">
          <router-link to="/manage" class="text-sm font-medium text-indigo-600 hover:text-indigo-700">Añadir Productos</router-link>
          <router-link to="/profile" class="text-sm font-medium text-gray-600 hover:text-indigo-600">Mi Perfil</router-link>
          <router-link to="/checkout" class="relative px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.532 13 5.338 13H15a1 1 0 000-2H5.414l.5-1.5h8.586l.5-1.5H6.414l-.5-1.5H15a1 1 0 000-2H5.414l-.5-1.5H3z" />
            </svg>
            <span>Carrito</span>
            <span v-if="cart.getTotalItems() > 0" class="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
              {{ cart.getTotalItems() }}
            </span>
          </router-link>
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
      <!-- Sidebar de Filtros -->
      <aside class="w-full md:w-64 space-y-8">
        <div>
          <h3 class="text-lg font-bold text-gray-900 mb-4">Búsqueda</h3>
          <input 
            v-model="filters.name__like" 
            type="text" 
            placeholder="Buscar productos..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm"
            @input="debouncedSearch"
          />
        </div>

        <div>
          <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Categorías</h3>
          <div class="space-y-2">
            <button 
              @click="setCategory(null)"
              :class="[!filters.categoryId ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-600 hover:bg-gray-100']"
              class="w-full text-left px-3 py-2 rounded-lg text-sm transition"
            >
              Todas las categorías
            </button>
            <button 
              v-for="cat in categories" 
              :key="cat.id"
              @click="setCategory(cat.id)"
              :class="[filters.categoryId === cat.id ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-600 hover:bg-gray-100']"
              class="w-full text-left px-3 py-2 rounded-lg text-sm transition"
            >
              {{ cat.name }}
            </button>
          </div>
        </div>

        <div>
          <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Rango de Precio</h3>
          <div class="flex items-center gap-2">
            <input 
              v-model.number="filters.price__gt" 
              type="number" 
              placeholder="Min" 
              class="w-1/2 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <span class="text-gray-400">-</span>
            <input 
              v-model.number="filters.price__lt" 
              type="number" 
              placeholder="Max" 
              class="w-1/2 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <button 
            @click="fetchProducts"
            class="mt-3 w-full py-2 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-200 transition"
          >
            Aplicar Precio
          </button>
        </div>

        <div>
          <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Etiquetas</h3>
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="tag in tags" 
              :key="tag.id"
              @click="toggleTag(tag.id)"
              :class="[selectedTags.includes(tag.id) ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300']"
              class="px-3 py-1.5 rounded-full text-xs font-medium transition"
            >
              {{ tag.name }}
            </button>
          </div>
        </div>
      </aside>

      <!-- Grid de Productos -->
      <main class="flex-1">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-extrabold text-gray-900 leading-none">Productos</h2>
          <p class="text-sm text-gray-500">{{ totalProducts }} resultados encontrados</p>
        </div>

        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 6" :key="i" class="bg-gray-200 animate-pulse h-80 rounded-xl"></div>
        </div>

        <div v-else-if="products.length === 0" class="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-300">
          <p class="text-gray-500 text-lg">No encontramos productos con esos filtros.</p>
          <button @click="resetFilters" class="mt-4 text-indigo-600 font-bold hover:underline">Limpiar todos los filtros</button>
        </div>

        <div v-else>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="prod in products" 
              :key="prod.id" 
              class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group"
            >
              <div class="h-48 bg-gray-100 flex items-center justify-center relative">
                <span class="text-gray-300 text-5xl group-hover:scale-110 transition duration-500">📦</span>
                <div class="absolute top-3 right-3 flex flex-col items-end gap-1">
                  <span v-if="prod.stock > 0" class="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter">
                    Disponible ({{ prod.stock }})
                  </span>
                  <span v-else class="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter">Sin Stock</span>
                </div>
              </div>
              <div class="p-5">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-[10px] uppercase font-bold text-indigo-500 tracking-wider transition group-hover:text-indigo-600">
                    {{ prod.category?.name || 'Producto' }}
                  </span>
                </div>
                <h3 class="font-bold text-gray-900 group-hover:text-indigo-600 transition">{{ prod.name }}</h3>
                <p class="text-sm text-gray-500 line-clamp-2 mt-1">{{ prod.description }}</p>
                <div class="mt-4 flex items-center justify-between">
                  <span class="text-xl font-black text-gray-900">${{ prod.price }}</span>
                  <button 
                    @click="addToCart(prod)"
                    class="p-2 bg-gray-900 text-white rounded-lg hover:bg-indigo-600 transition shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.532 13 5.338 13H15a1 1 0 000-2H5.414l.5-1.5h8.586l.5-1.5H6.414l-.5-1.5H15a1 1 0 000-2H5.414l-.5-1.5H3z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Paginación -->
          <div class="mt-12 flex justify-center gap-2">
            <button 
              @click="changePage(pagination.page - 1)"
              :disabled="pagination.page === 1"
              class="px-4 py-2 border rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Anterior
            </button>
            <div class="flex items-center px-4 text-sm font-bold text-gray-700">
              Página {{ pagination.page }} de {{ totalPages }}
            </div>
            <button 
              @click="changePage(pagination.page + 1)"
              :disabled="pagination.page >= totalPages"
              class="px-4 py-2 border rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Siguiente
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import auth from '../services/auth'
import cart from '../services/cart'

const products = ref([])
const categories = ref([])
const tags = ref([])
const loading = ref(true)
const totalProducts = ref(0)
const totalPages = ref(1)

const filters = reactive({
  name__like: '',
  categoryId: null,
  price__gt: null,
  price__lt: null,
})

const selectedTags = ref([])
const pagination = reactive({
  page: 1,
  limit: 6
})

let searchTimeout

function debouncedSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    pagination.page = 1
    fetchProducts()
  }, 500)
}

function setCategory(id) {
  filters.categoryId = id
  pagination.page = 1
  fetchProducts()
}

function toggleTag(id) {
  const index = selectedTags.value.indexOf(id)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(id)
  }
  pagination.page = 1
  fetchProducts()
}

function resetFilters() {
  filters.name__like = ''
  filters.categoryId = null
  filters.price__gt = null
  filters.price__lt = null
  selectedTags.value = []
  pagination.page = 1
  fetchProducts()
}

function changePage(newPage) {
  if (newPage < 1 || newPage > totalPages.value) return
  pagination.page = newPage
  fetchProducts()
}

async function fetchInitialData() {
  try {
    const [catRes, tagRes] = await Promise.all([
      auth.api.get('/categories'),
      auth.api.get('/tags')
    ])
    categories.value = catRes.data?.data || []
    tags.value = tagRes.data?.data || []
  } catch (error) {
    console.error("Error al cargar datos iniciales:", error)
  }
}

async function fetchProducts() {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      limit: pagination.limit,
    }

    if (filters.name__like) params.name__like = filters.name__like
    if (filters.categoryId) params.categoryId = filters.categoryId
    if (filters.price__gt !== null) params.price__gt = filters.price__gt
    if (filters.price__lt !== null) params.price__lt = filters.price__lt
    if (selectedTags.value.length > 0) {
      params['productTags__id__in'] = selectedTags.value.join(',')
    }

    const res = await auth.api.get('/products', { params })
    
    // Asumiendo que el backend retorna { data: { results: [], total: X, totalPages: Y } } 
    // basándome en el QueryBuilder usual
    const responseData = res.data?.data
    if (Array.isArray(responseData)) {
      // Si el backend devuelve array plano (sin wrapper de paginación explícito en el json de root)
      products.value = responseData
      totalProducts.value = responseData.length
      totalPages.value = 1
    } else {
      products.value = responseData?.results || []
      totalProducts.value = responseData?.total || 0
      totalPages.value = responseData?.totalPages || 1
    }
  } catch (error) {
    console.error("Error al cargar productos:", error)
  } finally {
    loading.value = false
  }
}

function addToCart(product) {
  cart.addItem(product)
  alert(`"${product.name}" añadido al carrito!`)
}

onMounted(() => {
  fetchInitialData()
  fetchProducts()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
</style>