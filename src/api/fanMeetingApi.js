import api from '@/api'

export const getFanMeetingDetail = async (meetingId) => {
  const res = await api.get(`/api/fan-meetings/${meetingId}`)
  return res.data
}

export const getFanMeetings = async () => {
  const res = await api.get('/api/fan-meetings')
  return res.data
}

export const getInfluencerFanMeetings = async (influencerId) => {
  const res = await api.get(`/api/influencers/${influencerId}/fan-meetings`)
  return res.data
}

export const getSubscribedFanMeetings = async (grade = 'GENERAL') => {
  const res = await api.get('/api/fan-meetings/subscribed', {
    params: { grade }
  })
  return res.data
}

export const getNonSubscribedFanMeetings = async (grade = 'GENERAL') => {
  const res = await api.get('/api/fan-meetings/non-subscribed', {
    params: { grade }
  })
  return res.data
}

export const createFanMeeting = async (payload) => {
  const res = await api.post('/api/fan-meetings', payload)
  return res.data
}

// export const fetchFanMeeting = async (meetingId) => {
//   const res = await api.get(`/api/fan-meetings/${meetingId}`)
//   return res.data
// }

export const fetchSeatsByMeetingId = async (meetingId) => {
  const response = await api.get(`/api/fan-meetings/${meetingId}/seats`)
  return response.data
}

export const fetchPendingSeatsByMeetingId = async (meetingId) => {
  try {
    const response = await api.get(`/api/fan-meetings/${meetingId}/pending-seats`)
    return response.data
  } catch (err) {
    console.warn('pending-seats API가 없습니다. 빈 배열을 반환합니다.')
    return []
  }
}

export const checkIfAlreadyReserved = async (meetingId) => {
  const res = await api.get(`/api/fan-meetings/${meetingId}/reservation/check`)
  return res.data.reserved
}

export const startReservationPayment = async ({ meetingId, seatId }) => {
  const { data } = await api.post(`/api/fan-meetings/${meetingId}/seats/${seatId}/start-payment`)
  return data // { paymentId, amount, ttlSeconds, reservationId? }
}

export const reserveSeat = async (meetingId, seatId) => {
  const { data } = await api.post(`/api/fan-meetings/${meetingId}/seats/${seatId}/reservation`)
  return data
}

export const cancelReservation = async (meetingId) => {
  await api.delete(`/api/fan-meetings/${meetingId}/reservation`)
}

export const fetchFanMeeting = getFanMeetingDetail // 별칭


// ✅ S3 업로드: 팬미팅 포스터
// 컨트롤러: POST /api/influencers/{influencerId}/fanmeeting/poster
// 서버가 응답 바디로 "URL 문자열"을 직접 반환 → { url }로 감싸서 리턴

export const uploadFanMeetingPoster = async (file, influencerId) => {
  if (!file) throw new Error('파일이 없습니다.')
  if (!Number.isFinite(Number(influencerId))) throw new Error('influencerId가 올바르지 않습니다.')

  const fd = new FormData()
  fd.append('file', file)

  // axios가 multipart boundary를 자동 설정하므로 headers 생략 가능 (명시해도 무방)
  const { data } = await api.post(
    `/api/influencers/${influencerId}/fanmeeting/poster`,
    fd,{
      headers: {},
      timeout: 6000,
    }
  )
  // data가 문자열 URL
return { url: data }
}

// 사용자의 특정 인플루언서 팬미팅 예약 여부 확인
export const checkUpcomingMeetingWithInfluencer = async (influencerId) => {
  const res = await api.get(`/api/fan-meetings/user/${influencerId}/upcoming`)
  return res.data
}

// 사용자의 모든 팬미팅 예약 여부 확인 (인플루언서 상관없이)
export const checkAnyUpcomingMeeting = async () => {
  const res = await api.get('/api/fan-meetings/user/upcoming')
  return res.data
}