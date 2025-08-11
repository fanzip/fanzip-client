<script setup>
import { ref, watch, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import AppHeader from '@/components/layout/AppHeader.vue'
import BaseButton from '@/components/common/BaseButton.vue'

const authStore = useAuthStore()

const selectedRole = ref('USER')
const name = ref('')
const phone = ref('')
const nameError = ref('')
const phoneError = ref('')

const roleOptions = [
  {
    value: 'USER',
    title: '팬으로 시작하기 🔥',
    description: '좋아하는 인플루언서의 팬카드를 구매하고 소통해보세요',
    benefits: [
      '인플루언서 팬카드 구매 및 수집',
      '인플루언서 공동구매 마켓 참여',
      '인플루언서 팬미팅 예매',
    ],
  },
  {
    value: 'INFLUENCER',
    title: '인플루언서로 활동하기 😎',
    description: '팬카드를 제작하고 팬들과 소통하며 수익을 창출해보세요',
    benefits: ['팬카드 발급', '공동구매 마켓', '팬미팅 예매'],
  },
]

watch(name, (newVal) => {
  nameError.value = !newVal.trim() ? '한 글자 이상 입력해주세요.' : ''
})

watch(phone, (newVal) => {
  if (!newVal.trim()) {
    phoneError.value = '휴대폰 번호를 입력해주세요.'
  } else if (/[^\d]/.test(newVal)) {
    phoneError.value = '숫자만 입력해주세요. (- 없이 입력)'
  } else if (!/^\d{11}$/.test(newVal)) {
    phoneError.value = '휴대폰 번호는 11자리 숫자여야 합니다.'
  } else {
    phoneError.value = ''
  }
})

const isFormValid = computed(() => {
  return !nameError.value && !phoneError.value && name.value.trim() && phone.value.trim()
})

const handleRegister = async () => {
  if (!isFormValid.value) return
  authStore.setTempRole(selectedRole.value)
  await authStore.registerUser({
    name: name.value,
    phone: phone.value,
  })
}

const selectRole = (role) => {
  selectedRole.value = role
}
</script>

<template>
  <AppHeader type="logo" />

  <div class="min-h-screen flex flex-col items-center px-5 mt-28">
    <form @submit.prevent="handleRegister" class="w-full max-w-md">
      <!-- 페이지 제목 -->
      <header class="mx-3">
        <h1 class="text-xl font-bold">회원정보를 입력해주세요</h1>
      </header>

      <!-- 역할 선택 -->
      <section class="mt-5">
        <div class="space-y-5">
          <button
            v-for="option in roleOptions"
            :key="option.value"
            type="button"
            class="w-full rounded-xl border-2 p-5 text-left transition-colors shadow-md"
            :class="selectedRole === option.value ? 'border-brand-primary' : 'border-subtle-border'"
            @click="selectRole(option.value)"
          >
            <h3 class="font-semibold">{{ option.title }}</h3>
            <p class="text-sm mt-2 text-subtle-text">{{ option.description }}</p>
          </button>
        </div>
      </section>

      <!-- 이름/활동명 입력 -->
      <section class="mt-8">
        <label class="font-medium mx-2">이름</label>
        <input
          type="text"
          placeholder="이름을 입력해주세요."
          v-model="name"
          class="w-full border border-subtle-border rounded-xl focus:outline-none focus:border-brand-primary mt-2 p-3 transition-colors"
        />
        <p v-if="nameError" class="text-red-500 text-sm mt-1 mx-2">
          {{ nameError }}
        </p>
      </section>

      <!-- 휴대폰 번호 입력 -->
      <section class="mt-7">
        <label class="font-medium mx-2">휴대폰 번호</label>
        <input
          type="tel"
          placeholder="휴대폰 번호를 입력해주세요."
          v-model="phone"
          class="w-full border rounded-xl border-subtle-border focus:outline-none focus:border-brand-primary mt-2 p-3 transition-colors"
        />
        <p v-if="phoneError" class="text-red-500 text-sm mt-1 mx-2">
          {{ phoneError }}
        </p>
      </section>

      <!-- 가입 완료 버튼 -->
      <button
        type="submit"
        class="btn btn-primary w-full disabled:bg-subtle-border disabled:cursor-not-allowed mt-16 transition-colors"
        :disabled="!isFormValid"
      >
        가입 완료하기
      </button>
    </form>
  </div>
</template>
