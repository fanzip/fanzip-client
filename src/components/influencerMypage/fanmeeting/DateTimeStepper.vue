<script setup>
import { ref, computed, watch } from 'vue'
import DatePicker from '@vuepic/vue-datepicker'
import { ko } from 'date-fns/locale'
import '@vuepic/vue-datepicker/dist/main.css'


const props = defineProps({
  modelValue: { type: String, default: '' },          // 'YYYY-MM-DDTHH:mm' or 'YYYY-MM-DD'
  placeholder: { type: String, default: '연도-월-일 -- --:--' },
  minuteStep: { type: Number, default: 10 },          // 5/10/30 등
  dateOnly:   { type: Boolean, default: false },      // ✅ 추가: true면 날짜만
})
const emit = defineEmits(['update:modelValue'])

const open = ref(false)
const step = ref('date') // 'date' | 'time'
const selDate = ref(null) // Date
const selTime = ref('')   // 'HH:mm'

// modelValue → 내부 상태 동기화
function syncFromModel() {
  if (!props.modelValue) {
    selDate.value = null
    selTime.value = ''
    return
  }
  const [d, t = ''] = props.modelValue.split('T')
  selDate.value = d ? new Date(d) : null
  selTime.value = t.slice(0, 5)
}
watch(() => props.modelValue, syncFromModel, { immediate: true })

function join(d, t) {
  if (!d) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  // ✅ dateOnly면 시간 없이 반환
  return props.dateOnly ? `${y}-${m}-${day}` : `${y}-${m}-${day}T${t || '00:00'}`
}

function openSheet() {
  syncFromModel()
  step.value = 'date'
  open.value = true
}
function next() {
  if (selDate.value) {
    if (props.dateOnly) {
      // ✅ 날짜만 모드: 바로 확정
      emit('update:modelValue', join(selDate.value, ''))
      open.value = false
    } else {
      step.value = 'time'
    }
  }
}
function back() { step.value = 'date' }
function apply() {
  emit('update:modelValue', join(selDate.value, selTime.value))
  open.value = false
}

const display = computed(() => {
  if (!props.modelValue) return ''
  // 'YYYY-MM-DD' or 'YYYY-MM-DDTHH:mm'
  if (props.dateOnly) return props.modelValue
  const [d, t] = props.modelValue.split('T')
  if (!t) return d
  const [H, M] = t.split(':').map(Number)
  const ampm = H >= 12 ? '오후' : '오전'
  const hh = ((H + 11) % 12) + 1
  return `${d} ${ampm} ${String(hh).padStart(2, '0')}:${String(M).padStart(2, '0')}`
})

// 시간 목록
const times = computed(() => {
  const perHour = 60 / props.minuteStep
  return Array.from({ length: 24 * perHour }, (_, i) => {
    const h = Math.floor(i / perHour)
    const m = (i % perHour) * props.minuteStep
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  })
})
</script>

<template>
  <!-- 읽기전용 표시 입력 -->
  <button
  type="button"
  class="w-full h-11 px-4 rounded-xl border border-base-border bg-base-bg text-sm
         flex items-center justify-between"
  @click="openSheet"
>
  <!-- 왼쪽 묶음: 아이콘 + 라벨 -->
  <span class="flex items-center gap-2 truncate">
    <!-- 왼쪽 아이콘 슬롯 -->
    <slot name="prefix"></slot>

    <!-- 라벨 -->
    <span class="truncate">
      <span v-if="display">{{ display }}</span>
      <span v-else class="text-subtle-text">{{ placeholder }}</span>
    </span>
  </span>

  <!-- 오른쪽 아이콘 슬롯 -->
  <span class="shrink-0">
    <slot name="suffix"></slot>
  </span>
</button>
  <!-- 바텀시트 -->
  <transition name="fade">
    <div v-if="open" class="fixed inset-0 z-50">
      <div class="absolute inset-0 bg-black/30" @click="open = false"></div>

      <div class="absolute inset-x-0 bottom-0 bg-base-bg rounded-t-2xl p-4 shadow-xl">
        <div class="mx-auto max-w-md">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-base font-semibold">
              {{ step === 'date' ? '날짜 선택' : '시간 선택' }}
            </h3>
            <button class="text-sm text-subtle-text" @click="open = false">닫기</button>
          </div>

          <!-- 날짜 스텝 -->
          <div v-if="step === 'date'">
            <DatePicker
              v-model="selDate"
              :inline="true"
              :auto-apply="true"
              :enable-time-picker="false"
              :locale="ko"
              :year-first="true"
              :week-start="0"
            >
              <!-- ✅ 헤더: 2025년 8월 -->
              <template #month-year="{ month, year, handleMonthYearChange }">
                <div class="flex items-center justify-between px-2 py-1">
                  <button type="button" class="p-1" @click="handleMonthYearChange(false)">‹</button>
                  <div class="font-semibold">{{ year }}년 {{ month + 1 }}월</div>
                  <button type="button" class="p-1" @click="handleMonthYearChange(true)">›</button>
                </div>
              </template>
            </DatePicker>

            <div class="mt-3 flex gap-2">
              <button class="flex-1 h-10 rounded-xl border" @click="open = false">취소</button>
              <button
                class="flex-1 h-10 rounded-xl bg-brand-primary text-base disabled:opacity-40"
                :disabled="!selDate"
                @click="next"
              >
                {{ props.dateOnly ? '확인' : '다음' }}
              </button>
            </div>
          </div>

          <!-- 시간 스텝 (dateOnly=false일 때만) -->
          <div v-else>
            <div class="grid grid-cols-4 gap-2 max-h-44 overflow-y-auto">
              <button
                v-for="t in times"
                :key="t"
                type="button"
                class="h-10 rounded-lg border text-sm"
                :class="t === selTime ? 'bg-black text-text-inverse border-black' : 'bg-base-bg border-subtle-bg'"
                @click="selTime = t"
              >
                {{ t }}
              </button>
            </div>
            <div class="mt-3 flex gap-2">
              <button class="flex-1 h-10 rounded-xl border" @click="back">이전</button>
              <button
                class="flex-1 h-10 rounded-xl bg-brand-primary text-black font-semibold disabled:opacity-40"
                :disabled="!selTime"
                @click="apply"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,.fade-leave-active{ transition: opacity .15s; }
.fade-enter-from,.fade-leave-to{ opacity:0; }

:deep(.dp__today){ border:1px solid black !important; color:black !important; }
:deep(.dp__active_date){ background-color:black !important; color:white !important; }
</style>
