import axios from 'axios'
import api from '@/api'

const authApi = {
  getKakaoLoginUrl: async () => {
    const res = await axios.get(`/api/auth/oauth/kakao-url`)
    return res.data
  },
  kakaoLogin: async (code) => {
    const res = await axios.get(`/api/auth/oauth/kakao-login?code=${code}`)
    const accessToken = res.data.accessToken
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken)
    }
    return res
  },
  requestLogout: async () => {
    const res = await api.post('/api/auth/logout')
    return res
  },
}

export default authApi
