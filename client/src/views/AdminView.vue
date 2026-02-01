<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-extrabold text-gray-900">Gestión de Tienda</h1>
        <router-link to="/" class="text-indigo-600 hover:text-indigo-500 font-medium">Volver al Inicio</router-link>
      </div>

      <!-- Tabs -->
      <div class="border-b border-gray-200 mb-8">
        <nav class="-mb-px flex space-x-8">
          <button 
            v-for="tab in ['productos', 'categorías', 'etiquetas']" 
            :key="tab"
            @click="activeTab = tab"
            :class="[activeTab === tab ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300']"
            class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize"
          >
            {{ tab }}
          </button>
        </nav>
      </div>

      <!-- Formularios -->
      <div class="bg-white shadow sm:rounded-lg p-6">
        
        <!-- Formulario Productos -->
        <div v-if="activeTab === 'productos'">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Añadir Nuevo Producto</h2>
          <form @submit.prevent="createProduct" class="space-y-4">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="block text-sm font-medium text-gray-700">Nombre</label>
                <input v-model="productForm.name" type="text" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Precio</label>
                <input v-model.number="productForm.price" type="number" step="0.01" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea v-model="productForm.description" rows="3" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
            </div>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="block text-sm font-medium text-gray-700">Categoría</label>
                <select v-model="productForm.categoryId" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Stock</label>
                <input v-model.number="productForm.stock" type="number" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Etiquetas (Selección múltiple)</label>
              <div class="flex flex-wrap gap-2">
                <button 
                  v-for="tag in tags" 
                  :key="tag.id"
                  type="button"
                  @click="toggleTagSelection(tag.id)"
                  :class="[productForm.tags.includes(tag.id) ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700']"
                  class="px-3 py-1 rounded-full text-xs font-medium"
                >
                  {{ tag.name }}
                </button>
              </div>
            </div>
            <button type="submit" class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition">Crear Producto</button>
          </form>
        </div>

        <!-- Formulario Categorías -->
        <div v-if="activeTab === 'categorías'">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Añadir Nueva Categoría</h2>
          <form @submit.prevent="createCategory" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Nombre</label>
              <input v-model="categoryForm.name" type="text" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea v-model="categoryForm.description" required rows="2" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
            </div>
            <button type="submit" class="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition">Crear Categoría</button>
          </form>
        </div>

        <!-- Formulario Etiquetas -->
        <div v-if="activeTab === 'etiquetas'">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Añadir Nueva Etiqueta</h2>
          <form @submit.prevent="createTag" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Nombre de la Etiqueta</label>
              <input v-model="tagForm.name" type="text" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Ej: Nuevo, Oferta..." />
            </div>
            <button type="submit" class="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition">Crear Etiqueta</button>
          </form>
        </div>

        <div v-if="message" :class="[isError ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700']" class="mt-4 p-4 rounded-md text-sm font-medium">
          {{ message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import auth from '../services/auth'

const activeTab = ref('productos')
const message = ref('')
const isError = ref(false)

const categories = ref([])
const tags = ref([])

const productForm = reactive({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  categoryId: '',
  tags: []
})

const categoryForm = reactive({
  name: '',
  description: ''
})

const tagForm = reactive({
  name: ''
})

async function fetchData() {
  try {
    const [catRes, tagRes] = await Promise.all([
      auth.api.get('/categories'),
      auth.api.get('/tags')
    ])
    categories.value = catRes.data?.data || []
    tags.value = tagRes.data?.data || []
  } catch (err) {
    console.error("Error cargando datos", err)
  }
}

function showMsg(txt, error = false) {
  message.value = txt
  isError.value = error
  setTimeout(() => { message.value = '' }, 3000)
}

function toggleTagSelection(id) {
  const index = productForm.tags.indexOf(id)
  if (index > -1) productForm.tags.splice(index, 1)
  else productForm.tags.push(id)
}

async function createProduct() {
  try {
    await auth.api.post('/products', productForm)
    showMsg("Producto creado con éxito")
    Object.assign(productForm, { name: '', description: '', price: 0, stock: 0, categoryId: '', tags: [] })
  } catch (err) {
    showMsg(err.response?.data?.message || "Error al crear producto", true)
  }
}

async function createCategory() {
  try {
    await auth.api.post('/categories', categoryForm)
    showMsg("Categoría creada")
    categoryForm.name = ''; categoryForm.description = ''
    fetchData()
  } catch (err) {
    showMsg("Error al crear categoría", true)
  }
}

async function createTag() {
  try {
    await auth.api.post('/tags', tagForm)
    showMsg("Etiqueta creada")
    tagForm.name = ''
    fetchData()
  } catch (err) {
    showMsg("Error al crear etiqueta", true)
  }
}

onMounted(fetchData)
</script>