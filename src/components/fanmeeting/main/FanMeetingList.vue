<template>
  <div class="pl-9 pr-5 pb-24">
    <div v-for="meeting in meetings" :key="meeting.meetingId" class="mt-6 first:mt-0">
      <FanMeetingCard
        :title="meeting.title"
        :venueName="meeting.venueName"
        :imageUrl="meeting.profileImageUrl"
        @click="$emit('click', meeting.meetingId)"
      />
    </div>
    <div v-if="meetings.length === 0" class="flex items-center justify-center h-64">
      <p class="text-subtle-text text-base">검색 결과가 없습니다.</p>
    </div>
  </div>
</template>

<script setup>
import FanMeetingCard from './FanMeetingCard.vue'
defineProps({
  meetings: Array,
})
defineEmits(['click'])
</script>
