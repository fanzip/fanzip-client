<template>
  <div class="min-h-screen bg-subtle-bg p-8 space-y-10 font-sans">
    <h1 class="text-[1.5rem] font-bold mb-4">🎨 Design System Guide</h1>
    <p class="text-subtle-text text-[0.75rem] mb-8">
      ✅ 이 프로젝트의 UI 요소는 <strong>Tailwind 커스텀 클래스</strong>로 미리 정의되어 있어,
      <code>.btn-primary</code>, <code>.badge-vip</code> 와 같이
      <strong>클래스를 붙여 쓰면 동일한 디자인</strong>을 바로 적용할 수 있습니다.
    </p>
    
    <!-- 컬러 팔레트 -->
    <section>
      <h2 class="text-[1.25rem] font-semibold mb-4">🎨 Color Palette</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <!-- Brand Colors -->
        <div class="p-4 rounded bg-brand-primary text-text-inverse">
          <p class="font-bold">brand-primary</p>
          <p class="text-[0.75rem]">#FFD633</p>
          <p class="text-[0.625rem] mt-1">✔ 메인 컬러 (Primary 버튼, 포인트 강조)</p>
        </div>
        <div class="p-4 rounded bg-brand-accent text-text-inverse">
          <p class="font-bold">brand-accent</p>
          <p class="text-[0.75rem]">#FFBC00</p>
          <p class="text-[0.625rem] mt-1">✔ Hover 효과 및 보조 컬러</p>
        </div>

        <!-- Base Colors -->
        <div class="p-4 rounded bg-base-bg text-text-base border border-base-border">
          <p class="font-bold">base-bg</p>
          <p class="text-[0.75rem]">#FFFFFF</p>
          <p class="text-[0.625rem] mt-1">✔ 기본 배경색</p>
        </div>
        <div class="p-4 rounded bg-base-bg text-text-base border border-base-border">
          <p class="font-bold">base-border</p>
          <p class="text-[0.75rem]">#EAEAEA</p>
          <p class="text-[0.625rem] mt-1">✔ 기본 테두리 색상</p>
        </div>

        <!-- Subtle Colors -->
        <div class="p-4 rounded bg-subtle-bg text-text-base">
          <p class="font-bold">subtle-bg</p>
          <p class="text-[0.75rem]">#F6F6F6</p>
          <p class="text-[0.625rem] mt-1">✔ 서브 배경 (카드, 인풋)</p>
        </div>
        <div class="p-4 rounded bg-subtle-border text-text-base">
          <p class="font-bold">subtle-border</p>
          <p class="text-[0.75rem]">#D8D8D8</p>
          <p class="text-[0.625rem] mt-1">✔ 서브 테두리</p>
        </div>
        <div class="p-4 rounded bg-subtle-bg text-subtle-text">
          <p class="font-bold">subtle-text</p>
          <p class="text-[0.75rem]">#808080</p>
          <p class="text-[0.625rem] mt-1">✔ 서브 텍스트 (비활성화 상태)</p>
        </div>

        <!-- Navigation Colors -->
        <div class="p-4 rounded bg-nav-active text-text-inverse">
          <p class="font-bold">nav-active</p>
          <p class="text-[0.75rem]">#A8A8A8</p>
          <p class="text-[0.625rem] mt-1">✔ 활성화 네비게이션</p>
        </div>
        <div class="p-4 rounded bg-nav-deactivated text-text-inverse">
          <p class="font-bold">nav-deactivated</p>
          <p class="text-[0.75rem]">#A7A7A7</p>
          <p class="text-[0.625rem] mt-1">✔ 비활성화 네비게이션</p>
        </div>
        <div class="p-4 rounded bg-nav-stroke text-text-base">
          <p class="font-bold">nav-stroke</p>
          <p class="text-[0.75rem]">#EFEFEF</p>
          <p class="text-[0.625rem] mt-1">✔ 네비게이션 구분선</p>
        </div>

        <!-- Text Colors -->
        <div class="p-4 rounded bg-base-bg text-text-base border border-base-border">
          <p class="font-bold">text-base</p>
          <p class="text-[0.75rem]">#000000</p>
          <p class="text-[0.625rem] mt-1">✔ 기본 본문 텍스트</p>
        </div>
        <div class="p-4 rounded bg-text-emphasis text-text-inverse">
          <p class="font-bold">text-emphasis</p>
          <p class="text-[0.75rem]">#F50000</p>
          <p class="text-[0.625rem] mt-1">✔ 강조 텍스트</p>
        </div>
        <div class="p-4 rounded bg-text-base text-text-inverse">
          <p class="font-bold">text-inverse</p>
          <p class="text-[0.75rem]">#FFFFFF</p>
          <p class="text-[0.625rem] mt-1">✔ 반전 텍스트 (다크 배경용)</p>
        </div>
      </div>
    </section>

    <!-- 버튼 설명 -->
    <section class="mt-10">
      <h2 class="text-[1.25rem] font-semibold mb-4">🖱️ Buttons</h2>
      <p class="text-subtle-text text-[0.75rem] mb-4">
        버튼 스타일은 공통 클래스로 <strong>미리 정의(.btn, .btn-primary 등)</strong>되어 있습니다.
        HTML 요소에 해당 클래스를 추가하면 일관된 스타일이 적용됩니다.
      </p>
      <p class="text-subtle-text text-[0.75rem] mb-4">
        버튼은 일관된 높이(48px), 둥근 모서리(12px), Pretendard 폰트로 구성됩니다.
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <button class="btn btn-primary w-full">Primary Button</button>
          <p class="text-subtle-text text-[0.625rem] mt-1">✔ 브랜드 메인 컬러 버튼</p>
        </div>
        <br />

        <div>
          <button class="btn btn-cart w-full">Cart Button</button>
          <p class="text-subtle-text text-[0.625rem] mt-1">✔ 화이트 배경 + 테두리</p>
        </div>
        <div>
          <button class="btn btn-buy w-full">Buy Now Button</button>
          <p class="text-subtle-text text-[0.625rem] mt-1">✔ 강조된 primary 컬러 버튼</p>
        </div>
        <div>
          <button class="btn btn-cancel w-full">Cancel Button</button>
          <p class="text-subtle-text text-[0.625rem] mt-1">✔ 중립 행동 버튼 (회색 배경)</p>
        </div>
        <div>
          <button class="btn btn-confirm w-full">Confirm Button</button>
          <p class="text-subtle-text text-[0.625rem] mt-1">✔ 긍정 행동 버튼 (브랜드 컬러)</p>
        </div>
      </div>
    </section>

    <!-- 뱃지 설명 -->
    <section class="mt-10">
      <h2 class="text-[1.25rem] font-semibold mb-4">🏷️ Badges</h2>
      <p class="text-subtle-text text-[0.75rem] mb-4">
        뱃지 디자인은 <code>.badge</code>와 상태별 클래스(<code>.badge-vip</code>,
        <code>.badge-gold</code> 등)를 함께 사용해 적용할 수 있습니다.
      </p>
      <p class="text-subtle-text text-[0.75rem] mb-4">
        뱃지는 상태/등급을 표시하며, 공통 사이즈(80x24px), 볼드 텍스트를 사용합니다.
      </p>
      <div class="flex flex-wrap gap-4">
        <div class="flex flex-col items-center">
          <span class="badge badge-vip">VIP</span>
          <p class="text-subtle-text text-[0.625rem] mt-1">✔ 검정 배경 + 흰색 텍스트</p>
        </div>
        <div class="flex flex-col items-center">
          <span class="badge badge-gold">Gold</span>
          <p class="text-subtle-text text-[0.625rem] mt-1">✔ 브랜드 메인 컬러</p>
        </div>
        <div class="flex flex-col items-center">
          <span class="badge badge-silver">Silver</span>
          <p class="text-subtle-text text-[0.625rem] mt-1">✔ 회색 뱃지</p>
        </div>
        <div class="flex flex-col items-center">
          <span class="badge badge-white">White</span>
          <p class="text-subtle-text text-[0.625rem] mt-1">✔ 연한 회색 배경</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup></script>
