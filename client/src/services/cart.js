import { reactive, watch } from 'vue'

const CART_STORAGE_KEY = 'sleistore_cart'

// Intentar cargar el carrito desde localStorage
const savedCart = localStorage.getItem(CART_STORAGE_KEY)
const initialItems = savedCart ? JSON.parse(savedCart) : []

export const cartState = reactive({
  items: initialItems,
  
  // Agregar producto al carrito
  addItem(product) {
    const existingItem = this.items.find(item => item.id === product.id)
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image, // Por si agregas imágenes luego
        quantity: 1,
        stock: product.stock
      })
    }
  },

  // Eliminar producto
  removeItem(productId) {
    const index = this.items.findIndex(item => item.id === productId)
    if (index > -1) {
      this.items.splice(index, 1)
    }
  },

  // Cambiar cantidad
  updateQuantity(productId, quantity) {
    const item = this.items.find(item => item.id === productId)
    if (item) {
      if (quantity <= 0) {
        this.removeItem(productId)
      } else {
        item.quantity = quantity
      }
    }
  },

  // Limpiar carrito
  clear() {
    this.items = []
  },

  // Calculados (Helper functions)
  getTotalItems() {
    return this.items.reduce((total, item) => total + item.quantity, 0)
  },

  getTotalPrice() {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }
})

// Persistencia automática: Observar cambios y guardar en localStorage
watch(
  () => cartState.items,
  (newItems) => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems))
  },
  { deep: true }
)

export default cartState
