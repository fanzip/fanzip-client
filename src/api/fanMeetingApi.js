import axios from '@/api/axios'

export const getFanMeetings = async () => {
  const res = await axios.get('/fan-meetings')
  return res.data
}
