import api from './index'

// Mock 데이터 완전 제거 - MySQL에서만 데이터 받아옴

export const fancardApi = {
  // 팬카드 목록 조회
  getUserFancards: async () => {
    return api.get('/api/fancards')
  },

  // 팬카드 상세 조회
  getFancardDetail: async (cardId) => {
    return api.get(`/api/fancards/${cardId}`)
  },

  // QR 코드 생성
  generateQrCode: async (qrCodeData) => {
    return api.post('/api/fancards/qr', qrCodeData)
  },
}
