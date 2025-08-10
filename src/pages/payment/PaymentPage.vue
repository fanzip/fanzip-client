<template>
  <div class="min-h-screen bg-subtle-bg px-5 pt-12 flex items-center justify-center">
    <div class="text-center">
      <div v-if="isLoading" class="space-y-4">
        <div class="animate-spin rounded-full h-16 w-16 border-4 brand-accent border-t-transparent mx-auto"></div>
        <p class="text-lg font-semibold">토스 결제를 준비하고 있습니다...</p>
        <p class="text-sm text-subtle">잠시만 기다려주세요</p>
      </div>
      
      <div v-else class="space-y-4">
        <p class="text-lg font-semibold text-emphasis">결제를 시작할 수 없습니다</p>
        <button 
          @click="handlePayment" 
          class="px-6 py-2 brand-accent text-base rounded-lg hover:brand-accent"
        >
          다시 시도
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'

export default {
  name: 'PaymentPage',
  components: { BaseButton },
  setup() {
    const router = useRouter()
    const paymentMethodRef = ref(null)
    const agreementRef = ref(null)
    const isCouponApplied = ref(false)
    const isLoading = ref(false)
    let widgets = null
    const baseAmount = 10000
    const discountAmount = 2000
    let paymentId = null
    let backendPaymentData = null
    const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY
    const customerKey = import.meta.env.VITE_TOSS_CUSTOMER_KEY

    const initializeTossPayments = async () => {
      try {
        const tossPayments = window.TossPayments(clientKey)
        widgets = tossPayments.widgets({ customerKey })

        await widgets.setAmount({ currency: 'KRW', value: baseAmount })
        await nextTick()

        await Promise.all([
          widgets.renderPaymentMethods({ selector: '#payment-method', variantKey: 'DEFAULT' }),
          widgets.renderAgreement({ selector: '#agreement', variantKey: 'AGREEMENT' }),
        ])
      } catch (error) {
        console.error('토스페이먼트 초기화 실패:', error)
      }
    }

    const generateOrderIdFromPaymentData = (data) => {
      const { paymentType, membershipId, reservationId, orderId, paymentId } = data
      switch (paymentType) {
        case 'MEMBERSHIP':
          return `membership_${membershipId}_${paymentId}`
        case 'RESERVATION':
          return `reservation_${reservationId}_${paymentId}`
        case 'ORDER':
          return `order_${orderId}_${paymentId}`
        default:
          return `payment_${paymentId}`
      }
    }

    const createPaymentInBackend = async (amount) => {
      try {
        const response = await fetch('/api/payments/request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: 1,
            orderId: 1,
            reservationId: null,
            membershipId: null,
            transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            paymentType: 'RESERVATION',
            paymentMethod: 'TOSSPAY',
            amount,
          }),
        })

        if (!response.ok) throw new Error(`결제 요청 생성 실패: ${response.status}`)
        const data = await response.json()

        paymentId = data.paymentId
        backendPaymentData = data
        return generateOrderIdFromPaymentData(data)
      } catch (err) {
        console.error('❌ 백엔드 결제 요청 실패:', err)
        throw err
      }
    }

    const generateOrderName = ({ paymentType, membershipId, reservationId, orderId }) => {
      switch (paymentType) {
        case 'MEMBERSHIP':
          return `멤버십 ${membershipId}번 결제`
        case 'RESERVATION':
          return `예약 ${reservationId}번 결제`
        case 'ORDER':
          return `주문 ${orderId}번 결제`
        default:
          return '결제'
      }
    }

    const handlePayment = async () => {
      if (!widgets) return alert('결제 시스템이 준비되지 않았습니다.')
      isLoading.value = true

      try {
        const finalAmount = isCouponApplied.value ? baseAmount - discountAmount : baseAmount
        const orderId = await createPaymentInBackend(finalAmount)
        const orderName = generateOrderName(backendPaymentData)

        // QR 코드 결제로 변경
        const tossPayments = window.TossPayments(clientKey)
        await tossPayments.requestPayment('토스페이', {
          amount: finalAmount,
          orderId,
          orderName,
          successUrl: `${window.location.origin}/payments/success?paymentId=${paymentId}`,
          failUrl: `${window.location.origin}/payments/fail?paymentId=${paymentId}`,
          customerEmail: 'customer123@gmail.com',
          customerName: '김토스',
          customerMobilePhone: '01012341234',
          // QR 코드가 먼저 표시되도록 설정
          flowMode: 'DIRECT'
        })
      } catch (error) {
        console.error('결제 요청 실패:', error)
        if (paymentId) {
          try {
            await fetch(`/api/payments/${paymentId}/fail`, { method: 'PATCH' })
          } catch (e) {
            console.error('결제 실패 상태 업데이트 실패:', e)
          }
        }
        router.push('/payments/fail')
      } finally {
        isLoading.value = false
      }
    }

    onMounted(async () => {
      console.log('🔍 TossPayments 로드 확인:', typeof window.TossPayments)
      console.log('🔍 window.TossPayments:', window.TossPayments)
      
      if (typeof window.TossPayments === 'undefined') {
        console.error('❌ TossPayments 스크립트가 로드되지 않았습니다.')
        isLoading.value = false
        return
      }
      
      // 바로 토스페이 결제 (QR 코드) 호출 - iframe 생략
      isLoading.value = true
      
      try {
        // 백엔드에 결제 요청 생성
        const finalAmount = baseAmount
        const orderId = await createPaymentInBackend(finalAmount)
        const orderName = generateOrderName(backendPaymentData)

        // 토스페이먼츠 객체 생성
        console.log('🔍 TossPayments 객체 생성 시도...')
        const tossPayments = window.TossPayments(clientKey)
        console.log('✅ TossPayments 객체:', tossPayments)
        console.log('🔍 requestPayment 메서드 존재:', typeof tossPayments.requestPayment)
        
        // 사용 가능한 메서드들 확인
        console.log('🔍 TossPayments 메서드들:', Object.getOwnPropertyNames(tossPayments))
        
        // Widget API 사용 (requestPayment가 없으므로)
        console.log('🔄 Widget API 사용하여 토스페이 결제 진행')
        const widgets = tossPayments.widgets({ customerKey })
        
        if (widgets) {
          console.log('✅ widgets 객체 생성 성공')
          await widgets.setAmount({ currency: 'KRW', value: finalAmount })
          
          // 임시 div를 body에 추가하여 결제 수단 렌더링
          const tempDiv = document.createElement('div')
          tempDiv.id = 'temp-payment-methods'
          tempDiv.style.position = 'fixed'
          tempDiv.style.top = '-9999px'  // 화면 밖에 숨김
          tempDiv.style.left = '-9999px'
          document.body.appendChild(tempDiv)
          
          await widgets.renderPaymentMethods({ 
            selector: '#temp-payment-methods', 
            variantKey: 'DEFAULT' 
          })
          
          // 잠시 대기 후 바로 결제 요청
          setTimeout(async () => {
            try {
              console.log('🚀 자동 결제 요청 시작')
              await widgets.requestPayment({
                orderId,
                orderName,
                successUrl: `${window.location.origin}/payments/success?paymentId=${paymentId}`,
                failUrl: `${window.location.origin}/payments/fail?paymentId=${paymentId}`,
                customerEmail: 'customer123@gmail.com',
                customerName: '김토스',
                customerMobilePhone: '01012341234',
              })
              
              // 임시 div 제거
              document.body.removeChild(tempDiv)
            } catch (err) {
              console.error('자동 결제 요청 실패:', err)
              // 임시 div 제거
              if (document.body.contains(tempDiv)) {
                document.body.removeChild(tempDiv)
              }
              isLoading.value = false
            }
          }, 2000)  // 2초 대기
        } else {
          console.error('❌ widgets 생성 실패')
          isLoading.value = false
        }
      } catch (error) {
        console.error('❌ 토스 결제 호출 실패:', error)
        isLoading.value = false
      }
    })

    return {
      paymentMethodRef,
      agreementRef,
      isCouponApplied,
      isLoading,
      handlePayment,
      baseAmount,
      discountAmount,
    }
  },
}
</script>
