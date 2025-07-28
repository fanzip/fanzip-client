<script setup>
import { ref, watch, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import AppHeader from '@/components/layout/AppHeader.vue'

const authStore = useAuthStore()

const name = ref('')
const phone = ref('')

const nameError = ref('')
const phoneError = ref('')

watch(name, (newVal) => {
  if (!newVal.trim()) {
    nameError.value = '이름을 한 글자 이상 입력해주세요.'
  } else {
    nameError.value = ''
  }
})
watch(phone, (newVal) => {
  if (!newVal.trim()) {
    phoneError.value = '휴대전화 번호를 입력해주세요.'
  } else if (/[^\d]/.test(newVal)) {
    phoneError.value = '숫자만 입력해주세요. (- 없이 입력)'
  } else if (!/^\d{10,11}$/.test(newVal)) {
    phoneError.value = '휴대전화 번호는 10~11자리 숫자여야 합니다.'
  } else {
    phoneError.value = ''
  }
})

const isFormValid = computed(() => {
  return (
    nameError.value === '' &&
    phoneError.value === '' &&
    name.value.trim() !== '' &&
    phone.value.trim() !== ''
  )
})

const handleRegister = async () => {
  if (!isFormValid.value) return
  await authStore.registerUser({ name: name.value, phone: phone.value })
}
</script>
<template>
  <AppHeader type="logo" />
  <div class="min-h-screen flex flex-col items-center justify-cente px-5">
    <form @submit.prevent="handleRegister" class="w-full max-w-md">
      <div class="mt-28 px-5">
        <span>이름</span>
        <input
          type="text"
          placeholder="이름을 입력하세요."
          v-model="name"
          class="w-full border-0 border-b subtle-border focus:outline-none"
        />
        <p v-if="nameError" class="text-emphasis text-sm mt-1">{{ nameError }}</p>
      </div>

      <div class="mt-16 px-5">
        <span>휴대전화</span>
        <input
          type="text"
          placeholder="휴대전화 번호를 입력하세요."
          v-model="phone"
          class="w-full border-0 border-b subtle-border focus:outline-none"
        />
        <p v-if="phoneError" class="text-red-500 text-sm mt-1">{{ phoneError }}</p>
      </div>
      <button
        class="btn btn-primary w-full disabled:bg-gray-300 disabled:cursor-not-allowed mt-28"
        :disabled="!isFormValid"
      >
        가입 완료하기
      </button>
    </form>
  </div>
</template>
