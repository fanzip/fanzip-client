import api from '@/api'

const marketApi = {
  // 전체 상품 목록 조회
  getProducts: async ({ limit = 20, keyword = '', lastProductId = null }) => {
    const params = { limit }
    if (keyword) params.q = keyword
    if (lastProductId) params.lastProductId = lastProductId

    const res = await api.get('/api/market/products', { params })
    return res.data
  },

  //  상품 상세 조회
  getProductDetail: async (productId) => {
    const res = await api.get(`/api/market/products/${productId}`)
    return res.data
  },

  // 장바구니에 상품 추가
  addToCart: async ({ productId, quantity }) => {
    const res = await api.post('/api/cart/items', { productId, quantity })
    return res.data
  },
}

export default marketApi
