<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import marketApi from '@/api/marketApi'

import AppHeader from '@/components/layout/AppHeader.vue'
import checkedBox from '@/assets/market/checked-box.svg'
import uncheckedBox from '@/assets/market/unchecked-box.svg'
import CartItem from '@/components/market/CartItem.vue'

const router = useRouter()

// const address = ref('서울특별시 광진구 능동로 195-16, 602호')
const cartData = ref({ items: [], grandTotal: 0, address: '' })

// 로드 함수
const loadCart = async () => {
  cartData.value = await marketApi.getCartItems()
}
onMounted(loadCart)

// 전체 선택 (토글)
const allSelected = ref(false)
watch(allSelected, (val) => {
  toggleSelectAll(val)
})
async function toggleSelectAll(val) {
  allSelected.value = val
  cartData.value = await marketApi.selectAll(val)
}

// 판매자별그룹핑
const groupedItems = computed(() => {
  return cartData.value.items.reduce((groups, item) => {
    const seller = item.influencerName
    if (!groups[seller]) groups[seller] = []
    groups[seller].push(item)
    return groups
  }, {})
})

// 그룹 단위 선택/해제
async function toggleGroup(seller, val) {
  const items = cartData.value.items.filter((i) => i.influencerName === seller)
  await Promise.all(
    items.map((i) =>
      marketApi.updateCartItem({
        cartItemId: i.cartItemId,
        quantity: i.quantity,
        isSelected: val,
      }),
    ),
  )
  loadCart()
}

// 선택 삭제
async function deleteSelected() {
  const toRemove = cartData.value.items.filter((i) => i.isSelected)
  await Promise.all(toRemove.map((i) => marketApi.removeCartItem(i.cartItemId)))
  loadCart()
}

// 주문하기 이동
function goToOrder() {
  router.push({ name: 'OrderPage' })
}
</script>
<template>
  <!-- 헤더 -->
  <AppHeader type="back-title-icons" title="장바구니" />

  <div class="bg-base-bg pt-12 px-5">
    <!-- 배송지 -->
    <div v-if="cartData.address" class="flex items-start h-12 pt-3 text-base">
      <img src="@/assets/market/map-pin-black.svg" alt="map-pin" class="w-5 h-5" />
      <span class="ml-2 font-medium">{{ cartData.address }}</span>
    </div>

    <!-- 구분선 -->
    <div>
      <hr class="border-t border-nav-deactivated w-full" />
    </div>

    <!-- 전체선택 + 선택삭제-->
    <div class="flex items-center h-12">
      <label class="flex items-center cursor-pointer">
        <input type="checkbox" class="sr-only" v-model="allSelected" />
        <img :src="allSelected ? checkedBox : uncheckedBox" class="w-6 h-6" alt="checkbox" />
        <span class="ml-2 font-bold">전체 선택</span>
      </label>

      <button
        @click="deleteSelected"
        class="flex h-6 items-center ml-auto font-light text-subtle-text p-1 border border-subtle-border rounded"
      >
        <img src="@/assets/market/grey-x.svg" alt="x" class="w-5 h-5" />
        <span>선택 삭제</span>
      </button>
    </div>
  </div>

  <!-- 카트 항목 -->
  <div class="bg-subtle-bg min-h-screen pb-20 pt-2">
    <div>
      <!-- 3) 인플루언서별 그룹 & 아이템 -->
      <div v-for="(items, seller) in groupedItems" :key="seller" class="mb-6">
        <!-- 그룹 헤더 -->
        <div class="flex items-center bg-base-bg ml-5 mt-3 mr-5 p-3 rounded-t-lg">
          <img
            :src="items.every((i) => i.isSelected) ? checkedBox : uncheckedBox"
            class="w-5 h-5 cursor-pointer mr-2"
            @click="toggleGroup(seller, !items.every((i) => i.isSelected))"
            alt="checkbox"
          />
          <span class="font-bold text-xl">{{ seller }}</span>
        </div>

        <!-- CartItem 컴포넌트 -->
        <CartItem
          v-for="(item, idx) in items"
          :key="item.cartItemId"
          :item="item"
          :is-last="idx === items.length - 1"
          @refresh="loadCart"
        />
      </div>
    </div>
  </div>

  <!-- 체크한 항목의 총합 -->
  <nav
    class="fixed bottom-0 left-0 w-full h-20 bg-base-bg border-t border-nav-stroke rounded-t-2xl flex items-center justify-center z-50"
  >
    <div
      class="w-[353px] h-12 bg-brand-primary rounded-xl font-semibold text-base flex items-center justify-center"
    >
      <span class="font-extrabold">{{ cartData.grandTotal.toLocaleString() }}</span
      ><span> 원 주문하기</span>
    </div>
  </nav>
</template>
