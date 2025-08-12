<template>
  <div class="min-h-screen w-full bg-base-bg text-text-base overflow-hidden relative">
    <!-- top -->
    <div class="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-5">
      <button class="text-sm text-subtle-text" @click="complete">건너뛰기</button>
      <div class="flex gap-2">
        <span
          v-for="i in slides.length"
          :key="i"
          class="w-2 h-2 rounded-full"
          :class="i - 1 === idx ? 'bg-brand-primary' : 'bg-subtle-border'"
        />
      </div>
    </div>

    <!-- slides -->
    <div class="h-screen w-full relative">
      <transition name="fade" mode="out-in">
        <div
          :key="idx"
          class="h-full w-full flex flex-col items-center justify-center px-6 pt-24 pb-28"
        >
          <!-- 1. 팬카드 -->
          <div v-if="idx === 0" class="w-full max-w-sm text-center space-y-6">
            <div class="relative h-56 w-full mx-auto">
              <div
                class="absolute inset-0 bg-gradient-to-b from-subtle-bg to-base-bg rounded-2xl overflow-hidden"
              >
                <div
                  class="absolute -inset-x-10 -bottom-10 h-48 bg-[radial-gradient(circle,_#EFEFEF,_transparent_60%)] animate-parallax"
                ></div>
              </div>
              <div class="absolute inset-0 flex items-center justify-center">
                <MockCard
                  labelLeft="Fan.zip Creator CARD"
                  labelRight="OFFICIAL"
                  name="당신의 카드를 만들어주세요"
                  date="2025.08.01"
                />
              </div>
            </div>
            <h2 class="text-2xl font-bold">공식 팬카드로 팬신뢰 업</h2>
            <p class="text-subtle-text">팬들을 위한 카드를 만들어주세요!</p>
          </div>

          <!-- 2. 공동구매 (간결 안내) -->
          <div v-else-if="idx === 1" class="w-full max-w-sm space-y-6 text-center">
            <FeatureBoard :title="'공동구매로 굿즈 판매를 더 쉽게'">
              <div class="relative h-48 w-full mx-auto">
                <Polaroid caption="한정 MD" :image="goods" class="rotate-[-4deg] animate-stack-1" />
                <Polaroid
                  caption="판매 미리보기"
                  :image="sale"
                  class="rotate-[3deg] animate-stack-2"
                />
              </div>
            </FeatureBoard>
            <p class="text-subtle-text text-sm">팬들을 위한 공동구매를 시작해보세요.</p>
          </div>

          <!-- 3. 지표(막대그래프) — 수익/팬 증가 추이 -->
          <div v-else-if="idx === 2" class="w-full max-w-sm space-y-6 text-center">
            <div class="relative w-full mx-auto grid grid-cols-2 gap-3 items-stretch">
              <div
                class="bg-white rounded-xl border border-subtle-border p-3 shadow-sm flex flex-col"
              >
                <div class="text-[11px] text-subtle-text mb-2 text-left">월별 매출(막대)</div>
                <BarChartMock
                  :heights="[22, 28, 24, 34, 38, 32, 35, 31]"
                  bar-class="bg-gradient-to-t from-brand-accent to-brand-primary"
                />
              </div>
              <div
                class="bg-white rounded-xl border border-subtle-border p-3 shadow-sm flex flex-col"
              >
                <div class="text-[11px] text-subtle-text mb-2 text-left">팬 증가(막대)</div>
                <BarChartMock
                  :heights="[14, 18, 16, 22, 26, 24, 27, 25]"
                  bar-class="bg-gradient-to-t from-brand-accent to-brand-primary"
                />
              </div>
            </div>
            <h2 class="text-2xl font-bold pt-8">수익·팬 증가 추이를 한눈에</h2>
            <p class="text-subtle-text">그래프로 최근 흐름을 빠르게 파악하세요.</p>
          </div>

          <!-- 4. AI 분석 리포트(텍스트만, 친근 톤) -->
          <div v-else-if="idx === 3" class="w-full max-w-sm space-y-6 text-center">
            <div class="relative h-64 w-full mx-auto flex items-center justify-center">
              <div
                class="w-full rounded-2xl bg-white border border-subtle-border shadow-sm p-4 text-left"
              >
                <div class="flex items-center gap-2 mb-3">
                  <div class="w-8 h-8 rounded-full bg-subtle-bg flex items-center justify-center">
                    🤖
                  </div>
                  <div class="text-sm font-semibold">Fan.zip AI 리포트</div>
                </div>
                <p
                  class="rounded-xl px-3 py-2 text-sm leading-relaxed bg-subtle-bg border border-subtle-border mb-2"
                >
                  지난주 흐름 좋아요! 매출과 신규 팬이 모두 안정적으로 올라왔어요. 👏
                </p>
                <div
                  class="rounded-xl px-3 py-2 text-sm leading-relaxed bg-brand-primary/20 border border-brand-primary/50 mb-2"
                >
                  하이라이트
                  <ul class="list-disc ml-4 mt-1 space-y-0.5">
                    <li>주중 활동이 고르게 유지</li>
                    <li>굿즈 관심 클릭이 소폭 상승</li>
                    <li>팬미팅 이후 팬 증가</li>
                  </ul>
                </div>
                <p
                  class="rounded-xl px-3 py-2 text-sm leading-relaxed bg-subtle-bg border border-subtle-border"
                >
                  이번 주는 공지 + 굿즈 티저를 함께 올려볼까요? 궁금증을 톡톡 자극해요 😉
                </p>
              </div>
            </div>
            <h2 class="text-2xl font-bold pt-8">AI가 가볍게 정리해드려요</h2>
            <p class="text-subtle-text">핵심만 착—하고 알려주는 친절 리포트.</p>
          </div>

          <!-- 5. CTA: 심사 신청 -->
          <div v-else class="w-full max-w-sm space-y-8 text-center">
            <div class="relative h-56 w-full mx-auto">
              <div class="absolute inset-0 flex items-center justify-center">
                <MockCard
                  dark
                  labelLeft="Fan.zip Creator CARD"
                  labelRight="OFFICIAL"
                  name="팬들을 위한 팬카드"
                  date="2025.08.01"
                />
              </div>
            </div>
            <h2 class="text-2xl font-bold">지금 인플루언서 심사 신청하기</h2>
            <button
              class="w-full h-12 rounded-full bg-brand-primary text-text-base font-semibold shadow-md animate-bouncein active:opacity-90"
              @click="goApply"
            >
              심사 신청하기
            </button>
            <button
              class="w-full h-12 rounded-full border border-subtle-border text-nav-active font-semibold"
              @click="complete"
            >
              일단 둘러보기
            </button>
          </div>
        </div>
      </transition>
    </div>

    <!-- bottom nav -->
    <div class="absolute bottom-0 left-0 right-0 z-20 p-5 flex items-center justify-between">
      <button class="text-sm text-subtle-text" :disabled="idx === 0" @click="prev">이전</button>
      <button
        v-if="idx < slides.length - 1"
        class="text-sm font-semibold text-nav-active"
        @click="next"
      >
        다음
      </button>
      <button v-else class="text-sm font-semibold text-nav-active" @click="complete">
        메인으로
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, defineComponent, h } from 'vue'
import { useRouter } from 'vue-router'

