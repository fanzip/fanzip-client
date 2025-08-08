<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api'
import ChevronIcon from '@/assets/membership/IoChevronBackSharp.svg'

const tiers = ref([])         // API 데이터 저장 [{gradeId, gradeName, benefitsDescription, color, monthlyAmount}]
const opened = ref(null)      // 펼쳐진 등급명

// 혜택 문장을 • 리스트로 만들기
const splitBenefits = (s) =>
  (s ?? '')
    .split('+')               // DB에 ' + '로 연결돼 있으니 플러스 기준
    .map(v => v.trim())
    .filter(Boolean)

const toggle = (name) => {
  opened.value = opened.value === name ? null : name
}

// 텍스트 컬러(간단 대비 처리)
const textColorFor = (hex) => {
  if (!hex) return 'text-black'
  const h = hex.replace('#','')
  const r = parseInt(h.substring(0,2),16)
  const g = parseInt(h.substring(2,4),16)
  const b = parseInt(h.substring(4,6),16)
  const luminance = (0.299*r + 0.587*g + 0.114*b)
  return luminance < 140 ? 'text-white' : 'text-black'
}

onMounted(async () => {
  try {
    const { data } = await api.get('/api/memberships/grades')
    // 필요시 여기서 원하는 순서로 sort
    tiers.value = data
  } catch (e) {
    console.error('멤버십 등급 조회 실패', e)
  }
})
</script>

<template>
  <div class="bg-white rounded-lg">
    <h2 class="font-bold text-[16px] mb-4">멤버십 등급별 혜택</h2>

    <div v-for="t in tiers" :key="t.gradeId" class="mb-3">
      <!-- 상단 바 -->
      <div
        class="flex items-center justify-between px-4 py-3 rounded-[8px] shadow cursor-pointer transition"
        :class="[ opened===t.gradeName ? 'rounded-t-[8px] rounded-b-none' : 'rounded-[8px]', textColorFor(t.color) ]"
        :style="{ backgroundColor: t.color || '#EFEFEF' }"
        @click="toggle(t.gradeName)"
      >
        <span class="font-bold">
          {{ t.gradeName }}
        </span>
        <img :src="ChevronIcon" alt="" class="w-[18px] h-[18px]" :class="{ 'rotate-180': opened===t.gradeName }" />
      </div>

      <!-- 혜택 리스트 -->
      <ul v-show="opened===t.gradeName" class="bg-white text-[14px] px-5 py-3 shadow-lg rounded-b-[8px]">
        <li v-for="(b, i) in splitBenefits(t.benefitsDescription)" :key="i" class="mb-1">• {{ b }}</li>
      </ul>
    </div>
  </div>
</template>
