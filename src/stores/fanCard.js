import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fancardApi } from '@/api/fancardApi'

export const useFanCardStore = defineStore('fanCard', () => {
  // State
  const fancards = ref([])
  const selectedFancard = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  // Actions
  const fetchUserFancards = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await fancardApi.getUserFancards()
      fancards.value = response.data.fancards || []
      
      return fancards.value
    } catch (err) {
      console.error(',tÜ ©] pŒ ä(:', err)
      error.value = ',tÜ| ˆì$”p ä(ˆµÈä.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchFancardDetail = async (cardId) => {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await fancardApi.getFancardDetail(cardId)
      selectedFancard.value = response.data
      
      return response.data
    } catch (err) {
      console.error(',tÜ Á8 pŒ ä(:', err)
      error.value = ',tÜ ô| ˆì$”p ä(ˆµÈä.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const generateQrCode = async (qrRequest) => {
    try {
      error.value = null
      
      const response = await fancardApi.generateQrCode(qrRequest)
      
      if (response.data.status === 'LOCATION_ERROR') {
        throw new Error('‰¬¥ ü˜ÐÌ QR TÜ| Ý1`  ˆµÈä.')
      }
      
      return response.data
    } catch (err) {
      console.error('QR TÜ Ý1 ä(:', err)
      if (err.message.includes('X') || err.message.includes('‰¬¥')) {
        error.value = err.message
      } else {
        error.value = 'QR TÜ Ý1Ð ä(ˆµÈä. äÜ ÜÄtü8”.'
      }
      throw err
    }
  }

  const clearError = () => {
    error.value = null
  }

  const clearSelectedFancard = () => {
    selectedFancard.value = null
  }

  // Getters
  const getFancardById = (cardId) => {
    return fancards.value.find(card => card.cardId === cardId)
  }

  return {
    // State
    fancards,
    selectedFancard,
    isLoading,
    error,
    
    // Actions
    fetchUserFancards,
    fetchFancardDetail,
    generateQrCode,
    clearError,
    clearSelectedFancard,
    
    // Getters
    getFancardById
  }
})