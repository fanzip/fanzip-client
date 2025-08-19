// 새로운 관리자 심사 목 API
const NEW_STORAGE_KEY = 'fanzip_admin_reviews_v2';

function formatDate(date) {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${day} ${hh}:${mm}`;
}

function createInitialData() {
  const now = Date.now();
  return [
    {
      reviewId: 'REV-2001',
      userId: 'USER-001',
      userName: '김승원',
      nickname: '김승원빈',
      category: 'FASHION',
      snsLink: 'https://instagram.com/won.sss',
      intro: '안녕하세요. 김승원빈입니다. 패션 인플루언서로 활동하고 있으며, 현재 12만 팔로워를 보유하고 있습니다. 심사 신청드립니다.',
      appliedAt: formatDate(now - 1000 * 60 * 60 * 24 * 1),
      status: 'PENDING'
    },
    {
      reviewId: 'REV-2002',
      userId: 'USER-002',
      userName: '박지민',
      nickname: '지민님',
      category: 'BEAUTY',
      snsLink: 'https://youtube.com/@jiminbeauty',
      intro: '뷰티 콘텐츠 크리에이터로 활동중입니다.',
      appliedAt: formatDate(now - 1000 * 60 * 60 * 24 * 2),
      status: 'APPROVED',
      reviewedAt: formatDate(now - 1000 * 60 * 60 * 12),
      message: '심사가 완료되었습니다. 축하드립니다!'
    },
    {
      reviewId: 'REV-2003',
      userId: 'USER-003',
      userName: '이철수',
      nickname: '철수로그',
      category: 'GAME',
      snsLink: 'https://twitch.tv/cheolsugame',
      intro: '게임 스트리머입니다.',
      appliedAt: formatDate(now - 1000 * 60 * 60 * 24 * 3),
      status: 'REJECTED',
      reviewedAt: formatDate(now - 1000 * 60 * 60 * 8),
      message: '활동 이력이 부족합니다.'
    }
  ];
}

function loadData() {
  try {
    const stored = localStorage.getItem(NEW_STORAGE_KEY);
    if (!stored) {
      const initial = createInitialData();
      localStorage.setItem(NEW_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(stored);
  } catch {
    const initial = createInitialData();
    localStorage.setItem(NEW_STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
}

function saveData(data) {
  localStorage.setItem(NEW_STORAGE_KEY, JSON.stringify(data));
}

export function getReviews(params = {}) {
  const { page = 1, size = 10, status, q } = params;
  let data = loadData();

  // 상태 필터
  if (status) {
    data = data.filter(item => item.status === status);
  }

  // 검색 필터
  if (q && q.trim()) {
    const query = q.trim().toLowerCase();
    data = data.filter(item =>
      (item.nickname && item.nickname.toLowerCase().includes(query)) ||
      (item.userName && item.userName.toLowerCase().includes(query))
    );
  }

  const total = data.length;
  const start = (page - 1) * size;
  const end = start + size;
  const items = data.slice(start, end);

  return Promise.resolve({ items, total });
}

export function updateReviewStatus(reviewId, status, message = '') {
  const data = loadData();
  const index = data.findIndex(item => item.reviewId === reviewId);
  
  if (index === -1) {
    return Promise.reject(new Error('Review not found'));
  }

  data[index] = {
    ...data[index],
    status,
    message,
    reviewedAt: formatDate(Date.now())
  };

  saveData(data);
  return Promise.resolve(data[index]);
}

export function clearAllData() {
  localStorage.removeItem(NEW_STORAGE_KEY);
  const newData = createInitialData();
  localStorage.setItem(NEW_STORAGE_KEY, JSON.stringify(newData));
  return Promise.resolve(true);
}