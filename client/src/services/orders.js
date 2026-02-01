import auth from './auth'

const ordersApi = {
  async getMyOrders(page = 1, limit = 10) {
    const res = await auth.api.get('/orders', {
      params: { page, limit }
    })
    return res.data?.data
  }
}

export default ordersApi
