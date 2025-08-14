<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppNav from '@/components/layout/AppNav.vue'
import reportApi from '@/api/reportApi'
import VeryGoodIcon from '@/assets/InfluencerProfile/VeryGood.svg'
import GoodIcon from '@/assets/InfluencerProfile/Good.svg'
import SoSoIcon from '@/assets/InfluencerProfile/SoSo.svg'
import BadIcon from '@/assets/InfluencerProfile/Bad.svg'
import VeryBadIcon from '@/assets/InfluencerProfile/VeryBad.svg'

const route = useRoute()

// 반응형 데이터
const averageRating = ref(0)
const satisfactionRate = ref(0)
const totalParticipants = ref(0)
const ratingDistribution = ref({})
const overallSummary = ref('')
const positiveFeedbacks = ref([])
const negativeFeedbacks = ref([])
const isLoading = ref(false)
const error = ref(null)

// 계산된 속성
const formattedAverageRating = computed(() => {
  return averageRating.value.toFixed(2)
})

const formattedSatisfactionRate = computed(() => {
  return Math.round(satisfactionRate.value)
})

// 메서드
const getMaxRatingCount = () => {
  return Math.max(...Object.values(ratingDistribution.value).map((count) => count || 0))
}

const getBarHeight = (rating) => {
  const maxCount = getMaxRatingCount()
  const currentCount = ratingDistribution.value[rating] || 0
  return maxCount > 0 ? (currentCount / maxCount) * 100 : 0
}

const getRatingIcon = (rating) => {
  const iconMap = {
    5: VeryGoodIcon,
    4: GoodIcon,
    3: SoSoIcon,
    2: BadIcon,
    1: VeryBadIcon,
  }
  return iconMap[rating]
}

const getRatingLabel = (rating) => {
  const labelMap = {
    5: 'VeryGood',
    4: 'Good',
    3: 'SoSo',
    2: 'Bad',
    1: 'VeryBad',
  }
  return labelMap[rating]
}

const fetchAIReport = async () => {
  try {
    isLoading.value = true
    error.value = null

    const influencerId = route.params.influencerId
    const meetingId = route.query.meetingId
    const regenerate = route.query.regenerate !== 'false' // 기본값 true

    if (!influencerId || !meetingId) {
      throw new Error('필수 파라미터가 누락되었습니다.')
    }

    const data = await reportApi.getAIReport(influencerId, meetingId, regenerate)

    // 데이터 설정
    averageRating.value = parseFloat(data.averageRating) || 0
    satisfactionRate.value = parseFloat(data.satisfactionRate) || 0 // 백분율로 변환
    totalParticipants.value = data.totalParticipants || 0
    ratingDistribution.value = data.ratingDistribution || {}
    overallSummary.value = data.overallSummary || ''
    positiveFeedbacks.value = data.positiveFeedbacks || []
    negativeFeedbacks.value = data.negativeFeedbacks || []
  } catch (err) {
    console.error('AI 리포트 로딩 오류:', err)
    error.value = err.message || 'AI 리포트를 불러오는데 실패했습니다.'
  } finally {
    isLoading.value = false
  }
}

const getStarWidth = (starIndex) => {
  if (starIndex <= averageRating.value) {
    return 100
  } else if (starIndex - 1 < averageRating.value) {
    return (averageRating.value - (starIndex - 1)) * 100
  }
  return 0
}

onMounted(() => {
  fetchAIReport()
})
</script>

