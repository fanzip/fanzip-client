import MarketPage from '@/pages/market/MarketPage.vue'
import MarketDetailPage from '@/pages/market/MarketDetailPage.vue'
import MarketOrderPage from '@/pages/market/MarketOrderPage.vue'
import MarketOrderFinishPage from '@/pages/market/MarketOrderFinishPage.vue'
import MarketCreatePage from '@/pages/influencerMypage/MarketCreatePage.vue'

export default [
  {
    path: '/market',
    name: 'market',
    component: MarketPage,
  },
  {
    path: '/market/order',
    name: 'market-order',
    component: MarketOrderPage,
  },
  {
    path: '/market/:productId',
    name: 'market-detail',
    component: MarketDetailPage,
    props: true, // productId를 props로 전달
  },
  {
    path: '/market/order/finish',
    nmae: 'market-order-finish',
    component: MarketOrderFinishPage,
  },
  {
    path: '/influencers/:influencerId/market/create',
    name: 'market-create',
    component: MarketCreatePage,
    props: true,
  },
]
