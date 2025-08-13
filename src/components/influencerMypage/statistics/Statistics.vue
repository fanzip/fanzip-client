<script setup>
import { computed, ref } from 'vue'
import BarChart from './BarChart.vue'
const graphSelection = ref('Revenue')
const filterSelection = ref('Day')
const revenue = [
  { label: '3월', value: 9_000_000 },
  { label: '4월', value: 7_000_000 },
  { label: '5월', value: 11_000_000 },
  { label: '6월', value: 11_800_000 },
  { label: '7월', value: 5_000_000 },
]

const dailyFanGrowth = [
  { label: '10일', value: 600 },
  { label: '11일', value: 600 },
  { label: '12일', value: 600 },
  { label: '13일', value: 450 },
  { label: '14일', value: 600 },
  { label: '15일', value: 900 },
  { label: '16일', value: 1150 },
]

const weeklyFanGrowth = [
  { label: '6주전', value: 600 },
  { label: '5주전', value: 600 },
  { label: '4주전', value: 600 },
  { label: '3주전', value: 450 },
  { label: '2주전', value: 600 },
  { label: '1주전', value: 900 },
]

const monthlyFanGrowth = [
  { label: '2월', value: 600 },
  { label: '3월', value: 600 },
  { label: '4월', value: 600 },
  { label: '5월', value: 450 },
  { label: '6월', value: 600 },
  { label: '7월', value: 900 },
  { label: '8월', value: 1150 },
]
</script>
<template>
  <div class="w-full rounded-xl p-5 flex flex-col bg-white">
    <div class="text-sm space-x-5">
      <button
        class="pb-1"
        @click="graphSelection = 'Revenue'"
        :class="graphSelection === 'Revenue' ? 'border-b-2 border-brand-primary font-semibold' : ''"
      >
        수익 그래프
      </button>
      <button
        class="pb-1"
        @click="graphSelection = 'Subscriber'"
        :class="
          graphSelection === 'Subscriber' ? 'border-b-2 border-brand-primary font-semibold' : ''
        "
      >
        구독 증가 그래프
      </button>
    </div>
    <div v-if="graphSelection === 'Revenue'">
      <p class="mt-7 text-center text-xl font-semibold">월별 수익 비교</p>
      <BarChart :data="revenue" :yTicks="4" :type="'revenue'" />
    </div>
    <div v-else>
      <p class="mt-7 text-center text-xl font-semibold">팬 증가 추이</p>
      <div class="flex justify-self-end w-36 h-6 my-2 text-xs">
        <button
          @click="filterSelection = 'Day'"
          class="w-1/3 rounded-s-md border border-black"
          :class="filterSelection === 'Day' ? 'bg-brand-primary font-semibold' : ' bg-subtle-bg'"
        >
          일
        </button>
        <button
          @click="filterSelection = 'Week'"
          class="w-1/3 border border-black"
          :class="filterSelection === 'Week' ? 'bg-brand-primary font-semibold' : ' bg-subtle-bg'"
        >
          주
        </button>
        <button
          @click="filterSelection = 'Month'"
          class="w-1/3 rounded-e-md border border-black"
          :class="filterSelection === 'Month' ? 'bg-brand-primary font-semibold' : 'bg-subtle-bg'"
        >
          월
        </button>
      </div>
      <BarChart
        :data="
          filterSelection === 'Day'
            ? dailyFanGrowth
            : filterSelection === 'Week'
              ? weeklyFanGrowth
              : monthlyFanGrowth
        "
        :y-ticks="4"
        :type="'fan'"
      />
    </div>
  </div>
</template>
