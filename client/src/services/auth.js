import axios from 'axios'

const TOKEN_KEY = 'auth_token'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor de respuesta para manejar sesiones expiradas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Si el error es de autenticación, limpiamos el token
      localStorage.removeItem(TOKEN_KEY)
      
      // Si no estamos ya en login o register, forzamos redirección
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        const currentPath = window.location.pathname + window.location.search
        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`
      }
    }
    return Promise.reject(error)
  }
)

const auth = {
  api, 
  async login(credentials) {
    const res = await api.post('/auth/login', credentials)

    const token = res.data?.token || res.data?.accessToken || res.data?.token_access

    if (token) {
      localStorage.setItem(TOKEN_KEY, token)
    }
    return res.data
  },

  async register(payload) {
    const res = await api.post('/auth/register', payload)
    const token = res.data?.token || res.data?.accessToken

    if (token) {
      localStorage.setItem(TOKEN_KEY, token)
    }
    return res.data
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY)
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY)
  },

  isAuthenticated() {
    return !!this.getToken()
  },

  async me() {
    const res = await api.get('/auth/me')
    return res.data?.data
  },
}

export default auth
