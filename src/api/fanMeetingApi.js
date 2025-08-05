import api from './index'

export const getFanMeetingDetail = async (meetingId) => {
  const res = await api.get(`/api/fan-meetings/${meetingId}`)
  return res.data
}

export const getFanMeetings = async () => {
  const res = await api.get('/api/fan-meetings')
  return res.data
}