import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const instance = axios.create({
  withCredentials: true, //쿠키 전송
  timeout: 1000, //1초 안에 응답이 오지 않으면 요청을 취소하고 timeout error 발생
})

instance.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    const token = authStore.token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

instance.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      return response
    }
    if (response.status === 404) {
      return Promise.reject('404: 페이지 없음 ' + response.request)
    }
    console.log(response)
    return response
  },
  async (error) => {
    const authStore = useAuthStore()
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      //originalRequest._retry 초기값: undefined
      originalRequest._retry = true
      try {
        const res = await axios.post('/api/auth/reissue', null, { withCredentials: true })

        const newAccessToken = res.headers['authorization']?.split(' ')[1]
        if (newAccessToken) {
          localStorage.setItem('access-token', newAccessToken)
          authStore.setToken(newAccessToken)

          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`

          return instance(originalRequest)
        }
      } catch (reissueError) {
        console.error('토큰 재발급 실패', reissueError)
        authStore.logout()
        return Promise.reject(reissueError)
      }
    }
    return Promise.reject(error)
  },
)

export default instance
