import api from '@/api'

const marketApi = {
  getProducts: async ({ limit = 20, keyword = '', lastProductId = null }) => {
    const params = { limit }
    if (keyword) params.q = keyword
    if (lastProductId) params.lastProductId = lastProductId

    const res = await api.get('/api/market/products', { params })
    console.log('res:', res)
    console.log('res.data: ', res.data)
    return res.data
  },
}

export default marketApi
