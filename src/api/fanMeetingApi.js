import api from '@/api'

export const getFanMeetingDetail = async (meetingId) => {
  const res = await api.get(`/api/fan-meetings/${meetingId}`)
  return res.data
}

export const getFanMeetings = async () => {
  const res = await api.get('/api/fan-meetings')
  return res.data
}

export const fetchFanMeeting = async (meetingId) => {
  const res = await api.get(`/api/fan-meetings/${meetingId}`)
  return res.data
}

export const fetchSeatsByMeetingId = async (meetingId) => {
  const response = await api.get(`/api/fan-meetings/${meetingId}/seats`)
  return response.data
}

export const checkIfAlreadyReserved = async (meetingId) => {
  const res = await api.get(`/api/fan-meetings/${meetingId}/reservation/check`)
  return res.data.reserved
}
