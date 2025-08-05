import axios from 'axios'

export const getFanMeetings = async () => {
  const res = await axios.get('/fan-meetings')
  return res.data
}
