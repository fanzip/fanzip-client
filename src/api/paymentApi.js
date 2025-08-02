import axios from 'axios'
import api from '@/api'

const paymentApi = {
  createPayment: async (payload) => {
    const res = await axios.post('/api/payments/request', payload)
    return res.data
  },

  approvePayment: async (paymentId) => {
    const res = await api.patch(`/api/payments/${paymentId}/approve`)
    return res.data
  },

  failPayment: async (paymentId) => {
    const res = await api.patch(`/api/payments/${paymentId}/fail`)
    return res.data
  },

  cancelPayment: async (paymentId) => {
    const res = await api.patch(`/api/payments/${paymentId}/cancelled`)
    return res.data
  },

  refundPayment: async (paymentId) => {
    const res = await api.patch(`/api/payments/${paymentId}/refunded`)
    return res.data
  },

  getPaymentDetail: async (paymentId) => {
    const res = await api.get(`/api/payments/${paymentId}`)
    return res.data
  },

  getUserPayments: async (userId) => {
    const res = await api.get(`/api/payments/user/${userId}`)
    return res.data
  },
}

export default paymentApi