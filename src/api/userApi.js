import axios from 'axios'
import api from '@/api'

const userApi = {
  register: async (payload) => {
    const res = await axios.post('/api/user/register', payload)
    return res
  },
  getUserInfo: async () => {
    const res = await api.get('/api/user')
    return res
  },
}

export default userApi
