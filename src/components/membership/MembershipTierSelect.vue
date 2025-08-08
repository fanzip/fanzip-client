<script setup>
import { watchEffect } from 'vue'

/** DB에서 가져온 등급 배열 주입: [{ gradeId, gradeName, monthlyAmount, ... }] */
const props = defineProps({
  grades: { type: Array, default: () => [] },
})

/** 부모와 v-model:select-tier로 양방향 바인딩 */
const selectedTier = defineModel('selectTier')

const fmt = (v) => new Intl.NumberFormat('ko-KR').format(Number(v))

/** 등급이 로딩되면 초기 선택값 보정 (없으면 첫 등급 선택) */
watchEffect(() => {
  if (!props.grades.length) return
  const keys = props.grades.map((g) => g.gradeName)
  if (!keys.includes(selectedTier.value)) {
    selectedTier.value = keys[0]
  }
})
</script>

<template>
  <div class="bg-white rounded-lg">
    <h2 class="font-bold text-base mb-4">멤버십 선택</h2>

    <label
      class="flex items-center justify-between mb-3 cursor-pointer"
      v-for="g in props.grades"
      :key="g.gradeId ?? g.gradeName"
    >
      <div class="flex items-center gap-3">
        <input
          type="radio"
          name="membership"
          :value="g.gradeName"
          v-model="selectedTier"
          class="sr-only"
        />
        <div class="relative w-4 h-4 rounded-full border border-subtle-border flex-shrink-0">
          <div
            v-if="selectedTier === g.gradeName"
            class="absolute top-1/2 left-1/2 w-[10px] h-[10px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-accent"
          />
        </div>
        <!-- 뱃지 표시 부분 -->
        <span class="badge" :class="'badge-' + g.gradeName.toLowerCase()">
          {{ String(g.gradeName).toUpperCase() }}
        </span>
      </div>

      <span class="font-medium"> ₩ {{ fmt(g.monthlyAmount) }}/월 </span>
    </label>

    <!-- 로딩 중 메시지 (선택) -->
    <div v-if="!props.grades.length" class="text-sm text-gray-400">등급 정보를 불러오는 중…</div>
  </div>
</template>
