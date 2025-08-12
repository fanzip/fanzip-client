// import axios from 'axios'
import api from '@/api'

export const reserveSeat = async (meetingId, seatId) => {
  const response = await api.post(`/api/fan-meetings/${meetingId}/seats/${seatId}/reservation`)
  return response.data
}

export const cancelReservation = async (meetingId) => {
  await api.delete(`/api/fan-meetings/${meetingId}/reservation`)
}

export async function startReservationPayment({ meetingId, seatId, userId }) {
  const { data } = await api.post(`/api/fan-meetings/${meetingId}/seats/${seatId}/start-payment`)
  // data: { paymentId, amount, ttlSeconds }
  return data
}


