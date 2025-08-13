<script setup>
import { computed, ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'

const props = defineProps({
  data: { type: Array, required: true }, // [{ label:'3월', value: 9200000 }, ...] (value는 숫자!)
  yTicks: { type: Number, default: 4 },
  max: { type: Number, default: 0 },
  height: { type: Number, default: 320 },
  type: { type: String },
  // 애니메이션 옵션
  animate: { type: Boolean, default: true },
  duration: { type: Number, default: 700 }, // ms
  stagger: { type: Number, default: 80 }, // 막대 간 딜레이
  easing: { type: String, default: 'cubic-bezier(.25,.8,.25,1)' },
  animateOnVisible: { type: Boolean, default: true }, // 화면에 보일 때 시작
})

const rootEl = ref(null)
let observer = null

const maxValue = computed(() => {
  const m = Math.max(...props.data.map((d) => Number(d.value) || 0), 0)
  return props.max > 0 ? props.max : niceMax(m)
})

const ticks = computed(() => {
  const out = []
  const step = maxValue.value / props.yTicks
  for (let i = 0; i <= props.yTicks; i++) {
    const v = step * i
    out.push({ value: v, percent: (i / props.yTicks) * 100 })
  }
  return out
})

const fmt = (n) => (Number(n) || 0).toLocaleString('ko-KR')
const ratioNum = (v) => ((Number(v) || 0) / maxValue.value) * 100

// --- 애니메이션 상태: 각 막대의 현재 높이(%) ---
const heights = ref([]) // [0, 0, ...]
const targetHeights = computed(() => props.data.map((d) => ratioNum(d.value)))

function primeHeightsToZero() {
  heights.value = targetHeights.value.map(() => 0)
}
function playAnimation() {
  if (!props.animate) {
    heights.value = targetHeights.value
    return
  }
  nextTick(() => {
    // 한 프레임 뒤에 값 변경 -> CSS transition 발동
    requestAnimationFrame(() => {
      heights.value = targetHeights.value
    })
  })
}

onMounted(() => {
  primeHeightsToZero()
  if (props.animateOnVisible) {
    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          playAnimation()
          observer && observer.disconnect()
          observer = null
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(rootEl.value)
  } else {
    playAnimation()
  }
})

onBeforeUnmount(() => observer?.disconnect())

// 데이터/최댓값이 바뀌면 다시 재생
watch(
  [() => props.data, maxValue],
  () => {
    primeHeightsToZero()
    playAnimation()
  },
  { deep: true },
)

function niceMax(v) {
  if (v <= 0) return 1
  const p = Math.pow(10, Math.floor(Math.log10(v)) - 1)
  return Math.ceil(v / p) * p
}
</script>

<template>
  <div ref="rootEl" class="relative w-full" :style="{ height: height + 'px' }">
    <!-- 플롯 영역 -->
    <div
      class="absolute right-4 top-10 bottom-5"
      :class="type === 'revenue' ? 'left-16' : 'left-7'"
    >
      <!-- Y 그리드 + 라벨 -->
      <template v-for="(t, i) in ticks" :key="i">
        <div
          class="absolute left-0 right-0 h-px bg-subtle-border"
          :style="{ bottom: t.percent + '%' }"
        />
        <div
          class="absolute -translate-x-full pr-2 text-sm"
          :style="{ bottom: `calc(${t.percent}% - 0.5rem)` }"
        >
          {{ fmt(t.value) }}
        </div>
      </template>

      <!-- Bars -->
      <div class="absolute inset-0 flex items-end gap-4">
        <div v-for="(d, i) in data" :key="i" class="group relative min-w-0 h-full flex-1">
          <div
            class="absolute bottom-0 left-0 w-full shadow-3xl bg-brand-primary"
            :style="{
              height: (heights[i] || 0) + '%',
              //   boxShadow: '5px 5px 10px rgba(0,0,0,0.4)',
              transition: `height ${duration}ms ${easing}`,
              transitionDelay: i * stagger + 'ms',
            }"
          >
            <!-- hover 효과 -->
            <div
              class="z-10 pointer-events-none absolute left-1/2 bottom-[calc(100%+8px)] -translate-x-1/2 -translate-y-1 whitespace-nowrap rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm font-semibold text-gray-900 opacity-0 shadow transition-all duration-200 group-hover:opacity-100 group-hover:-translate-y-2"
            >
              {{ fmt(d.value) }}원
            </div>
          </div>

          <div class="absolute inset-x-0 -bottom-7 text-center text-xs">
            {{ d.label }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
