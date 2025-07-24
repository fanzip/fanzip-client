<template>
    <div class="flex items-center w-full max-w-[393px] px-4 py-2">
      <!-- 검색어가 있을 때만 뒤로가기 버튼 노출 -->
      <button v-if="keyword" class="mr-2">
        <img src="@/assets/searchbar/backbutton.svg" alt="뒤로가기" class="w-5 h-5" />
      </button>
  
      <!-- 배경색 고정: bg-subtle-bg (#F6F6F6), 크기 전환 없음 -->
      <div class="relative flex items-center w-[353px] h-[32px] bg-subtle-bg rounded-[16px]">
        <input
          v-model="keyword"
          :placeholder="placeholder"
          class="w-full h-full text-[16px] text-[#504E4E] rounded-[16px] outline-none bg-transparent pl-[16px] pr-[36px]"
        />
  
        <!-- 돋보기 아이콘 or X 버튼 -->
        <template v-if="!keyword">
          <img
            src="@/assets/searchbar/search.svg"
            alt="검색"
            class="absolute right-[16px] w-4 h-4"
          />
        </template>
        <template v-else>
          <button
            @click="clearKeyword"
            class="absolute right-[16px] w-4 h-4"
          >
            <img src="@/assets/searchbar/xbutton.svg" alt="지우기" />
          </button>
        </template>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const keyword = ref('')
  const placeholder = '검색어를 입력해주세요.'
  
  const clearKeyword = () => {
    keyword.value = ''
  }
  </script>
  