// 로그인 상태 관리
import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import userApi from '@/api/userApi'

import authApi from '@/api/authApi'

import { initFcm } from '@/fcm-init' // ✅ [FCM] 추가: 순환참조 방지용 별도 파일에서 import

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()

  const token = ref(localStorage.getItem('access-token') || null)

  const tempRole = ref('USER')

  const setTempRole = (role) => {
    tempRole.value = role
  }

  const kakaoInfo = reactive({
    socialType: null,
    socialId: null,
    email: null,
  })

  const userInfo = reactive({
    userId: null,
    email: null,
    name: null,
    phone: null,
    role: null,
    socialType: null,
    socialId: null,
    address1: null,
    address2: null,
    zipcode: null,
    recipientName: null,
    recipientPhone: null,
    createdAt: null,
    updatedAt: null,
    deletedAt: null,
  })

  const influencerUserInfo = reactive({
    influencerId: null,
    userId: null,
    influencerName: null,
    category: null,
    description: null,
    profileImage: null,
    fanCardImage: null,
    isVerified: null,
  })

  const setinfluencerUserInfo = (data) => {
    ;(influencerUserInfo.influencerId = data.influencerId),
      (influencerUserInfo.userId = data.userId),
      (influencerUserInfo.influencerName = data.influencerName),
      (influencerUserInfo.category = data.category),
      (influencerUserInfo.description = data.description),
      (influencerUserInfo.profileImage = data.profileImage),
      (influencerUserInfo.fanCardImage = data.fanCardImage),
      (influencerUserInfo.isVerified = data.isVerified)
  }

  const setToken = (jwt) => {
    token.value = jwt
    localStorage.setItem('access-token', jwt)
  }

  const clearToken = () => {
    token.value = null
    localStorage.removeItem('access-token')
  }

  const setKakaoInfo = ({ socialType, socialId, email }) => {
    kakaoInfo.socialType = socialType
    kakaoInfo.socialId = socialId
    kakaoInfo.email = email
  }

  const setUserInfo = (data) => {
    ;(userInfo.userId = data.userId),
      (userInfo.email = data.email),
      (userInfo.name = data.name),
      (userInfo.phone = data.phone),
      (userInfo.role = data.role),
      (userInfo.socialType = data.socialType),
      (userInfo.socialId = data.socialId),
      (userInfo.address1 = data.address1),
      (userInfo.address2 = data.address2),
      (userInfo.zipcode = data.zipcode),
      (userInfo.recipientName = data.recipientName),
      (userInfo.recipientPhone = data.recipientPhone),
      (userInfo.createdAt = data.createdAt),
      (userInfo.updatedAt = data.updatedAt),
      (userInfo.deletedAt = data.deletedAt)
  }

  const handleKakaoLogin = async (code) => {
    try {
      const res = await authApi.kakaoLogin(code)

      if (res.status === 200) {
        const jwt = res.headers['authorization']?.split(' ')[1]
        if (jwt) {
          setToken(jwt)

          // ✅ [FCM] 토큰 저장 직후 자동 등록
          if ('serviceWorker' in navigator) await initFcm()

          router.push('/')
        }
      } else if (res.status === 202) {
        setKakaoInfo(res.data)
        router.push({ name: 'AdditionalInfo' })
      }
    } catch (err) {
      console.error('카카오 로그인 실패', err)
    }
  }

  const registerUser = async ({ name, phone, role }) => {
    try {
      const payload = {
        ...kakaoInfo,
        name,
        phone,
      }
      const res = await userApi.register(payload)
      const jwt = res.headers['authorization']?.split(' ')[1]
      if (jwt) {
        setToken(jwt)

        // ✅ [FCM] 회원가입 직후도 자동 등록
        if ('serviceWorker' in navigator) await initFcm()

        alert('회원가입이 완료되었습니다!')
        if (tempRole.value === 'USER') router.push({ name: 'UserOnboarding' })
        else router.push({ name: 'InfluencerOnboarding' })
      }
    } catch (err) {
      console.error('회원가입 실패:', err)
    }
  }

  const logout = async () => {
    await authApi.requestLogout()
    clearToken()
    if (confirm('로그아웃 하시겠습니까?')) router.push('/login')
    // router.push('/login')
  }

  const fetchUserInfo = async () => {
    try {
      const res = await userApi.getUserInfo()
      setUserInfo(res.data)
      return res.data
    } catch (err) {
      console.error('사용자 정보 조회 실패', err)
      return null
    }
  }
  return {
    token,
    handleKakaoLogin,
    registerUser,
    logout,
    setToken,
    userInfo,
    influencerUserInfo,
    setUserInfo,
    setTempRole,
    fetchUserInfo,
    setinfluencerUserInfo,
  }
})
