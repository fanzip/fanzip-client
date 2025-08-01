<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const cards = ref([
  {
    id: 1,
    name: 'CalmDownMan',
    src: new URL('@/assets/fancard/CalmDownMan.svg', import.meta.url).href,
    grade: 'Gold',
  },
  {
    id: 2,
    name: 'CharlesEnter',
    src: new URL('@/assets/fancard/CharlesEnter.svg', import.meta.url).href,
    grade: 'VIP',
  },
  {
    id: 3,
    name: 'TaeHa',
    src: new URL('@/assets/fancard/TaeHa.svg', import.meta.url).href,
    grade: 'Gold',
  },
  {
    id: 4,
    name: 'TomoTomo',
    src: new URL('@/assets/fancard/TomoTomo.svg', import.meta.url).href,
    grade: 'White',
  },
  {
    id: 5,
    name: 'YeoDanO',
    src: new URL('@/assets/fancard/YeoDanO.svg', import.meta.url).href,
    grade: 'Silver',
  },
])

const activeIndex = ref(2)

const handleCardClick = (index, card) => {
  if (index !== activeIndex.value) {
    activeIndex.value = index
    return
  }
  router.push({ name: 'FanCardDetailPage', params: { id: String(card.id) } }).catch(() => {})
}

const getBadgeClass = (grade) => {
  switch (grade) {
    case 'VIP':
      return 'badge badge-vip'
    case 'Gold':
      return 'badge badge-gold'
    case 'Silver':
      return 'badge badge-silver'
    case 'White':
      return 'badge badge-white'
    default:
      return 'badge'
  }
}
</script>

<template>
  <div class="w-full max-w-xs md:max-w-sm mx-auto px-4 py-4 space-y-4">
    <div
      v-for="(card, index) in cards"
      :key="card.id"
      class="relative rounded-xl overflow-hidden w-full h-45 shadow-md cursor-pointer transition-opacity duration-300"
      :class="{
        'opacity-100 pointer-events-auto': index === activeIndex,
        'opacity-50 pointer-events-none': index !== activeIndex,
      }"
      @click.stop="handleCardClick(index, card)"
    >
      <img
        :src="card.src"
        :alt="card.name"
        class="w-full h-full object-cover pointer-events-none"
      />
      <span class="absolute top-3 right-3 badge" :class="getBadgeClass(card.grade)">
        {{ card.grade }}
      </span>
    </div>
  </div>
</template>
