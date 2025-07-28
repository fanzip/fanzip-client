import axios from 'axios'

export async function getKakaoLoginUrl() {
  const res = await axios.get(`/api/auth/oauth/kakao-url`)
  return res.data
}

export async function kakaoLogin(code) {
  const res = await axios.get(`/api/auth/oauth/kakao-login?code=${code}`)
  return res
}
