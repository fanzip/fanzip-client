import api from '@/api'

const reportApi = {
  // AI 리포트 조회
  getAIReport: async (influencerId, meetingId, regenerate = true) => {
    const params = {
      meetingId: parseInt(meetingId),
      regenerate: Boolean(regenerate),
    }

    const res = await api.get(`/api/influencers/${influencerId}/feedbacks/report/ai`, { params })
    return res.data
  },
}

export default reportApi
