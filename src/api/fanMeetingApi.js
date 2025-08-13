import api from '@/api'

export const getFanMeetingDetail = async (meetingId) => {
  const res = await api.get(`/api/fan-meetings/${meetingId}`)
  return res.data
}

export const getFanMeetings = async () => {
  const res = await api.get('/api/fan-meetings')
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

export const checkIfAlreadyReserved = async (meetingId) => {
  const res = await api.get(`/api/fan-meetings/${meetingId}/reservation/check`)
  return res.data.reserved
}

<<<<<<< Updated upstream
export const fetchFanMeeting = async (meetingId) => {
  const { data } = await api.get(`/api/fan-meetings/${meetingId}`)
  return data
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
=======
export const fetchFanMeeting = getFanMeetingDetail // 별칭
>>>>>>> Stashed changes
