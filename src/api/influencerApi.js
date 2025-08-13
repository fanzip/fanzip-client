import api from '@/api'

const API_BASE_URL = '/api/influencers'

// 인플루언서 프로필 조회
export const getInfluencerProfile = async (influencerId) => {
  try {
    const response = await api.get(`${API_BASE_URL}/${influencerId}/profile`)
    console.log('API 응답 전체:', response.data)
    return response.data
  } catch (error) {
    console.error('인플루언서 프로필 조회 실패:', error)
    throw error
  }
}

export const getInfluencerMyProfile = async () => {
  try {
    const response = await api.get(`${API_BASE_URL}/profile`)
    console.log('API 응답 전체:', response.data)
    return response.data
  } catch (error) {
    console.error('인플루언서 프로필 조회 실패:', error)
    throw error
  }
}
// 인플루언서 프로필 수정
export const updateInfluencerProfile = async (influencerId, profileData) => {
  try {
    const response = await api.put(`${API_BASE_URL}/${influencerId}/profile`, profileData)
    return response.data
  } catch (error) {
    console.error('인플루언서 프로필 수정 실패:', error)
    throw error
  }
}

// 인플루언서 프로필 이미지 업로드
export const updateInfluencerProfileImage = async (influencerId, imageData) => {
  try {
    const formData = new FormData()
    formData.append('file', imageData)

    const response = await api.post(`${API_BASE_URL}/${influencerId}/profile/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data // 업데이트된 이미지 URL 반환
  } catch (error) {
    console.error('인플루언서 프로필 이미지 업로드 실패:', error)
    throw error
  }
}

// 인플루언서 팬카드 이미지 업로드
export const updateInfluencerFanCardImage = async (influencerId, imageData) => {
  try {
    const formData = new FormData()
    formData.append('file', imageData)

    const response = await api.post(`${API_BASE_URL}/${influencerId}/fancard/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data // 업데이트된 이미지 URL 반환
  } catch (error) {
    console.error('인플루언서 팬카드 이미지 업로드 실패:', error)
    throw error
  }
}

const influencerApi = {
  // 인플루언서 목록 전체 조회
  fetchAll: async () => {
    const res = await api.get(`${API_BASE_URL}`)
    return res.data
  },

  // 인플루언서 목록 상세 조회
  fetchDetail: async (influencerId) => {
    try {
      const res = await api.get(`${API_BASE_URL}/${influencerId}`)
      console.log('📦 fetchDetail API 응답 전체:', res)
      return res.data
    } catch (e) {
      console.error('❌ fetchDetail API 실패:', e.response?.data || e.message)
      return undefined
    }
  },
}

export default influencerApi
