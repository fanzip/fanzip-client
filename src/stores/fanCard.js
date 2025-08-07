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
      console.error(',t� �] p� �(:', err)
      error.value = ',t�| ��$�p �(����.'
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
      console.error(',t� �8 p� �(:', err)
      error.value = ',t� �| ��$�p �(����.'
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
        throw new Error('��� ���� QR T�| �1`  ����.')
      }
      
      return response.data
    } catch (err) {
      console.error('QR T� �1 �(:', err)
      if (err.message.includes('X') || err.message.includes('���')) {
        error.value = err.message
      } else {
        error.value = 'QR T� �1� �(����. �� ��t�8�.'
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