<script setup>
import { computed } from 'vue'
import DateTimeStepper from './DateTimeStepper.vue'
import calendarIcon from '@/assets/mypage/calendar.svg'
import chevronDown from '@/assets/membership/IoChevronBackSharp.svg'

const props = defineProps({
  modelValue: { type: Object, required: true },
})

const emit = defineEmits(['update:modelValue'])
const form = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

function setField(key, val) {
  form.value = { ...form.value, [key]: val }
}

function onInput(key, e) {
  setField(key, e.target.value)
}
</script>

<template>
  <div class="w-full px-5 space-y-4">
    <hr />
    <!-- 제목 -->
    <div>
      <label class="block font-semibold text-base mb-2">제목</label>
      <input
        type="text"
        class="w-full h-11 px-4 rounded-xl border border-base-border bg-base-bg text-sm focus:outline-none focus:border-brand-primary"
        placeholder="팬미팅 제목을 입력하세요"
        :value="form.title"
        @input="onInput('title', $event)"
      />
    </div>

    <!-- 설명 -->
    <div>
      <label class="block font-semibold text-base mb-3">설명</label>
      <textarea
        rows="3"
        class="w-full px-4 py-3 rounded-xl border border-base-border bg-base-bg text-sm resize-none focus:outline-none focus:border-brand-primary"
        placeholder="설명을 입력하세요"
        :value="form.description"
        @input="onInput('description', $event)"
      />
    </div>

    <hr />

    <!-- 팬미팅 일시 -->
    <div>
      <label class="block text-sm font-semibold text-base mb-2 mt-5">팬미팅 일시</label>
      <DateTimeStepper
        :model-value="form.meetingDate"
        @update:modelValue="(v) => setField('meetingDate', v)"
        :minute-step="30"
      >
        <template #prefix>
          <img :src="calendarIcon" alt="" class="w-4 h-4 shrink-0" />
        </template>
        <template #suffix>
          <img :src="chevronDown" alt="" class="w-4 h-4 shrink-0" />
        </template>
      </DateTimeStepper>
    </div>

    <!-- 일반 예매 오픈 -->
    <div>
      <label class="block text-sm font-semibold text-base mb-2">일반 예매 오픈</label>
      <DateTimeStepper
        :model-value="form.generalOpenTime"
        @update:modelValue="(v) => setField('generalOpenTime', v)"
        :minute-step="30"
      >
        <template #prefix>
          <img :src="calendarIcon" alt="" class="w-4 h-4 shrink-0" />
        </template>
        <template #suffix> <img :src="chevronDown" alt="" class="w-4 h-4 shrink-0" /> </template
      ></DateTimeStepper>
    </div>
  </div>
</template>