import goods from '@/assets/onboarding/goods.png'
import sale from '@/assets/onboarding/sale.png'

const router = useRouter()
const slides = ref([0, 1, 2, 3, 4]) // 5장(팬미팅 슬라이드 제거 후 재배치)
const idx = ref(0)

const next = () => {
  if (idx.value < slides.value.length - 1) idx.value++
}
const prev = () => {
  if (idx.value > 0) idx.value--
}

const complete = () => {
  try {
    localStorage.setItem('hasSeenInfOnboarding', '1')
  } catch (e) {}
  router.push('/')
}
const goApply = () => {
  try {
    localStorage.setItem('hasSeenInfOnboarding', '1')
  } catch (e) {}
  router.push('/influencer/apply')
}

/** 공용 카드 */
const MockCard = defineComponent({
  name: 'MockCard',
  props: { labelLeft: String, labelRight: String, name: String, date: String, dark: Boolean },
  setup(props) {
    return () =>
      h(
        'div',
        {
          class:
            'w-72 h-40 rounded-xl text-white shadow-xl animate-flip flex flex-col justify-between p-4',
          style: props.dark
            ? 'background: linear-gradient(135deg, #1c1c1c, #000 60%, #111); border:1px solid rgba(255,214,51,.35);'
            : 'background: linear-gradient(135deg, #111, #222 60%, #000);',
        },
        [
          h('div', { class: 'flex items-center justify-between' }, [
            h('span', { class: 'text-xs opacity-80' }, props.labelLeft || 'Creator CARD'),
            h('span', { class: 'text-xs opacity-80' }, props.labelRight || 'OFFICIAL'),
          ]),
          h('div', { class: 'text-left' }, [
            h('div', { class: 'text-lg font-semibold' }, props.name || '아티스트명'),
            h('div', { class: 'text-xs opacity-70' }, props.date || '2025.08.01'),
          ]),
        ],
      )
  },
})

