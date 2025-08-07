// 브라우저 콘솔에서 실행할 디버그 코드

console.log('🔍 팬카드 디버그 시작...');

// 1. 현재 인증 상태 확인
const token = localStorage.getItem('access-token');
console.log('1️⃣ 저장된 토큰:', token ? '✅ 있음' : '❌ 없음');

// 2. API 직접 호출 테스트
async function debugFancardAPI() {
  try {
    console.log('2️⃣ 팬카드 API 직접 호출 테스트...');
    
    const response = await fetch('/api/fancards', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });
    
    console.log('📡 응답 상태:', response.status, response.statusText);
    console.log('📡 응답 헤더:', [...response.headers.entries()]);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API 응답 성공:', data);
    } else {
      const errorText = await response.text();
      console.log('❌ API 응답 실패:', errorText);
    }
  } catch (error) {
    console.error('🚨 API 호출 오류:', error);
  }
}

// 3. Vue 컴포넌트 상태 확인
function debugVueComponent() {
  console.log('3️⃣ Vue 컴포넌트 상태 확인...');
  
  // Vue DevTools를 통해 Pinia 스토어 상태 확인
  if (window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
    console.log('🔧 Vue DevTools 사용 가능 - Pinia 스토어를 확인하세요');
  }
  
  // 현재 페이지에서 팬카드 관련 요소 확인
  const fancardElements = document.querySelectorAll('[class*="card"], [class*="fancard"]');
  console.log('📋 팬카드 관련 DOM 요소:', fancardElements.length + '개');
}

// 4. 네트워크 요청 모니터링
function monitorNetworkRequests() {
  console.log('4️⃣ 네트워크 요청 모니터링 시작...');
  
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    console.log('🌐 Fetch 요청:', args[0]);
    return originalFetch.apply(this, args)
      .then(response => {
        console.log('🌐 Fetch 응답:', args[0], response.status);
        return response;
      });
  };
  
  console.log('✅ 네트워크 모니터링 활성화됨');
}

// 실행
debugFancardAPI();
debugVueComponent();
monitorNetworkRequests();

// 전역 함수로 등록
window.debugFancardAPI = debugFancardAPI;
window.debugVueComponent = debugVueComponent;

console.log(`
🔍 팬카드 디버그 도구가 준비되었습니다!

사용법:
- debugFancardAPI() : API 직접 테스트
- debugVueComponent() : Vue 컴포넌트 상태 확인
- 네트워크 탭에서 /api/fancards 요청 확인
- Vue DevTools에서 Pinia 스토어 상태 확인

팬카드 페이지로 이동한 후 위 함수들을 실행해보세요!
`);