<template>
  <div class="w-full flex flex-col bg-[#f6f6f6] min-h-screen">
    <!-- 헤더 -->
    <AppHeader type="back-title" title="AI 리포트" />

    <!-- 메인 컨텐츠 -->

    <div class="flex-1 pb-20">
      <div class="bg-white px-5 pt-20 relative">
        <div class="flex justify-between items-start pb-10">
          <!-- Left Side - Rating -->
          <div class="flex flex-col">
            <!-- 총평점 -->
            <div class="justify-items-end">
              <div class="flex items-center gap-3 mb-2">
                <span
                  class="bg-nav-stroke text-subtle-text text-base font-medium px-3 py-1 rounded-2xl"
                  >총 평점</span
                >
                <div>
                  <span class="text-4xl font-bold text-black leading-6 mb-2">
                    {{ formattedAverageRating }}
                  </span>
                </div>
              </div>
              <div class="flex items-center mb-6">
                <template v-for="star in 5" :key="star">
                  <div class="relative w-4 h-4 overflow-hidden">
                    <!-- 회색 별 (배경) -->
                    <img
                      src="@/assets/InfluencerProfile/GreyStar.svg"
                      alt="별점"
                      class="w-4 h-4 absolute"
                    />
                    <!-- 노란 별 (비율에 따라 잘림) -->
                    <div
                      class="absolute top-0 left-0 overflow-hidden w-full h-4"
                      :style="{
                        clipPath: `inset(0 ${100 - getStarWidth(star)}% 0 0)`,
                      }"
                    >
                      <img
                        src="@/assets/InfluencerProfile/YellowStar.svg"
                        alt="별점"
                        class="w-4 h-4"
                      />
                    </div>
                  </div>
                </template>
              </div>
            </div>

            <!-- 만족도 -->
            <div class="flex items-center gap-3">
              <span
                class="bg-nav-stroke text-subtle-text text-base font-medium px-3 py-1 rounded-2xl"
                >만족도</span
              >
              <span class="flex items-end">
                <span class="text-4xl font-bold text-black">{{ formattedSatisfactionRate }}</span>
                <span class="text-xl font-medium text-black">%</span>
              </span>
            </div>
          </div>

          <!-- Right Side - Bar Chart -->
          <div class="flex items-end gap-3">
            <template v-for="rating in [5, 4, 3, 2, 1]" :key="rating">
              <div class="flex flex-col items-center">
                <!-- 참여자 수 -->
                <div class="mb-1">
                  <span
                    :class="[
                      'text-xs',
                      getMaxRatingCount() === (ratingDistribution[rating] || 0)
                        ? 'text-black font-semibold'
                        : 'text-subtle-text',
                    ]"
                  >
                    {{ ratingDistribution[rating] || 0 }}
                  </span>
                </div>

                <!-- 그래프 바 -->
                <div class="w-3 h-16 bg-nav-stroke rounded relative overflow-hidden">
                  <div
                    class="absolute bottom-0 left-0 right-0 bg-brand-primary rounded"
                    :style="{ height: getBarHeight(rating) + '%' }"
                  ></div>
                </div>

                <!-- 이모지 아이콘 -->
                <div class="mt-2">
                  <img :src="getRatingIcon(rating)" :alt="getRatingLabel(rating)" class="w-5 h-5" />
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- 하단 배경 변경 지점 -->
      <div class="bg-sub-background pt-6 pb-20">
        <!-- 참여 팬 수 & 평균 만족도 카드 -->
        <div class="bg-white rounded-lg mx-5 mb-5 p-5 w-[353px] max-w-sm">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center">
              <img src="@/assets/InfluencerProfile/YellowReport.svg" alt="리포트" class="w-7 h-7" />
              <p class="text-2xl font-bold ml-3">AI 종합 리포트</p>
            </div>
            <div>
              <div class="text-subtle-text text-base font-medium">참여 팬 수</div>
              <div class="text-xl font-bold mt-1">{{ totalParticipants }}명</div>
            </div>
          </div>

          <!-- 구분선 -->
          <div class="w-full h-px bg-subtle-border mb-4"></div>

          <!-- 총평 -->
          <div class="w-full">
            <p class="text-base leading-relaxed">{{ overallSummary }}</p>
          </div>
        </div>

        <!-- 긍정 피드백 카드 -->
        <div class="bg-white rounded-lg mx-auto mb-5 p-5 w-[353px] max-w-sm">
          <div class="flex items-center mb-3">
            <img src="@/assets/InfluencerProfile/ThumbsUp.svg" alt="긍정" class="w-5 h-5" />
            <span class="ml-2 text-lg font-bold">긍정 피드백</span>
          </div>

          <!-- 구분선 -->
          <div class="w-full h-px bg-subtle-border mb-4"></div>

          <!-- 긍정 피드백 목록 -->
          <div class="space-y-2">
            <div
              v-for="(feedback, index) in positiveFeedbacks"
              :key="index"
              class="flex items-start"
            >
              <img
                src="@/assets/InfluencerProfile/YellowCheckBox.svg"
                alt="체크"
                class="w-4 h-4 mt-0.5 flex-shrink-0"
              />
              <span class="ml-3 text-baseleading-relaxed">{{ feedback }}</span>
            </div>
          </div>
        </div>

        <!-- 부정 피드백 카드 -->
        <div class="bg-white rounded-lg mx-auto mb-5 p-4 w-[353px] max-w-sm">
          <div class="flex items-center mb-3">
            <img src="@/assets/InfluencerProfile/ThumbsDown.svg" alt="부정" class="w-5 h-5" />
            <span class="ml-3 text-lg font-bold">부정 피드백</span>
          </div>

          <!-- 구분선 -->
          <div class="w-full h-px bg-subtle-border mb-4"></div>

          <!-- 부정 피드백 목록 -->
          <div class="space-y-2">
            <div
              v-for="(feedback, index) in negativeFeedbacks"
              :key="index"
              class="flex items-start"
            >
              <img
                src="@/assets/InfluencerProfile/YellowCheckBox.svg"
                alt="체크"
                class="w-4 h-4 mt-0.5 flex-shrink-0"
              />
              <span class="ml-3 text-baseleading-relaxed">{{ feedback }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <AppNav />
  </div>
</template>
