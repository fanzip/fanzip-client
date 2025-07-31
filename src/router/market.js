import MarketPage from '@/pages/market/MarketPage.vue'
import MarketDetailPage from '@/pages/market/MarketDetailPage.vue'
export default [
  {
    path: '/market',
    name: 'market',
    component: MarketPage,
  },
  {
    path: '/market/:productId',
    name: 'market-detail',
    component: MarketDetailPage,
    props: true, // productId를 props로 전달
  },
]
