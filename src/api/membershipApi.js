// 멤버십 관련 API

import api from '@/api'

/**
 * 멤버십 구독 신청
 * payload: { influencerId:number, gradeId:number, autoRenewal:boolean, monthlyAmount?:number, payMethod?:string }
 * 응답: { membershipId, influencerId, gradeId, status, monthlyAmount, paymentId, paymentPageUrl, ... }
 */

export const subscribeMembership = (payload) =>
  api.post('/api/memberships/subscribe', payload).then(res => res.data)

/** 멤버십 등급 목록 */
export const getMembershipGrades = () =>
  api.get('/api/memberships/grades').then(res => res.data)

/** 내 멤버십 요약 정보 */
export const getMyMembershipInfo = () =>
  api.get('/api/memberships/my-info').then(res => res.data)

/** 특정 인플루언서에 대한 나의 구독 정보 */
export const getUserSubscriptionByInfluencer = (influencerId) =>
  api.get(`/api/memberships/subscription/${influencerId}`).then(res => res.data)
