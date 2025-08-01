# 팬미팅 예약 시스템 커밋 메시지 목록

## 1. 결제 및 브랜딩 아이콘 파일들 추가
```
feat: 결제 및 브랜딩 아이콘 파일들 추가

- 결제 방법 아이콘 추가 (KB페이, 카카오페이, 토스페이)
- 성공 체크 아이콘 및 포스터 이미지 추가
- 여단오 프로필 아이콘 추가
- 이미지 폴더 구조 정리

파일:
- src/assets/icons/BsCheckCircleFill.svg
- src/assets/icons/KBPay.svg
- src/assets/icons/KakaoPay.svg
- src/assets/icons/TossPay.svg
- src/assets/icons/poster.svg
- src/assets/icons/yeodano.svg
- images/
```

## 2. 공통 컴포넌트들 추가
```
feat: 공통 컴포넌트들 (ButtonNav, PaymentMethodSelector) 추가

- BottomButton 컴포넌트로 하단 고정 버튼 UI 통일
- PaymentMethodSelector 컴포넌트로 결제 방법 선택 기능 구현
- 재사용 가능한 컴포넌트 구조로 설계

파일:
- src/components/common/ButtonNav.vue
- src/components/common/PaymentMethodSelector.vue
```

## 3. 팬미팅 데이터 구조 파일 추가
```
feat: 팬미팅 데이터 구조 파일 추가

- 팬미팅 정보 중앙화된 데이터 관리
- 인플루언서 목록 및 상세 정보 구조화
- 확장 가능한 데이터 모델 설계

파일:
- src/data/
```

## 4. 예약 시스템 라우터 설정 추가
```
feat: 예약 시스템 라우터 설정 추가

- 팬미팅 예약 플로우 라우트 구성
- 동적 라우팅으로 팬미팅 ID 처리
- 결제 완료 페이지 라우트 통합

파일:
- src/router/reservation.js
- src/router/index.js 수정
```

## 5. 앱 네비게이션 로직 및 스크롤 초기화 기능 구현
```
feat: 앱 네비게이션 로직 및 스크롤 초기화 기능 구현

- 특정 페이지에서 하단 네비게이션 숨김 처리
- 페이지 전환 시 스크롤 위치 자동 초기화
- 사용자 경험 개선을 위한 네비게이션 로직 추가

파일:
- src/App.vue
```

## 6. AppHeader 컴포넌트 뒤로가기 기능 및 스타일 개선
```
feat: AppHeader 컴포넌트 뒤로가기 기능 및 스타일 개선

- 뒤로가기 버튼 클릭 이벤트 핸들러 추가
- 헤더 레이아웃 및 스타일 개선
- 반응형 디자인 적용

파일:
- src/components/layout/AppHeader.vue
```

## 7. SearchBar 컴포넌트 스타일 정리 및 노출 기능 추가
```
feat: SearchBar 컴포넌트 스타일 정리 및 노출 기능 추가

- Tailwind CSS 클래스 정리 및 일관성 개선
- 검색어 키워드 외부 노출 기능 추가 (defineExpose)
- 코드 포매팅 및 가독성 향상

파일:
- src/components/common/SearchBar.vue
```

## 8. 팬미팅 목록 페이지 검색 기능 및 UI 개선
```
feat: 팬미팅 목록 페이지 검색 기능 및 UI 개선

- 실시간 검색 기능 구현
- 검색 결과 없음 상태 처리
- 여단오 프로필 이미지 적용
- 데이터 구조 개선 및 외부 데이터 파일 연동

파일:
- src/pages/FanMeetingPage.vue
```

## 9. 팬미팅 상세 페이지 레이아웃 및 데이터 표시 개선
```
feat: 팬미팅 상세 페이지 레이아웃 및 데이터 표시 개선

- 헤더 컴포넌트 통합 및 일관된 네비게이션
- 포스터 이미지 동적 표시 (여단오 전용 포스터)
- BottomButton 컴포넌트 적용
- 라우팅 경로 개선

파일:
- src/pages/FanMeetingDetailPage.vue
```

## 10. 좌석 선택 페이지 UI/UX 개선
```
feat: 좌석 선택 페이지 UI/UX 개선

- 좌석 선택 인터페이스 개선
- 사용자 친화적인 좌석 표시
- 선택된 좌석 정보 표시 개선

파일:
- src/pages/SeatSelectPage.vue
```

## 11. 결제 페이지 전면 리뉴얼 및 결제 방법 선택 기능 구현
```
feat: 결제 페이지 전면 리뉴얼 및 결제 방법 선택 기능 구현

- 전체 레이아웃 리디자인 (회색 배경, 카드형 UI)
- PaymentMethodSelector 컴포넌트 통합
- 주문 정보 표시 개선 (수수료 분리 표시)
- 동적 팬미팅 데이터 연동
- BottomButton 컴포넌트 적용

파일:
- src/pages/FanMeetingPaymentPage.vue
```

## 12. 결제 성공 페이지 디자인 및 기능 개선
```
feat: 결제 성공 페이지 디자인 및 기능 개선

- 성공 페이지 UI/UX 개선
- 예약 정보 표시 개선
- 사용자 피드백 향상

파일:
- src/pages/PaymentSuccessPage.vue
```

## 13. 불필요한 PaymentCompletePage 파일 제거
```
refactor: 불필요한 PaymentCompletePage 파일 제거

- 사용하지 않는 결제 완료 페이지 파일 삭제
- 코드베이스 정리 및 최적화

파일:
- src/pages/PaymentCompletePage.vue (삭제)
```

---

## 커밋 순서 추천
1. 아이콘 및 이미지 파일
2. 데이터 구조 파일
3. 공통 컴포넌트들
4. 라우터 설정
5. App.vue (네비게이션 로직)
6. AppHeader 개선
7. SearchBar 개선
8. 각 페이지별 개선 (FanMeetingPage → FanMeetingDetailPage → SeatSelectPage → FanMeetingPaymentPage → PaymentSuccessPage)
9. 파일 정리 (PaymentCompletePage 삭제)