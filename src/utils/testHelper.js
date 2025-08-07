// 개발 환경에서 팬카드 API 테스트를 위한 헬퍼 함수들

// 테스트용 JWT 토큰 설정 (개발환경에서만 사용)
export const setTestToken = () => {
  if (import.meta.env.DEV) {
    const testToken = 'test-jwt-token-for-development'
    localStorage.setItem('access-token', testToken)
    console.log('🧪 테스트용 토큰이 설정되었습니다:', testToken)
  }
}

// 팬카드 API 직접 테스트 (목 데이터 또는 실제 API 선택 가능)
export const testFancardApis = async (useMockData = true) => {
  console.log('🧪 팬카드 API 테스트 시작...')
  console.log(useMockData ? '🎭 목 데이터 모드' : '🌐 실제 API 모드')
  
  if (useMockData) {
    // 목 데이터 테스트
    try {
      const { fancardApi } = await import('../api/fancardApi')
      
      console.log('1️⃣ 팬카드 목록 조회 테스트')
      const listData = await fancardApi.getUserFancards()
      console.log('✅ 팬카드 목록 조회 성공:', listData.data)
      
      console.log('2️⃣ 팬카드 상세 조회 테스트 (ID: 1)')
      const detailData = await fancardApi.getFancardDetail(1)
      console.log('✅ 팬카드 상세 조회 성공:', detailData.data)
      
      console.log('3️⃣ QR 코드 생성 테스트')
      const qrRequest = {
        reservationId: 1,
        userId: 1,
        fanMeetingId: 1,
        latitude: 37.5665,
        longitude: 126.9780,
        deviceInfo: navigator.userAgent
      }
      const qrData = await fancardApi.generateQrCode(qrRequest)
      console.log('✅ QR 코드 생성 성공:', qrData.data)
      
    } catch (error) {
      console.error('🚨 목 데이터 테스트 중 오류:', error)
    }
    
  } else {
    // 실제 API 테스트
    const API_BASE = '/api'
    const token = localStorage.getItem('access-token')
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
    
    try {
      // 1. 팬카드 목록 조회 테스트
      console.log('1️⃣ 팬카드 목록 조회 테스트')
      const listResponse = await fetch(`${API_BASE}/fancards`, {
        method: 'GET',
        headers
      })
      
      if (listResponse.ok) {
        const listData = await listResponse.json()
        console.log('✅ 팬카드 목록 조회 성공:', listData)
      } else {
        console.log('❌ 팬카드 목록 조회 실패:', listResponse.status, listResponse.statusText)
      }
      
      // 2. 팬카드 상세 조회 테스트
      console.log('2️⃣ 팬카드 상세 조회 테스트 (ID: 1)')
      const detailResponse = await fetch(`${API_BASE}/fancards/1`, {
        method: 'GET',
        headers
      })
      
      if (detailResponse.ok) {
        const detailData = await detailResponse.json()
        console.log('✅ 팬카드 상세 조회 성공:', detailData)
      } else {
        console.log('❌ 팬카드 상세 조회 실패:', detailResponse.status, detailResponse.statusText)
      }
      
      // 3. QR 코드 생성 테스트
      console.log('3️⃣ QR 코드 생성 테스트')
      const qrRequest = {
        reservationId: 1,
        userId: 1,
        fanMeetingId: 1,
        latitude: 37.5665, // 서울 시청 좌표
        longitude: 126.9780,
        deviceInfo: navigator.userAgent
      }
      
      const qrResponse = await fetch(`${API_BASE}/fancards/qr`, {
        method: 'POST',
        headers,
        body: JSON.stringify(qrRequest)
      })
      
      if (qrResponse.ok) {
        const qrData = await qrResponse.json()
        console.log('✅ QR 코드 생성 성공:', qrData)
      } else {
        console.log('❌ QR 코드 생성 실패:', qrResponse.status, qrResponse.statusText)
      }
      
    } catch (error) {
      console.error('🚨 실제 API 테스트 중 오류 발생:', error)
    }
  }
}

// 브라우저 콘솔에서 사용할 수 있도록 전역 함수로 등록 (개발환경에서만)
if (import.meta.env.DEV) {
  window.setTestToken = setTestToken
  window.testFancardApis = testFancardApis
  
  console.log(`
🧪 팬카드 API 테스트 도구가 로드되었습니다! (개발환경만)

사용법:
1. setTestToken() - 테스트 토큰 설정
2. testFancardApis() - 목 데이터로 API 테스트 (기본값)
3. testFancardApis(false) - 실제 백엔드 API 테스트

브라우저 콘솔에서 위 함수들을 호출하여 테스트하세요.
  `)
}