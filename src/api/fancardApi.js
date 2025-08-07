import api from './index'
import { mockFancardList, mockFancardDetail, mockQrResponse } from '@/utils/mockFancardData'

// 개발환경에서 백엔드 500 오류 시 목 데이터 사용
const USE_MOCK_DATA = import.meta.env.DEV && false // RDS 서버 환경에서는 실제 API 사용

export const fancardApi = {
  // 팬카드 목록 조회
  getUserFancards: async () => {
    if (USE_MOCK_DATA) {
      console.log('🎭 Using mock fancard list data')
      return Promise.resolve({ data: mockFancardList })
    }
    return api.get('/api/fancards')
  },

  // 팬카드 상세 조회
  getFancardDetail: async (cardId) => {
    if (USE_MOCK_DATA) {
      console.log(`🎭 Using mock fancard detail data for ID: ${cardId}`)
      return Promise.resolve({ data: mockFancardDetail })
    }
    return api.get(`/api/fancards/${cardId}`)
  },

  // QR 코드 생성
  generateQrCode: async (qrCodeData) => {
    if (USE_MOCK_DATA) {
      console.log('🎭 Using mock QR code data')
      return Promise.resolve({ data: mockQrResponse })
    }
    return api.post('/api/fancards/qr', qrCodeData)
  },
}
