import axios from 'axios'

export async function register(payload) {
  const res = await axios.post('/api/users/register', payload)
  return res
}
