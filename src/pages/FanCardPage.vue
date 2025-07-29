<script setup>
import AppHeader from '@/components/layout/AppHeader.vue'
import AppNav from '@/components/layout/AppNav.vue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'


const router = useRouter()

const srcList = [
  new URL('@/assets/fancard/CalmDownMan.svg', import.meta.url).href,
  new URL('@/assets/fancard/CharlesEnter.svg', import.meta.url).href,
  new URL('@/assets/fancard/TaeHa.svg', import.meta.url).href,
  new URL('@/assets/fancard/TomoTomo.svg', import.meta.url).href,
  new URL('@/assets/fancard/YeoDanO.svg', import.meta.url).href,
]

const cards = ref(
  Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    name: `Card${i + 1}`,
    src: srcList[i % srcList.length],
    grade: ['VIP', 'Gold', 'Silver', 'White'][i % 4],
  })),
)

const activeIndex = ref(0)

const visibleCards = computed(() => {
  const range = 2
  const total = cards.value.length
  const result = []

  for (let i = -range; i <= range; i++) {
    const realIndex = (activeIndex.value + i + total) % total
    result.push({ card: cards.value[realIndex], realIndex })
  }

  return result
})

const handleCardClick = (realIndex) => {
  if (realIndex !== activeIndex.value) {
    activeIndex.value = realIndex
    return
  }
  const card = cards.value[realIndex]
  router.push({ name: 'FanCardDetailPage', params: { id: String(card.id) } })
}

let scrollCooldown = false

const onScroll = (e) => {
  if (scrollCooldown) return
  scrollCooldown = true

  activeIndex.value =
    e.deltaY > 0
      ? (activeIndex.value + 1) % cards.value.length
      : (activeIndex.value - 1 + cards.value.length) % cards.value.length

  setTimeout(() => {
    scrollCooldown = false
  }, 150)
}

let startY = 0
let dragging = false

const startDrag = (e) => {
  dragging = true
  startY = e.touches ? e.touches[0].clientY : e.clientY
}

const onDrag = (e) => {
  if (!dragging) return
  const currentY = e.touches ? e.touches[0].clientY : e.clientY
  const diffY = currentY - startY

  if (Math.abs(diffY) > 50) {
    activeIndex.value =
      diffY > 0
        ? (activeIndex.value - 1 + cards.value.length) % cards.value.length
        : (activeIndex.value + 1) % cards.value.length
    startY = currentY
  }
}

const endDrag = () => {
  dragging = false
}

const getCardStyle = (cardIndex) => {
  const total = cards.value.length
  let offset = cardIndex - activeIndex.value

  if (offset > total / 2) offset -= total
  if (offset < -total / 2) offset += total

  let translateY, scale, opacity, boxShadow

  if (offset === 0) {
    translateY = 0
    scale = 1
    opacity = 1
    boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)'
  } else if (Math.abs(offset) === 1) {
    translateY = offset > 0 ? 120 : -120
    scale = 0.85
    opacity = 0.6
    boxShadow = '0 5px 10px rgba(0,0,0,0.05)'
  } else {
    translateY = offset > 0 ? 200 : -200
    scale = 0.7
    opacity = 0.3
    boxShadow = 'none'
  }

  const zIndex = 100 - Math.abs(offset)

  return {
    transform: `translate(-50%, -50%) translateY(${translateY}px) scale(${scale})`,
    opacity,
    zIndex,
    boxShadow,
    transformStyle: 'preserve-3d',
    transition: 'transform 0.6s cubic-bezier(0.33, 1, 0.68, 1), opacity 0.6s ease',
    cursor: 'pointer',
  }
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
  <div class="min-h-screen bg-[#f3f4f6]">
    <header>
      <AppHeader type="logo" />
    </header>
    <div
      class="relative w-full h-[60vh] max-w-xs md:max-w-sm mx-auto mt-28 touch-pan-y select-none"
      @wheel="onScroll"
      @mousedown="startDrag"
      @mousemove="onDrag"
      @mouseup="endDrag"
      @mouseleave="endDrag"
      @touchstart="startDrag"
      @touchmove="onDrag"
      @touchend="endDrag"
    >
      <div
        v-for="({ card, realIndex }, i) in visibleCards"
        :key="card.name"
        class="absolute top-1/2 left-1/2 w-80 h-45 bg-white rounded-xl overflow-hidden cursor-pointer"
        :style="getCardStyle(realIndex)"
        @click="handleCardClick(realIndex)"
      >
        <img :src="card.src" :alt="card.name" class="w-full h-full object-cover" />
        <div class="absolute bottom-2 left-2 text-white text-lg font-bold drop-shadow">
          {{ card.name }}
        </div>
        <span
          class="absolute top-2 right-2 w-20 h-6 text-base font-bold flex items-center justify-center rounded-full"
          :class="getBadgeClass(card.grade)"
        >
          {{ card.grade }}
        </span>
      </div>
    </div>
    <app-nav />
  </div>
</template>