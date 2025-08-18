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
    <div class="h-screen w-full relative overflow-hidden pb-20">
      <transition name="fade" mode="out-in">
        <div :key="idx" class="h-full w-full flex flex-col items-center justify-center px-6">
          <!-- 1. Welcome -->
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
                <div
                  class="w-72 h-40 rounded-xl bg-black text-white shadow-xl animate-zoomfade flex flex-col justify-between p-4"
                  style="
                    background: linear-gradient(135deg, #111, #222 60%, #000);
                    animation-delay: 0.45s;
                  "
                >
                  <div class="flex items-center justify-between">
                    <span class="text-xs opacity-80">Fan.zip digital FAN CARD</span>
                    <span class="text-xs opacity-80">VIP</span>
                  </div>
                  <div class="text-left">
                    <div class="text-lg font-semibold">침착맨</div>
                    <div class="text-xs opacity-70">2023.04.28</div>
                  </div>
                </div>
              </div>
            </div>
            <h2 class="text-xl font-bold">당신의 팬심을 증명하는 디지털 팬카드</h2>
            <p class="text-subtle-text">한 장의 카드로 시작하는 팬 활동의 모든 순간</p>
          </div>

          <!-- 2. 팬카드 기능 -->
          <div v-else-if="idx === 1" class="w-full max-w-sm space-y-6 text-center">
            <div class="relative h-60 w-full mx-auto">
              <div
                class="absolute left-0 top-0 w-[46%] h-full rounded-xl bg-white border border-subtle-border shadow-md flex items-center justify-center overflow-hidden"
              >
                <div class="w-28 h-28 border-2 border-black relative overflow-hidden">
                  <!-- QR 코드 이미지 -->
                  <img :src="qrImage" alt="QR Code" class="w-full h-full object-cover" />
                  <!-- 스캔 라인 -->
                  <div
                    class="absolute inset-x-0 top-0 h-0.5 bg-brand-primary animate-scanline"
                  ></div>
                </div>
              </div>
              <!-- 2번 슬라이드 오른쪽: 게이트 + 좌석 + 입장 애니메이션 -->
              <div
                class="absolute right-0 top-0 w-[46%] h-full rounded-xl bg-subtle-bg border border-subtle-border shadow-inner flex items-center justify-center overflow-hidden"
              >
                <div class="absolute top-1 left-1/2 -translate-x-1/2 z-10">
                  <span class="px-2 py-0.5 text-[10px] rounded bg-nav-active text-white opacity-90"
                    >STAGE</span
                  >
                </div>
                <div class="relative w-28 h-40">
                  <!-- 좌석 그리드 (3x3 예시) -->
                  <!-- 좌석들 -->
                  <div class="absolute inset-0 pointer-events-none z-0">
                    <div class="seat" style="--x: 20%; --y: 25%"></div>
                    <div class="seat" style="--x: 50%; --y: 25%"></div>
                    <div class="seat" style="--x: 80%; --y: 25%"></div>
                    <div class="seat" style="--x: 20%; --y: 55%"></div>
                    <div class="seat" style="--x: 50%; --y: 55%"></div>
                    <div class="seat" style="--x: 80%; --y: 55%"></div>
                    <div class="seat" style="--x: 20%; --y: 85%"></div>
                    <div class="seat" style="--x: 50%; --y: 85%"></div>
                    <div class="seat" style="--x: 80%; --y: 85%"></div>
                  </div>

                  <!-- 중앙 통로 라인(선택) -->
                  <div
                    class="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-subtle-border opacity-60"
                  ></div>

                  <!-- 사람들: 목표 좌석 좌표 -->
                  <div class="person" style="--tx: 50%; --ty: 55%; animation-delay: 0.2s"></div>
                  <div class="person" style="--tx: 20%; --ty: 55%; animation-delay: 0.9s"></div>
                  <div class="person" style="--tx: 80%; --ty: 25%; animation-delay: 1.6s"></div>

                  <!-- 게이트(문짝) -->
                  <div
                    class="absolute left-0 top-0 bottom-0 w-2 bg-nav-active origin-left animate-gate z-20"
                  ></div>
                  <div
                    class="absolute right-0 top-0 bottom-0 w-2 bg-nav-active origin-right animate-gate z-20"
                  ></div>
                </div>
              </div>
            </div>
            <h2 class="text-xl font-bold">QR로 간편 입장, 손쉬운 팬미팅 예약</h2>
            <p class="text-subtle-text">암표, 위조 걱정 없이 안전하게</p>
          </div>

          <!-- 3. 추억 아카이빙 -->
          <div v-else-if="idx === 2" class="w-full max-w-sm space-y-6 text-center">
            <div class="relative h-64 w-full mx-auto">
              <div class="absolute left-6 top-6 w-52 rotate-[-6deg] animate-stack-1 z-10">
                <Polaroid caption="나만의 팬카드" :image="fancard" />
              </div>
              <div class="absolute right-6 top-10 w-40 rotate-[5deg] animate-stack-2 z-10">
                <Polaroid caption="공동구매 굿즈" :image="goods" />
              </div>
              <div class="absolute left-16 bottom-4 w-40 rotate-[1deg] animate-stack-3 z-10">
                <Polaroid caption="2025.03.10 팬미팅" :image="ticket" />
              </div>
            </div>
            <h2 class="text-xl font-bold">좋아하는 인플루언서와의 추억을 한 곳에</h2>
            <p class="text-subtle-text">당신의 팬 여정을 기록하고 간직합니다</p>
          </div>

          <!-- 4. CTA (가입 직후: 팬카드로 이동) -->
          <div v-else class="w-full max-w-sm space-y-8 text-center">
            <div class="relative h-56 w-full mx-auto">
              <div class="absolute inset-0 flex items-center justify-center">
                <div
                  class="w-72 h-40 rounded-xl text-white shadow-xl animate-flip flex flex-col justify-between p-4"
                  style="
                    background: linear-gradient(135deg, #1c1c1c, #000 60%, #111);
                    border: 1px solid rgba(255, 214, 51, 0.35);
                  "
                >
                  <div class="flex items-center justify-between">
                    <span class="text-xs opacity-80">Fan.zip digital FAN CARD</span>
                    <span class="text-xs opacity-80">VIP</span>
                  </div>
                  <div class="text-left">
                    <div class="text-lg font-semibold">침착맨</div>
                    <div class="text-xs opacity-70">2023.04.28</div>
                  </div>
                </div>
              </div>
            </div>
            <h2 class="text-xl font-bold">지금 내 팬카드를 발급해 보세요</h2>
            <button
              class="w-full h-12 rounded-full bg-brand-primary text-text-base font-semibold shadow-md animate-bouncein active:opacity-90"
              @click="complete"
            >
              팬카드 발급하기
            </button>
          </div>
        </div>
      </transition>
    </div>

    <!-- bottom nav - 고정 네비바로 변경 -->
    <!-- bottom nav - 고정 네비바 -->
    <div class="fixed bottom-0 left-0 right-0 z-50 bg-white p-5">
      <div class="flex items-center justify-between">
        <button
          class="flex-1 text-left text-sm px-4 py-2 transition-colors"
          :class="idx === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-subtle-text'"
          :disabled="idx === 0"
          @click="prev"
        >
          이전
        </button>
        <button
          class="flex-1 text-right text-sm px-4 py-2 font-semibold text-nav-active"
          v-if="idx < slides.length - 1"
          @click="next"
        >
          다음
        </button>
        <button
          class="flex-1 text-right text-sm px-4 py-2 font-semibold text-nav-active"
          v-else
          @click="complete"
        >
          메인으로
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineComponent, h } from 'vue'
import { useRouter } from 'vue-router'
import fancard from '@/assets/onboarding/fancard.png'
import goods from '@/assets/onboarding/goods.png'
import ticket from '@/assets/onboarding/mobileTicket.png'
import qrImage from '@/assets/onboarding/qrcode.png'

const Polaroid = defineComponent({
  name: 'Polaroid',
  props: {
    caption: { type: String, default: '' },
    image: { type: String, default: '' },
  },
  setup(props) {
    return () =>
      h(
        'div',
        { class: 'bg-white rounded-md shadow-lg border border-subtle-border overflow-hidden' },
        [
          h(
            'div',
            { class: 'w-full h-28 bg-subtle-bg flex items-center justify-center overflow-hidden' },
            props.image
              ? [h('img', { src: props.image, class: 'w-full h-full object-cover' })]
              : [h('div', { class: 'w-12 h-12 bg-base-border' })],
          ),
          h('div', { class: 'p-2 text-[11px] text-nav-active' }, props.caption),
        ],
      )
  },
})
const router = useRouter()
const slides = ref([0, 1, 2, 3])
const idx = ref(0)

const next = () => {
  if (idx.value < slides.value.length - 1) idx.value++
}
const prev = () => {
  if (idx.value > 0) idx.value--
}

/* 온보딩 종료: 플래그 저장 후 팬카드 화면으로 이동 */
const complete = () => {
  try {
    localStorage.setItem('hasSeenOnboarding', '1')
  } catch (e) {}
  router.push('/')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes zoomfade {
  from {
    transform: scale(0.92);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
.animate-zoomfade {
  animation: zoomfade 0.6s ease both;
}

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

@keyframes scanline {
  0% {
    top: 0;
  }
  100% {
    top: calc(100% - 2px);
  }
}
.animate-scanline {
  animation: scanline 1.8s ease-in-out infinite alternate;
}

@keyframes gateOpen {
  0% {
    transform: scaleX(1);
    opacity: 0.9;
  }
  100% {
    transform: scaleX(0.2);
    opacity: 0.5;
  }
}
.animate-gate {
  animation: gateOpen 1.6s ease-in-out infinite alternate;
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
.animate-stack-3 {
  animation: stackIn 0.5s ease both 0.4s;
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

@keyframes bounceIn {
  0% {
    transform: translateY(8px);
    opacity: 0;
  }
  60% {
    transform: translateY(-3px);
    opacity: 1;
  }
  100% {
    transform: translateY(0);
  }
}
.animate-bouncein {
  animation: bounceIn 0.5s ease 0.4s both;
}
/* 좌석(작은 원) */
.seat {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background: #d8d8d8; /* subtle.border 톤 */
  transform: translate(-50%, -50%);
  left: var(--x);
  top: var(--y);
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.08);
}

/* 좌석 */
.seat {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background: #d8d8d8;
  transform: translate(-50%, -50%);
  left: var(--x);
  top: var(--y);
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.08);
}

/* 사람(시작은 '입구' 중앙 아래쪽) */
.person {
  position: absolute;
  left: 50%; /* 시작 X */
  top: 92%; /* 시작 Y (입구) */
  width: 10px;
  height: 10px;
  border-radius: 9999px;
  background: rgba(58, 58, 58, 0.95);
  transform: translate(-50%, 0) scale(0.9);
  opacity: 0;
  z-index: 10; /* 좌석보다 위, 문짝(z-20)보단 아래로 두고 싶으면 15 정도로 */
  animation: enter-to-seat 2.6s ease-in-out infinite;
}

/* 머리 */
.person::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 100%;
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background: rgba(58, 58, 58, 0.95);
  transform: translate(-50%, -2px);
}

/* 살짝 좌우 흔들림 개성값 */
.person {
  --side: 2px;
}
.person:nth-of-type(2) {
  --side: -1px;
}
.person:nth-of-type(3) {
  --side: 3px;
}

/* 문 통과 → 중앙 통로 정렬 → 좌석까지 이동 → 착석 */
@keyframes enter-to-seat {
  0% {
    left: 50%;
    top: 92%;
    transform: translate(-50%, 0) scale(0.9);
    opacity: 0;
    z-index: 15; /* 문 앞 */
  }
  15% {
    left: calc(50% + var(--side));
    top: 85%;
    transform: translate(-50%, 0) scale(0.95);
    opacity: 1;
    z-index: 15;
  }
  /* 문 사이 통과하면서 약간 위로 */
  35% {
    left: 50%;
    top: 72%;
    transform: translate(-50%, 0) scale(0.92);
    opacity: 1;
    z-index: 10; /* 문 뒤 */
  }
  /* 중앙 통로 깊숙이 */
  55% {
    left: 50%;
    top: 58%;
    transform: translate(-50%, 0) scale(0.9);
  }
  /* 좌석 방향으로 대각 이동 */
  80% {
    left: var(--tx);
    top: calc(var(--ty) - 8%);
    transform: translate(-50%, 0) scale(0.88);
  }
  /* 착석(스쿼시) */
  92% {
    left: var(--tx);
    top: var(--ty);
    transform: translate(-50%, 0) scaleX(0.98) scaleY(0.85);
  }
  100% {
    left: var(--tx);
    top: var(--ty);
    transform: translate(-50%, 0) scale(0.88);
    opacity: 0.95;
  }
}

/* 접근성 */
@media (prefers-reduced-motion: reduce) {
  .person {
    animation: none;
    opacity: 1;
  }
}
</style>
