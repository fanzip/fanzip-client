// 로그인 상태 관리
import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import { kakaoLogin } from '@/api/authApi'
import { useRouter } from 'vue-router'
import { register } from '@/api/userApi'

import api from '@/api'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()

  const token = ref(localStorage.getItem('access-token') || null)

  const userInfo = reactive({
    socialType: null,
    socialId: null,
    email: null,
  })

  const setToken = (jwt) => {
    token.value = jwt
    localStorage.setItem('access-token', jwt)
  }

  const clearToken = () => {
    token.value = null
    localStorage.removeItem('access-token')
  }

  const setUserInfo = ({ socialType, socialId, email }) => {
    userInfo.socialType = socialType
    userInfo.socialId = socialId
    userInfo.email = email
  }

  const handleKakaoLogin = async (code) => {
    try {
      const res = await kakaoLogin(code)

      if (res.status === 200) {
        const jwt = res.headers['authorization']?.split(' ')[1]
        if (jwt) {
          setToken(jwt)
          router.push('/')
        }
      } else if (res.status === 202) {
        setUserInfo(res.data)
        router.push({ name: 'AdditionalInfo' })
      }
    } catch (err) {
      console.error('카카오 로그인 실패', err)
    }
  }

  const registerUser = async ({ name, phone }) => {
    try {
      const payload = {
        ...userInfo,
        name,
        phone,
      }
      const res = await register(payload)
      const jwt = res.headers['authorization']?.split(' ')[1]
      if (jwt) {
        setToken(jwt)
        alert('회원가입 완료!')
        router.push('/')
      }
    } catch (err) {
      console.error('회원가입 실패:', err)
    }
  }

  const logout = async () => {
    localStorage.removeItem('access-token')
    token.value = null
    await api.post('/auth/logout')

    router.push('/login')
  }
  return { token, handleKakaoLogin, registerUser, logout }
})
