<template>
  <div
    class="min-h-screen bg-subtle-bg px-4 space-y-6 font-sans mx-auto w-full max-w-xs md:max-w-sm"
  >
    <h1 class="text-[1.5rem] font-bold mb-4">🎨 Design System Guide</h1>
    <p class="text-subtle-text text-sm mb-6 leading-relaxed">
      ✅ 이 프로젝트의 UI 요소는 <strong>Tailwind 커스텀 클래스</strong>로 미리 정의되어 있어,
      <code>.btn-primary</code>, <code>.badge-vip</code> 와 같이
      <strong>클래스를 붙여 쓰면 동일한 디자인</strong>을 바로 적용할 수 있습니다.
    </p>

    <section>
      <h2 class="text-xl font-semibold mb-3">🎨 Color Palette</h2>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-3">
        <div
          v-for="(color, index) in colorPalette"
          :key="index"
          :class="`p-3 rounded text-center ${color.bg} ${color.text} ${color.border || ''}`"
        >
          <p class="font-bold text-sm">{{ color.name }}</p>
          <p class="text-xs">{{ color.hex }}</p>
          <p class="text-xs mt-1">{{ color.description }}</p>
        </div>
      </div>
    </section>

    <section class="mt-8">
      <h2 class="text-xl font-semibold mb-3">🏷️ Badges</h2>
      <p class="text-subtle-text text-xs mb-3">
        뱃지는 상태/등급을 표시하며, 공통 사이즈(80x24px), 볼드 텍스트를 사용합니다.
      </p>
      <div class="flex flex-wrap gap-2">
        <span class="badge badge-vip">VIP</span>
        <span class="badge badge-gold">Gold</span>
        <span class="badge badge-silver">Silver</span>
        <span class="badge badge-white">White</span>
      </div>
    </section>

    <section class="mt-8">
      <h2 class="text-xl font-semibold mb-3">☂️ Headers</h2>
      <div class="space-y-2">
        <AppHeader type="logo" />
        <AppHeader type="back" />
        <AppHeader type="back-title" title="좌석 선택" />
        <AppHeader type="back-icons" />
      </div>
    </section>

    <section class="space-y-8 pb-28">
      <h2 class="text-xl font-bold">🎨 BaseButton 예시 모음</h2>

      <div class="space-y-4">
        <h3 class="font-semibold">📌 Large Buttons (353x48)</h3>
        <BaseButton variant="primary" size="lg">기본 버튼</BaseButton>
        <BaseButton variant="primary" size="lg">
          <img src="@/assets/button/shopping-bag.svg" alt="장바구니" class="w-5 h-5" />
          장바구니 담기
        </BaseButton>

        <BaseButton variant="primary" size="lg">
          <span class="font-extrabold">12,000원</span>
          <span class="font-semibold">결제하기</span>
        </BaseButton>
      </div>

      <div class="space-y-4">
        <h3 class="font-semibold">📌 Medium Buttons (169x48)</h3>
        <div class="flex gap-4">
          <BaseButton variant="cart" size="md">
            <img src="@/assets/button/shopping-bag.svg" alt="장바구니" class="w-5 h-5" />
            장바구니 담기
          </BaseButton>

          <BaseButton variant="buy" size="md">바로 구매하기</BaseButton>
        </div>
      </div>

      <div class="space-y-4">
        <h3 class="font-semibold">📌 Small Buttons (140x48)</h3>
        <div class="flex gap-4">
          <BaseButton variant="cancel" size="sm">취소</BaseButton>
          <BaseButton variant="confirm" size="sm">수정 완료</BaseButton>
        </div>
      </div>
    </section>

    <section class="pb-28">
      <h2 class="text-xl font-semibold mb-3">🔍 Search Bar</h2>
      <p class="text-subtle-text text-xs mb-3">
        검색창은 입력 상태에 따라 동적으로 너비와 아이콘이 바뀌며, placeholder는 "검색어를
        입력해주세요."입니다.
      </p>
      <div class="bg-base-bg rounded-lg p-4 border border-subtle-border">
        <SearchBar />
      </div>
    </section>
  </div>
</template>

<script setup>
import AppHeader from '@/components/layout/AppHeader.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import SearchBar from '@/components/common/SearchBar.vue'

const colorPalette = [
  {
    name: 'brand-primary',
    hex: '#FFD633',
    bg: 'bg-brand-primary',
    text: 'text-text-inverse',
    description: '✔ 메인 컬러 (Primary 버튼, 포인트 강조)',
  },
  {
    name: 'brand-accent',
    hex: '#FFBC00',
    bg: 'bg-brand-accent',
    text: 'text-text-inverse',
    description: '✔ Hover 효과 및 보조 컬러',
  },
  {
    name: 'base-bg',
    hex: '#FFFFFF',
    bg: 'bg-base-bg',
    text: 'text-text-base',
    border: 'border border-base-border',
    description: '✔ 기본 배경색',
  },
  {
    name: 'base-border',
    hex: '#EAEAEA',
    bg: 'bg-base-bg',
    text: 'text-text-base',
    border: 'border border-base-border',
    description: '✔ 기본 테두리 색상',
  },
  {
    name: 'subtle-bg',
    hex: '#F6F6F6',
    bg: 'bg-subtle-bg',
    text: 'text-text-base',
    description: '✔ 서브 배경 (카드, 인풋)',
  },
  {
    name: 'subtle-border',
    hex: '#D8D8D8',
    bg: 'bg-subtle-border',
    text: 'text-text-base',
    description: '✔ 서브 테두리',
  },
  {
    name: 'subtle-text',
    hex: '#808080',
    bg: 'bg-subtle-bg',
    text: 'text-subtle-text',
    description: '✔ 서브 텍스트 (비활성화 상태)',
  },
  {
    name: 'text-base',
    hex: '#000000',
    bg: 'bg-base-bg',
    text: 'text-text-base',
    description: '✔ 기본 본문 텍스트',
  },
  {
    name: 'text-inverse',
    hex: '#FFFFFF',
    bg: 'bg-text-base',
    text: 'text-text-inverse',
    description: '✔ 반전 텍스트 (다크 배경용)',
  },
  {
    name: 'text-emphasis',
    hex: '#F50000',
    bg: 'bg-text-emphasis',
    text: 'text-text-inverse',
    description: '✔ 강조 텍스트',
  },
  {
    name: 'nav-stroke',
    hex: '#EFEFEF',
    bg: 'bg-nav-stroke',
    text: 'text-text-base',
    description: '✔ 네비게이션 구분선',
  },
  {
    name: 'nav-active',
    hex: '#3A3A3A',
    bg: 'bg-nav-active',
    text: 'text-text-inverse',
    description: '✔ 활성화 네비게이션',
  },
  {
    name: 'nav-deactivated',
    hex: '#A7A7A7',
    bg: 'bg-nav-deactivated',
    text: 'text-text-inverse',
    description: '✔ 비활성화 네비게이션',
  },
]
</script>