/** 폴라로이드 */
const Polaroid = defineComponent({
  name: 'Polaroid',
  props: { caption: String, image: String, class: String },
  setup(props) {
    return () =>
      h(
        'div',
        {
          class: `bg-white rounded-md shadow-lg border border-subtle-border overflow-hidden inline-block ${props.class || ''}`,
        },
        [
          h(
            'div',
            { class: 'w-40 h-28 bg-subtle-bg flex items-center justify-center overflow-hidden' },
            props.image
              ? [h('img', { src: props.image, class: 'w-full h-full object-cover' })]
              : [h('div', { class: 'w-12 h-12 bg-base-border' })],
          ),
          h('div', { class: 'p-2 text-[11px] text-nav-active' }, props.caption || ''),
        ],
      )
  },
})

/** 섹션 보드 래퍼 */
const FeatureBoard = defineComponent({
  name: 'FeatureBoard',
  props: {
    title: String,
    height: { type: String, default: 'h-50' }, // ← 높이 조절
    spacing: { type: String, default: 'space-y-4' }, // ← 간격 조절
  },
  setup(props, { slots }) {
    return () =>
      h('div', { class: `w-full text-center ${props.spacing}` }, [
        h(
          'div',
          {
            class: `relative ${props.height} w-full mx-auto flex items-center justify-center gap-4`,
          },
          slots.default ? slots.default() : null,
        ),
        h('h2', { class: 'text-2xl font-bold' }, props.title || ''),
      ])
  },
})

/** 막대그래프 목업 — heights 배열로 기둥 높이 제어 */
const BarChartMock = defineComponent({
  name: 'BarChartMock',
  props: {
    heights: { type: Array, default: () => [20, 24, 22, 30, 34, 28] },
    step: { type: Number, default: 18 }, // 막대 간격
    barClass: { type: String, default: 'bg-brand-primary' }, // 🔶 기본 노랑
  },
  setup(props) {
    return () =>
      h(
        'div',
        { class: 'w-full h-24 relative' },
        props.heights.map((hVal, i) =>
          h('div', {
            class: `absolute bottom-0 w-4 ${props.barClass} rounded-sm`,
            style: `left:${i * props.step}px;height:${hVal}px;opacity:${Math.min(1, 0.85 - i * 0.02)}`,
          }),
        ),
      )
  },
})
</script>

<style scoped>
/* 트랜지션 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 공용 애니메이션 */
@keyframes parallax {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-10px);
  }
}
.animate-parallax {
  animation: parallax 3s ease-in-out infinite alternate;
}

@keyframes stackIn {
  from {
    transform: translateY(12px) scale(0.96);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}
.animate-stack-1 {
  animation: stackIn 0.5s ease both 0.1s;
  filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.08));
}
.animate-stack-2 {
  animation: stackIn 0.5s ease both 0.25s;
  filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.08));
}

@keyframes flipIn {
  0% {
    transform: rotateY(-80deg) scale(0.96);
    opacity: 0;
  }
  60% {
    transform: rotateY(10deg) scale(1.02);
    opacity: 1;
  }
  100% {
    transform: rotateY(0) scale(1);
  }
}
.animate-flip {
  transform-style: preserve-3d;
  animation: flipIn 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
</style>
