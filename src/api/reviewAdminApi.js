// 로컬스토리지 기반 간단 목 API (JS)
// 사용처: 관리자 심사 목록/승인/거절

const STORAGE_KEY = 'mock_reviews_v1_js';

function fmt(date) {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${day} ${hh}:${mm}`;
}

function seedIfEmpty() {
  if (localStorage.getItem(STORAGE_KEY)) return;
  const now = Date.now();
  const sample = [
    {
      reviewId: 'R-1001',
      userId: 'U-1',
      userName: '홍길동',
      userEmail: 'hong@example.com',
      nickname: '길동쓰',
      category: 'BEAUTY',
      snsLink: 'https://instagram.com/gildong',
      intro: '뷰티/스킨케어 팁을 공유합니다.',
      appliedAt: fmt(now - 1000 * 60 * 60 * 24 * 1),
      status: 'PENDING'
    },
    {
      reviewId: 'R-1002',
      userId: 'U-2',
      userName: '김아라',
      userEmail: 'ara@example.com',
      nickname: '아라라',
      category: 'GAME',
      snsLink: 'https://youtube.com/@aralala',
      intro: '게임 공략/리뷰 채널 운영',
      appliedAt: fmt(now - 1000 * 60 * 60 * 24 * 2),
      status: 'APPROVED',
      reviewedAt: fmt(now - 1000 * 60 * 60 * 10),
      message: '심사가 완료되었습니다. 축하드립니다!'
    },
    {
      reviewId: 'R-1003',
      userId: 'U-3',
      userName: '이두리',
      userEmail: 'duri@example.com',
      nickname: '두리두리',
      category: 'COOKING',
      intro: '자취 요리/밀프렙 콘텐츠',
      appliedAt: fmt(now - 1000 * 60 * 60 * 24 * 3),
      status: 'REJECTED',
      reviewedAt: fmt(now - 1000 * 60 * 60 * 6),
      message: '채널 활동 이력 확인이 어려워요.'
    },
    {
      reviewId: 'R-1004',
      userId: 'U-4',
      userName: '박민수',
      userEmail: 'minsu@example.com',
      nickname: '민수로그',
      category: 'SPORTS',
      snsLink: '',
      intro: '아마추어 축구 소식 다룹니다.',
      appliedAt: fmt(now - 1000 * 60 * 60 * 5),
      status: 'PENDING'
    }
  ];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sample));
}

function loadAll() {
  seedIfEmpty();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveAll(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function listReviews(params = {}) {
  const { page = 1, size = 10, status, q } = params;
  let items = loadAll();

  if (status) {
    items = items.filter((it) => it.status === status);
  }
  if (q && q.trim()) {
    const qq = q.trim().toLowerCase();
    items = items.filter(
      (it) =>
        (it.nickname && it.nickname.toLowerCase().includes(qq)) ||
        (it.userEmail && it.userEmail.toLowerCase().includes(qq)) ||
        (it.userName && it.userName.toLowerCase().includes(qq))
    );
  }

  const total = items.length;
  const start = (page - 1) * size;
  const end = start + size;
  const paged = items.slice(start, end);

  return Promise.resolve({ items: paged, total });
}

export function decideReview(reviewId, nextStatus, message) {
  const items = loadAll();
  const idx = items.findIndex((it) => it.reviewId === reviewId);
  if (idx === -1) return Promise.reject(new Error('Not found'));

  const now = fmt(Date.now());
  items[idx] = {
    ...items[idx],
    status: nextStatus,
    message: message || items[idx].message,
    reviewedAt: now
  };
  saveAll(items);
  return Promise.resolve(items[idx]);
}

export function resetMock() {
  localStorage.removeItem(STORAGE_KEY);
  seedIfEmpty();
  return Promise.resolve(true);
}

// 초기 시드 노출용
export function ensureMockSeed() {
  seedIfEmpty();
}
