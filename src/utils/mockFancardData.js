// 백엔드 API 응답과 일치하는 목 데이터

export const mockFancardList = {
  fancards: [
    {
      cardId: 1,
      cardNumber: 'FC-2024-000001',
      influencerId: 1,
      influencerName: '여단오',
      category: 'KPOP',
      membershipGrade: {
        gradeId: 4,
        gradeName: 'VIP',
        color: '#8A2BE2',
        benefitsDescription: 'VIP 등급 최고급 혜택'
      },
      cardDesignUrl: '/src/assets/fancard/YeoDanO.svg',
      isActive: true,
      issueDate: '2024-01-01',
      expiryDate: '2024-12-31'
    },
    {
      cardId: 2,
      cardNumber: 'FC-2024-000002',
      influencerId: 2,
      influencerName: '토모토모',
      category: 'YOUTUBER',
      membershipGrade: {
        gradeId: 2,
        gradeName: 'Silver',
        color: '#C0C0C0',
        benefitsDescription: '실버 등급 전용 혜택'
      },
      cardDesignUrl: '/src/assets/fancard/TomoTomo.svg',
      isActive: true,
      issueDate: '2024-03-01',
      expiryDate: '2025-02-28'
    },
    {
      cardId: 3,
      cardNumber: 'FC-2024-000003',
      influencerId: 3,
      influencerName: '침착맨',
      category: 'YOUTUBER',
      membershipGrade: {
        gradeId: 3,
        gradeName: 'Gold',
        color: '#FFD700',
        benefitsDescription: '골드 등급 프리미엄 혜택'
      },
      cardDesignUrl: '/src/assets/fancard/CalmDownMan.svg',
      isActive: true,
      issueDate: '2024-06-01',
      expiryDate: '2025-05-31'
    },
    {
      cardId: 4,
      cardNumber: 'FC-2024-000004',
      influencerId: 4,
      influencerName: '찰스엔터',
      category: 'COMEDIAN',
      membershipGrade: {
        gradeId: 1,
        gradeName: 'White',
        color: '#FFFFFF',
        benefitsDescription: '기본 멤버십 혜택'
      },
      cardDesignUrl: '/src/assets/fancard/CharlesEnter.svg',
      isActive: true,
      issueDate: '2024-04-01',
      expiryDate: '2025-03-31'
    },
    {
      cardId: 5,
      cardNumber: 'FC-2024-000005',
      influencerId: 5,
      influencerName: '태하',
      category: 'KPOP',
      membershipGrade: {
        gradeId: 2,
        gradeName: 'Silver',
        color: '#C0C0C0',
        benefitsDescription: '실버 등급 전용 혜택'
      },
      cardDesignUrl: '/src/assets/fancard/TaeHa.svg',
      isActive: true,
      issueDate: '2024-05-01',
      expiryDate: '2025-04-30'
    }
  ]
}

export const mockFancardDetail = {
  cardId: 1,
  cardNumber: 'FC-2024-000001',
  cardDesignUrl: '/src/assets/fancard/YeoDanO.svg',
  influencer: {
    influencerId: 1,
    category: 'KPOP',
    profileImage: '/src/assets/fancard/YeoDanO.svg',
    isVerified: true
  },
  membership: {
    membershipId: 1,
    subscriptionStart: '2024-01-01',
    monthlyAmount: 15000.00,
    totalPaidAmount: 120000.00,
    status: 'ACTIVE',
    autoRenewal: true,
    grade: {
      gradeId: 4,
      gradeName: 'VIP',
      color: '#8A2BE2',
      benefitsDescription: 'VIP 등급 최고급 혜택'
    }
  },
  benefits: [
    {
      benefitId: 1,
      benefitType: 'DISCOUNT',
      benefitName: '상품 할인',
      benefitValue: '20%',
      description: '모든 굿즈 20% 할인',
      isActive: true
    },
    {
      benefitId: 2,
      benefitType: 'PRIORITY_BOOKING',
      benefitName: '우선 예매',
      benefitValue: 'VIP_PRIORITY',
      description: '팬미팅 VIP 등급 우선 예매',
      isActive: true
    },
    {
      benefitId: 3,
      benefitType: 'FREE_SHIPPING',
      benefitName: '무료 배송',
      benefitValue: 'TRUE',
      description: '모든 주문 무료 배송',
      isActive: true
    },
    {
      benefitId: 4,
      benefitType: 'EXCLUSIVE_CONTENT',
      benefitName: 'VIP 독점 콘텐츠',
      benefitValue: 'TRUE',
      description: 'VIP 전용 독점 콘텐츠 제공',
      isActive: true
    }
  ]
}

export const mockQrResponse = {
  qrCode: 'ENTRY_USER_1_1_1_20250806144227',
  qrCodeUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  status: 'ACTIVE',
  generatedAt: '2025-08-06T14:42:27',
  expiresAt: '2025-08-06T14:42:57',
  reservation: {
    reservationId: 1,
    reservationNumber: 'RES20250815001',
    meetingTitle: "2025 여단오 팬미팅 '내가 제일 예뻐'",
    meetingDate: '2025-08-15T19:00:00',
    venueName: '올림픽공원 체조경기장',
    seatNumber: 'F9'
  }
}