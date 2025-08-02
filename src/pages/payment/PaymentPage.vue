<template>
  <div class="mt-12 ml-5 mr-5">
    <h2 class="text-center text-xl font-semibold text-base">결제하기</h2>

    <!-- 결제 UI -->
    <div id="payment-method" ref="paymentMethodRef" class="mt-16"></div>

    <!-- 이용약관 UI -->
    <div id="agreement" ref="agreementRef" class="mt-12"></div>

    <!-- 결제하기 버튼 -->
     <div class="absolute bottom-14">
        <BaseButton 
          variant="primary" 
          :disabled="isLoading" 
            @click="handlePayment"
        >
        <template v-if="!isLoading">
            <span class="font-bold">
              {{ isCouponApplied ? (baseAmount - discountAmount).toLocaleString() : baseAmount.toLocaleString() }}원
            </span>
            <span class="font-bold">결제하기</span>
        </template>
        <template v-else>
          처리 중...
        </template>
      </BaseButton>
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
    const baseAmount = 12000
    const discountAmount = 2000
    let paymentId = null
    let backendPaymentData = null
    const clientKey = import.meta.env.VITE_TOSS_CLIENT_KEY
    const customerKey = import.meta.env.VITE_TOSS_CUSTOMER_KEY 

    const initializeTossPayments = async () => {
      try {
        const tossPayments = window.TossPayments(clientKey)
        widgets = tossPayments.widgets({ customerKey })

        await widgets.setAmount({ currency: "KRW", value: baseAmount })
        await nextTick()

        await Promise.all([
          widgets.renderPaymentMethods({ selector: "#payment-method", variantKey: "DEFAULT" }),
          widgets.renderAgreement({ selector: "#agreement", variantKey: "AGREEMENT" })
        ])
      } catch (error) {
        console.error('토스페이먼트 초기화 실패:', error)
      }
    }

    const generateOrderIdFromPaymentData = (data) => {
      const { paymentType, membershipId, reservationId, orderId, paymentId } = data
      switch (paymentType) {
        case 'MEMBERSHIP': return `membership_${membershipId}_${paymentId}`
        case 'RESERVATION': return `reservation_${reservationId}_${paymentId}`
        case 'ORDER': return `order_${orderId}_${paymentId}`
        default: return `payment_${paymentId}`
      }
    }

    const createPaymentInBackend = async (amount) => {
      try {
        const response = await fetch('/api/payments/request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: 116353586,
            orderId: null,
            reservationId: 2432675,
            membershipId: null,
            transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            paymentType: "RESERVATION",
            paymentMethod: "TOSSPAY",
            amount
          })
        })



        if (!response.ok) throw new Error(`결제 요청 생성 실패: ${response.status}`)
        const data = await response.json()

        console.log(data);
        
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
        case 'MEMBERSHIP': return `멤버십 ${membershipId}번 결제`
        case 'RESERVATION': return `예약 ${reservationId}번 결제`
        case 'ORDER': return `주문 ${orderId}번 결제`
        default: return "결제"
      }
    }

    const handlePayment = async () => {
      if (!widgets) return alert('결제 시스템이 준비되지 않았습니다.')
      isLoading.value = true

      try {
        const finalAmount = isCouponApplied.value ? baseAmount - discountAmount : baseAmount
        const orderId = await createPaymentInBackend(finalAmount)
        const orderName = generateOrderName(backendPaymentData)

        await widgets.requestPayment({
          orderId: 'iv-C4woWgq8iis4PSz9vz',
          orderName: '토스 티셔츠 외 2건',    
          successUrl: `${window.location.origin}/payments/success?paymentId=${paymentId}`,
          failUrl: `${window.location.origin}/payments/fail?paymentId=${paymentId}`,
          customerEmail: "customer123@gmail.com",
          customerName: "김토스",
          customerMobilePhone: "01012341234",
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

    onMounted(() => {
      if (typeof window.TossPayments === 'undefined') {
        console.error('TossPayments 스크립트가 로드되지 않았습니다.')
        return
      }
      initializeTossPayments()
    })

    return {
      paymentMethodRef,
      agreementRef,
      isCouponApplied,
      isLoading,
      handlePayment,
      baseAmount,
      discountAmount
    }
  }
}
</script>