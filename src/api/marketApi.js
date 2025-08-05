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

  // 장바구니 조회
  getCartItems: async () => {
    const res = await api.get('/api/cart/items')
    return res.data
  },

  // 개별 수량/선택 상태 변경
  updateCartItem: async ({ cartItemId, quantity, isSelected }) => {
    const res = await api.put(`/api/cart/items/${cartItemId}`, { quantity, isSelected })
    return res.data
  },

  // 전체 선택/해제 토글
  selectAll: async (selectAll) => {
    const res = await api.put('/api/cart/items/select-all', {}, { params: { selectAll } })
    return res.data
  },

  // 개별 삭제
  removeCartItem: async (cartItemId) => {
    await api.delete(`/api/cart/items/${cartItemId}`)
  },
}

export default marketApi
