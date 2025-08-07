import axios from './axios'

const API_BASE_URL = '/influencers'

// 인플루언서 프로필 조회
export const getInfluencerProfile = async (influencerId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${influencerId}/profile`)
    return response.data
  } catch (error) {
    console.error('인플루언서 프로필 조회 실패:', error)
    throw error
  }
}

// 인플루언서 프로필 수정
export const updateInfluencerProfile = async (influencerId, profileData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${influencerId}/profile`, profileData)
    return response.data
  } catch (error) {
    console.error('인플루언서 프로필 수정 실패:', error)
    throw error
  }
}

// 인플루언서 프로필 이미지 업로드
export const updateInfluencerProfileImage = async (influencerId, imageData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${influencerId}/profile/image`, imageData)
    return response.data // 업데이트된 이미지 URL 반환
  } catch (error) {
    console.error('인플루언서 프로필 이미지 업로드 실패:', error)
    throw error
  }
}

// 인플루언서 팬카드 이미지 업로드
export const updateInfluencerFanCardImage = async (influencerId, imageData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${influencerId}/fancard/image`, imageData)
    return response.data // 업데이트된 이미지 URL 반환
  } catch (error) {
    console.error('인플루언서 팬카드 이미지 업로드 실패:', error)
    throw error
  }
}