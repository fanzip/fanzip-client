-- 빠른 팬카드 테스트를 위한 최소한의 데이터
-- 백엔드 서버에서 사용하는 MySQL 데이터베이스에서 직접 실행하세요

-- 먼저 기존 데이터 확인
SELECT 'Current data check:' as info;
SELECT 'Users' as table_name, COUNT(*) as count FROM Users
UNION ALL SELECT 'Influencers', COUNT(*) FROM Influencers  
UNION ALL SELECT 'Memberships', COUNT(*) FROM Memberships
UNION ALL SELECT 'FanCards', COUNT(*) FROM FanCards;

-- 기본 사용자 생성 (이미 있으면 무시됨)
INSERT IGNORE INTO Users (user_id, email, name, phone, social_type, social_id, created_at) VALUES
(1, 'test@kakao.com', '테스트사용자', '010-1234-5678', 'KAKAO', 'kakao_test123', NOW());

-- 인플루언서 생성 (이미 있으면 무시됨)
INSERT IGNORE INTO Influencers (influencer_id, user_id, influencer_name, category, description, profile_image, is_verified, created_at) VALUES
(1, 1, '여단오', 'KPOP', '트로트 여왕 여단오입니다', '/assets/fancard/YeoDanO.svg', TRUE, NOW()),
(2, NULL, '토모토모', 'YOUTUBER', '재미있는 일상 공유', '/assets/fancard/TomoTomo.svg', TRUE, NOW());

-- 멤버십 등급 생성 (이미 있으면 무시됨)
INSERT IGNORE INTO MembershipGrades (grade_id, grade_name, color, benefits_description, created_at) VALUES
(1, 'White', '#FFFFFF', '기본 멤버십 혜택'),
(2, 'Silver', '#C0C0C0', '실버 등급 전용 혜택'),
(3, 'Gold', '#FFD700', '골드 등급 프리미엄 혜택'),
(4, 'VIP', '#8A2BE2', 'VIP 등급 최고급 혜택');

-- 혜택 데이터 생성 (이미 있으면 무시됨)
INSERT IGNORE INTO Benefits (benefit_id, grade_id, benefit_type, benefit_name, benefit_value, description, is_active, created_at) VALUES
(1, 2, 'DISCOUNT', '실버 할인', '10%', '모든 상품 10% 할인', TRUE, NOW()),
(2, 2, 'PRIORITY_BOOKING', '우선 예약', 'TRUE', '팬미팅 우선 예약 가능', TRUE, NOW()),
(3, 3, 'DISCOUNT', '골드 할인', '15%', '모든 상품 15% 할인', TRUE, NOW()),
(4, 3, 'FREE_SHIPPING', '무료 배송', 'TRUE', '모든 주문 무료 배송', TRUE, NOW());

-- 사용자 기기 등록 (이미 있으면 무시됨)
INSERT IGNORE INTO UserDevices (device_id, user_id, device_identifier, device_name, device_type, is_primary, is_active, registered_at) VALUES
(1, 1, 'test_device_001', 'Test iPhone', 'MOBILE', TRUE, TRUE, NOW());

-- 멤버십 생성 (이미 있으면 무시됨)
INSERT IGNORE INTO Memberships (membership_id, user_id, influencer_id, grade_id, subscription_start, subscription_end, monthly_amount, total_paid_amount, status, auto_renewal, created_at) VALUES
(1, 1, 1, 3, '2024-01-01', '2024-12-31', 15000.00, 120000.00, 'ACTIVE', TRUE, NOW()),
(2, 1, 2, 2, '2024-03-01', '2025-02-28', 10000.00, 50000.00, 'ACTIVE', TRUE, NOW());

-- 팬카드 생성 (이미 있으면 무시됨)
INSERT IGNORE INTO FanCards (card_id, membership_id, card_number, qr_code, issue_date, expiry_date, card_design_url, is_active, registered_device_id, created_at) VALUES
(1, 1, 'FC240001001', 'QR_FC240001001', '2024-01-01', '2024-12-31', '/assets/fancard/YeoDanO.svg', TRUE, 1, NOW()),
(2, 2, 'FC240003001', 'QR_FC240003001', '2024-03-01', '2025-02-28', '/assets/fancard/TomoTomo.svg', TRUE, 1, NOW());

-- 팬미팅 데이터 (이미 있으면 무시됨)  
INSERT IGNORE INTO FanMeetings (meeting_id, influencer_id, title, description, venue_name, venue_address, meeting_date, total_seats, available_seats, status, created_at) VALUES
(1, 1, "2025 여단오 팬미팅 '내가 제일 예뻐'", '여단오와 함께하는 특별한 시간', '올림픽공원 체조경기장', '서울특별시 송파구 올림픽로 424', '2025-08-15 19:00:00', 1000, 999, 'OPEN', NOW());

-- 좌석 데이터 (이미 있으면 무시됨)
INSERT IGNORE INTO FanMeetingSeats (seat_id, meeting_id, seat_number, seat_type, price, is_reserved) VALUES
(1, 1, 'F9', 'GENERAL', 50000.00, TRUE);

-- 예약 데이터 (이미 있으면 무시됨)
INSERT IGNORE INTO FanMeetingReservations (reservation_id, meeting_id, user_id, seat_id, reservation_number, qr_code, status, reserved_at) VALUES
(1, 1, 1, 1, 'RES20250815001', 'QR_RES20250815001', 'CONFIRMED', NOW());

-- 결과 확인
SELECT 'Final data check:' as info;
SELECT 'Users' as table_name, COUNT(*) as count FROM Users
UNION ALL SELECT 'Influencers', COUNT(*) FROM Influencers  
UNION ALL SELECT 'Memberships', COUNT(*) FROM Memberships
UNION ALL SELECT 'FanCards', COUNT(*) FROM FanCards
UNION ALL SELECT 'FanMeetings', COUNT(*) FROM FanMeetings
UNION ALL SELECT 'FanMeetingReservations', COUNT(*) FROM FanMeetingReservations;

-- 팬카드 데이터 확인
SELECT 
    fc.card_id,
    fc.card_number,
    m.user_id,
    i.influencer_name,
    mg.grade_name,
    fc.card_design_url,
    fc.is_active
FROM FanCards fc
JOIN Memberships m ON fc.membership_id = m.membership_id
JOIN Influencers i ON m.influencer_id = i.influencer_id
JOIN MembershipGrades mg ON m.grade_id = mg.grade_id
WHERE m.user_id = 1;

SELECT 'Setup completed! Ready for testing.' as status;