import api from '@/api'

const chartApi = {
  getSubscriberStatus: async (influencerId) => {
    const res = await api.get(`/api/influencers/${influencerId}/subscribers/status`)
    return res.data
  },

  getSubscriberStatsDaily: async (influencerId) => {
    const res = await api.get(`/api/influencers/${influencerId}/subscribers/stats/daily`)
    return res.data
  },
  getSubscriberStatsWeekly: async (influencerId) => {
    const res = await api.get(`/api/influencers/${influencerId}/subscribers/stats/weekly`)
    return res.data
  },
  getSubscriberStatsMonthly: async (influencerId) => {
    const res = await api.get(`/api/influencers/${influencerId}/subscribers/stats/monthly`)
    return res.data
  },
  getMonthlyRevenue: async (influencerId) => {
    const res = await api.get(`/api/influencers/${influencerId}/revenue/monthly`)
    return res.data
  },
  getTodayRevenue: async (influencerId) => {
    const res = await api.get(`/api/influencers/${influencerId}/revenue/today`)
    return res.data
  },
  getTotalRevenue: async (influencerId) => {
    const res = await api.get(`/api/influencers/${influencerId}/revenue/total`)
    return res.data
  },
}

export default chartApi
