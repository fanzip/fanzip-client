import api from './index'

export const fancardApi = {
  // 팬카드 목록 조회
  getUserFancards: () => {
    return api.get('/api/fancards')
  },

  // 팬카드 상세 조회
  getFancardDetail: (cardId) => {
    return api.get(`/api/fancards/${cardId}`)
  },

  // QR 코드 생성
  generateQrCode: (qrCodeData) => {
    return api.post('/api/fancards/qr', qrCodeData)
  },
}
