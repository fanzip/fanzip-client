import MembershipSelect from '@/pages/MembershipSelect.vue'

export default [
  {
    path: '/membership/select/:influencerId', 
    name: 'MembershipSelect',
    component: MembershipSelect,
    props: true
  }
]
