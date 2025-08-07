-- 실제 테이블 이름(snake_case)에 맞춘 테스트 데이터

-- 현재 데이터 확인
SELECT 'Current data check:' as info;
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL SELECT 'influencers', COUNT(*) FROM influencers  
UNION ALL SELECT 'memberships', COUNT(*) FROM memberships
UNION ALL SELECT 'fan_cards', COUNT(*) FROM fan_cards;

-- 기본 사용자 생성
INSERT IGNORE INTO users (user_id, email, name, phone, social_type, social_id, created_at) VALUES
(1, 'test@kakao.com', '테스트사용자', '010-1234-5678', 'KAKAO', 'kakao_test123', NOW());

-- 인플루언서 생성
INSERT IGNORE INTO influencers (influencer_id, user_id, influencer_name, category, description, profile_image, is_verified, created_at) VALUES
(1, 1, '여단오', 'KPOP', '트로트 여왕 여단오입니다', '/assets/fancard/YeoDanO.svg', TRUE, NOW()),
(2, NULL, '토모토모', 'YOUTUBER', '재미있는 일상 공유', '/assets/fancard/TomoTomo.svg', TRUE, NOW()),
(3, NULL, '침착맨', 'YOUTUBER', '침착하게 방송하는 침착맨', '/assets/fancard/CalmDownMan.svg', TRUE, NOW()),
(4, NULL, '찰스엔터', 'COMEDIAN', '웃음을 전하는 찰스엔터', '/assets/fancard/CharlesEnter.svg', TRUE, NOW()),
(5, NULL, '태하', 'KPOP', 'K-POP 아이돌 태하', '/assets/fancard/TaeHa.svg', TRUE, NOW());

-- 멤버십 등급 생성
INSERT IGNORE INTO membership_grades (grade_id, grade_name, color, benefits_description, created_at) VALUES
(1, 'White', '#FFFFFF', '기본 멤버십 혜택'),
(2, 'Silver', '#C0C0C0', '실버 등급 전용 혜택'),
(3, 'Gold', '#FFD700', '골드 등급 프리미엄 혜택'),
(4, 'VIP', '#8A2BE2', 'VIP 등급 최고급 혜택');

-- 사용자 기기 등록
INSERT IGNORE INTO user_devices (device_id, user_id, device_identifier, device_name, device_type, is_primary, is_active, registered_at) VALUES
(1, 1, 'test_device_001', 'Test iPhone', 'MOBILE', TRUE, TRUE, NOW());

-- 멤버십 생성
INSERT IGNORE INTO memberships (membership_id, user_id, influencer_id, grade_id, subscription_start, subscription_end, monthly_amount, total_paid_amount, status, auto_renewal, created_at) VALUES
(1, 1, 1, 3, '2024-01-01', '2024-12-31', 15000.00, 120000.00, 'ACTIVE', TRUE, NOW()),
(2, 1, 2, 2, '2024-03-01', '2025-02-28', 10000.00, 50000.00, 'ACTIVE', TRUE, NOW()),
(3, 1, 3, 4, '2024-06-01', '2025-05-31', 20000.00, 40000.00, 'ACTIVE', TRUE, NOW()),
(4, 1, 4, 1, '2024-04-01', '2025-03-31', 8000.00, 32000.00, 'ACTIVE', FALSE, NOW()),
(5, 1, 5, 2, '2024-05-01', '2025-04-30', 12000.00, 36000.00, 'ACTIVE', TRUE, NOW());

-- 팬카드 생성 (사용자 1이 5개 팬카드를 가짐)
INSERT IGNORE INTO fan_cards (card_id, membership_id, card_number, qr_code, issue_date, expiry_date, card_design_url, is_active, registered_device_id, created_at) VALUES
(1, 1, 'FC240001001', 'QR_FC240001001', '2024-01-01', '2024-12-31', '/assets/fancard/YeoDanO.svg', TRUE, 1, NOW()),
(2, 2, 'FC240003001', 'QR_FC240003001', '2024-03-01', '2025-02-28', '/assets/fancard/TomoTomo.svg', TRUE, 1, NOW()),
(3, 3, 'FC240006001', 'QR_FC240006001', '2024-06-01', '2025-05-31', '/assets/fancard/CalmDownMan.svg', TRUE, 1, NOW()),
(4, 4, 'FC240004001', 'QR_FC240004001', '2024-04-01', '2025-03-31', '/assets/fancard/CharlesEnter.svg', TRUE, 1, NOW()),
(5, 5, 'FC240005001', 'QR_FC240005001', '2024-05-01', '2025-04-30', '/assets/fancard/TaeHa.svg', TRUE, 1, NOW());

-- 결과 확인
SELECT 'Final data check:' as info;
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL SELECT 'influencers', COUNT(*) FROM influencers  
UNION ALL SELECT 'memberships', COUNT(*) FROM memberships
UNION ALL SELECT 'fan_cards', COUNT(*) FROM fan_cards;

-- 팬카드 목록 조회 (실제 API가 반환할 데이터 확인)
SELECT 'Fancard list data:' as info;
SELECT 
    fc.card_id,
    fc.card_number,
    i.influencer_id,
    i.influencer_name,
    i.category,
    mg.grade_id,
    mg.grade_name,
    fc.card_design_url,
    fc.is_active,
    fc.issue_date,
    fc.expiry_date
FROM fan_cards fc
JOIN memberships m ON fc.membership_id = m.membership_id
JOIN influencers i ON m.influencer_id = i.influencer_id
JOIN membership_grades mg ON m.grade_id = mg.grade_id
WHERE m.user_id = 1;

SELECT 'Setup completed! Ready for testing.' as status;