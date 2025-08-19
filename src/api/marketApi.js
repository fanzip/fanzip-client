import api from '@/api'

const marketApi = {
  // 전체 상품 목록 조회
  getProducts: async ({
    limit = 20,
    keyword = '',
    lastProductId = null,
    sort = null,
    category = null,
    onlySubscribed = null,
  }) => {
    const params = { limit }
    if (keyword) params.q = keyword
    if (lastProductId) params.lastProductId = lastProductId
    if (sort) params.sort = sort
    if (category) params.category = category
    if (onlySubscribed !== null && onlySubscribed !== undefined) {
      params.onlySubscribed = onlySubscribed
    }
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

  // 주문 생성
  createOrder: async (orderData) => {
    const res = await api.post('/api/market/orders', orderData)
    return res.data
  },

  getOrderPayment: async (orderId) => {
    const res = await api.get(`/api/market/orders/${orderId}/payment`)
    return res.data
  },

  // 주문 완료 페이지용 주문 상품 조회
  getOrderItems: async (orderId) => {
    const res = await api.get(`/api/market/orders/${orderId}/items`)
    return res.data
  },

  // 주문 완료 페이지용 주문 상세 정보 조회
  getOrderDetail: async (orderId) => {
    const res = await api.get(`/api/market/orders/${orderId}`)
    return res.data
  },

  // 상품 생성(공구 마켓 등록)
  createProduct: async (payload) => {
    const res = await api.post('/api/market/products', payload)
    return res.data
  },

  // ✅ 썸네일 1장 업로드
  uploadMarketThumbnail: async (file, influencerId) => {
    const fd = new FormData()
    fd.append('file', file)
    const { data } = await api.post(
      `/api/influencers/${influencerId}/market/images/thumbnail`,
      fd,{
       headers: {} ,
      timeout: 6000,
  })
    return data // { url }
  },

  // ✅ 슬라이드 여러 장 업로드
  uploadMarketSlides: async (files, influencerId) => {
    const fd = new FormData()
    for (const f of files) fd.append('files', f) // 컨트롤러 @RequestParam("files")
    const { data } = await api.post(`/api/influencers/${influencerId}/market/images/slide`, fd, {
      headers: {},
      timeout: 6000,
    })
    return data // { urls: [] }
  },

  // ✅ 상세 여러 장 업로드
  uploadMarketDetails: async (files, influencerId) => {
    const fd = new FormData()
    for (const f of files) fd.append('files', f)
    const { data } = await api.post(`/api/influencers/${influencerId}/market/images/detail`, fd, {
      headers: {},
      timeout: 6000,
    })
    return data // { urls: [] }
  },
}

export default marketApi
