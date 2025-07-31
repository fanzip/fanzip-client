<script setup>
const selectedTier = defineModel('selectTier') // 'v-model'을 통해 부모와 양방향 바인딩
</script>

<template>
  <div class="bg-white rounded-lg">
    <h2 class="font-bold text-[16px] mb-4">멤버십 선택</h2>

    <label
      class="flex items-center justify-between mb-3 cursor-pointer"
      v-for="option in ['vip', 'gold', 'silver', 'white']"
      :key="option"
    >
      <div class="flex items-center gap-3">
        <input
          type="radio"
          name="membership"
          :value="option"
          v-model="selectedTier"
          class="sr-only"
        />
        <div class="relative w-4 h-4 rounded-full border border-[#DEDEDE] flex-shrink-0">
          <div
            v-if="selectedTier === option"
            class="absolute top-1/2 left-1/2 w-[10px] h-[10px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFBC00]"
          ></div>
        </div>
        <div class="badge" :class="'badge-' + option.toLowerCase()">
          {{ option.toUpperCase() }}
        </div>
      </div>
      <span class="font-medium">
        {{ { vip: '13,900', gold: '11,900', silver: '9,900', white: '7,900' }[option] }}/월
      </span>
    </label>
  </div>
</template>
