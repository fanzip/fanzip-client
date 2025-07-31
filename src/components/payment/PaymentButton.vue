<template>
  <button @click="requestPayment">결제하기</button>
</template>

<script setup>
import { onMounted } from 'vue'

const data = {
  storeId: 'store-88882013-866e-434f-8999-48de5e264888',
  channelKey: 'channel-key-7bf3b7dc-ff6a-77fc-b999-b3cb702e2663',
  paymentId: 'paymentId_202305231417002',
  orderName: '반팔 티셔츠 XL',
  totalAmount: 6000,
  currency: 'CURRENCY_KRW',
  payMethod: 'CARD'
}

onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://cdn.portone.io/v2/browser-sdk.js'
  script.async = true
  document.head.appendChild(script)
})

const requestPayment = async () => {
  if (!window.PortOne) {
    alert('결제 모듈이 아직 로드되지 않았습니다.')
    return
  }
  try {
    const response = await window.PortOne.requestPayment(data)
    console.log('결제 응답:', response)
    // TODO: 결제 성공/실패 처리
  } catch (error) {
    console.error('결제 오류:', error)
  }
}
</script>