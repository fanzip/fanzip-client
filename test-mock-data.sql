-- Fanzip Test Database Mock Data
-- 팬카드 기능 테스트를 위한 목 데이터

USE fanzip_test;

-- Users 데이터
INSERT INTO Users (user_id, email, name, phone, role, social_type, social_id, created_at) VALUES
(1, 'test1@kakao.com', '김팬덕', '010-1234-5678', 'USER', 'KAKAO', 'kakao_123', NOW()),
(2, 'test2@kakao.com', '박아이돌', '010-2345-6789', 'USER', 'KAKAO', 'kakao_456', NOW()),
(3, 'influencer1@kakao.com', '여단오', '010-3456-7890', 'INFLUENCER', 'KAKAO', 'kakao_789', NOW()),
(4, 'influencer2@kakao.com', '토모토모', '010-4567-8901', 'INFLUENCER', 'KAKAO', 'kakao_101', NOW()),
(5, 'influencer3@kakao.com', '찰스엔터', '010-5678-9012', 'INFLUENCER', 'KAKAO', 'kakao_202', NOW());

-- Influencers 데이터
INSERT INTO Influencers (influencer_id, user_id, influencer_name, category, description, profile_image, is_verified, created_at) VALUES
(1, 3, '여단오', 'KPOP', '트로트 여왕 여단오입니다', 'https://example.com/yeodan.jpg', TRUE, NOW()),
(2, 4, '토모토모', 'YOUTUBER', '재미있는 일상을 공유하는 토모토모', 'https://example.com/tomo.jpg', TRUE, NOW()),
(3, 5, '찰스엔터', 'COMEDIAN', '웃음을 전하는 찰스엔터테인먼트', 'https://example.com/charles.jpg', TRUE, NOW()),
(4, NULL, '침착맨', 'YOUTUBER', '침착하게 방송하는 침착맨', 'https://example.com/calmdown.jpg', TRUE, NOW()),
(5, NULL, '태하', 'KPOP', 'K-POP 아이돌 태하', 'https://example.com/taeha.jpg', TRUE, NOW());

-- MembershipGrades 데이터
INSERT INTO MembershipGrades (grade_id, grade_name, color, benefits_description, created_at) VALUES
(1, 'White', '#FFFFFF', '기본 멤버십 혜택', NOW()),
(2, 'Silver', '#C0C0C0', '실버 등급 전용 혜택 및 할인', NOW()),
(3, 'Gold', '#FFD700', '골드 등급 프리미엄 혜택', NOW()),
(4, 'VIP', '#8A2BE2', 'VIP 등급 최고급 혜택', NOW());

-- Benefits 데이터
INSERT INTO Benefits (grade_id, benefit_type, benefit_name, benefit_value, description, is_active) VALUES
(1, 'DISCOUNT', '기본 할인', '5%', '모든 상품 5% 할인', TRUE),
(2, 'DISCOUNT', '실버 할인', '10%', '모든 상품 10% 할인', TRUE),
(2, 'PRIORITY_BOOKING', '우선 예약', 'TRUE', '팬미팅 우선 예약 가능', TRUE),
(3, 'DISCOUNT', '골드 할인', '15%', '모든 상품 15% 할인', TRUE),
(3, 'FREE_SHIPPING', '무료 배송', 'TRUE', '모든 주문 무료 배송', TRUE),
(3, 'EXCLUSIVE_CONTENT', '독점 콘텐츠', 'TRUE', '골드 전용 독점 콘텐츠 제공', TRUE),
(4, 'DISCOUNT', 'VIP 할인', '20%', '모든 상품 20% 할인', TRUE),
(4, 'FREE_SHIPPING', '무료 배송', 'TRUE', '모든 주문 무료 배송', TRUE),
(4, 'PRIORITY_BOOKING', 'VIP 우선 예약', 'TRUE', '팬미팅 최우선 예약 가능', TRUE),
(4, 'EXCLUSIVE_CONTENT', 'VIP 독점 콘텐츠', 'TRUE', 'VIP 전용 독점 콘텐츠 제공', TRUE),
(4, 'MERCHANDISE', 'VIP 굿즈', 'TRUE', 'VIP 전용 굿즈 제공', TRUE);

-- UserDevices 데이터
INSERT INTO UserDevices (user_id, device_identifier, device_name, device_type, is_primary, is_active, registered_at) VALUES
(1, 'device_user1_mobile', 'iPhone 15', 'MOBILE', TRUE, TRUE, NOW()),
(2, 'device_user2_mobile', 'Galaxy S24', 'MOBILE', TRUE, TRUE, NOW()),
(1, 'device_user1_tablet', 'iPad Air', 'TABLET', FALSE, TRUE, NOW());

-- Memberships 데이터
INSERT INTO Memberships (user_id, influencer_id, grade_id, subscription_start, subscription_end, monthly_amount, total_paid_amount, status, auto_renewal, created_at) VALUES
(1, 1, 3, '2024-01-01', '2024-12-31', 15000.00, 120000.00, 'ACTIVE', TRUE, '2024-01-01 10:00:00'),
(1, 2, 2, '2024-03-01', '2025-02-28', 10000.00, 50000.00, 'ACTIVE', TRUE, '2024-03-01 10:00:00'),
(1, 3, 4, '2024-06-01', '2025-05-31', 20000.00, 40000.00, 'ACTIVE', TRUE, '2024-06-01 10:00:00'),
(2, 1, 2, '2024-02-01', '2025-01-31', 10000.00, 70000.00, 'ACTIVE', TRUE, '2024-02-01 10:00:00'),
(2, 4, 1, '2024-07-01', '2025-06-30', 8000.00, 16000.00, 'ACTIVE', FALSE, '2024-07-01 10:00:00');

-- FanCards 데이터 (Memberships과 1:1 관계)
INSERT INTO FanCards (membership_id, card_number, qr_code, issue_date, expiry_date, card_design_url, is_active, registered_device_id, created_at) VALUES
(1, 'FC240001001', 'QR_FC240001001', '2024-01-01', '2024-12-31', 'https://example.com/cards/yeodan_gold.svg', TRUE, 1, '2024-01-01 10:30:00'),
(2, 'FC240003001', 'QR_FC240003001', '2024-03-01', '2025-02-28', 'https://example.com/cards/tomo_silver.svg', TRUE, 1, '2024-03-01 10:30:00'),
(3, 'FC240006001', 'QR_FC240006001', '2024-06-01', '2025-05-31', 'https://example.com/cards/charles_vip.svg', TRUE, 1, '2024-06-01 10:30:00'),
(4, 'FC240002001', 'QR_FC240002001', '2024-02-01', '2025-01-31', 'https://example.com/cards/yeodan_silver.svg', TRUE, 2, '2024-02-01 10:30:00'),
(5, 'FC240007001', 'QR_FC240007001', '2024-07-01', '2025-06-30', 'https://example.com/cards/calmdown_white.svg', TRUE, 2, '2024-07-01 10:30:00');

-- FanMeetings 데이터
INSERT INTO FanMeetings (meeting_id, influencer_id, title, description, venue_name, venue_address, meeting_date, total_seats, available_seats, vip_open_time, gold_open_time, silver_open_time, general_open_time, status, created_at) VALUES
(1, 1, "2025 여단오 팬미팅 '내가 제일 예뻐'", '여단오와 함께하는 특별한 시간', '올림픽공원 체조경기장', '서울특별시 송파구 올림픽로 424', '2025-08-15 19:00:00', 1000, 850, '2025-07-01 10:00:00', '2025-07-01 12:00:00', '2025-07-01 14:00:00', '2025-07-01 16:00:00', 'OPEN', NOW()),
(2, 2, '토모토모 팬미팅 2025', '토모토모와의 즐거운 만남', '잠실실내체육관', '서울특별시 송파구 올림픽로 25', '2025-09-20 18:00:00', 800, 600, '2025-08-01 10:00:00', '2025-08-01 12:00:00', '2025-08-01 14:00:00', '2025-08-01 16:00:00', 'UPCOMING', NOW());

-- FanMeetingSeats 데이터
INSERT INTO FanMeetingSeats (meeting_id, seat_number, seat_type, price, is_reserved) VALUES
(1, 'A1', 'VIP', 150000.00, FALSE),
(1, 'A2', 'VIP', 150000.00, FALSE),
(1, 'B1', 'GOLD', 120000.00, FALSE),
(1, 'B2', 'GOLD', 120000.00, FALSE),
(1, 'C1', 'SILVER', 80000.00, FALSE),
(1, 'C2', 'SILVER', 80000.00, FALSE),
(1, 'D1', 'GENERAL', 50000.00, FALSE),
(1, 'F9', 'GENERAL', 50000.00, TRUE), -- 예약된 좌석
(2, 'A1', 'VIP', 120000.00, FALSE),
(2, 'B1', 'GOLD', 90000.00, FALSE);

-- FanMeetingReservations 데이터
INSERT INTO FanMeetingReservations (meeting_id, user_id, seat_id, reservation_number, qr_code, status, verified_device_id, reserved_at) VALUES
(1, 1, 8, 'RES20250815001', 'QR_RES20250815001', 'CONFIRMED', 1, '2025-07-15 14:30:00');

-- Cart 데이터
INSERT INTO Cart (user_id, created_at) VALUES
(1, NOW()),
(2, NOW());

-- Products 데이터 (간단한 테스트용)
INSERT INTO Products (influencer_id, name, description, price, stock, thumbnail_image, status, created_at) VALUES
(1, '여단오 포토카드 세트', '여단오 공식 포토카드', 25000.00, 100, 'https://example.com/products/yeodan_photocard.jpg', 'ACTIVE', NOW()),
(2, '토모토모 티셔츠', '토모토모 공식 굿즈', 35000.00, 50, 'https://example.com/products/tomo_tshirt.jpg', 'ACTIVE', NOW());

-- ProductOptions 데이터
INSERT INTO ProductOptions (product_id, option_name_1, option_name_2, stock, is_active) VALUES
(1, '세트A', NULL, 50, TRUE),
(1, '세트B', NULL, 50, TRUE),
(2, 'S', '화이트', 10, TRUE),
(2, 'M', '화이트', 15, TRUE),
(2, 'L', '화이트', 15, TRUE),
(2, 'S', '블랙', 5, TRUE),
(2, 'M', '블랙', 5, TRUE);

-- 데이터 확인용 쿼리들
SELECT 'Users' as table_name, COUNT(*) as count FROM Users
UNION ALL
SELECT 'Influencers', COUNT(*) FROM Influencers
UNION ALL
SELECT 'MembershipGrades', COUNT(*) FROM MembershipGrades
UNION ALL
SELECT 'Memberships', COUNT(*) FROM Memberships
UNION ALL
SELECT 'FanCards', COUNT(*) FROM FanCards
UNION ALL
SELECT 'FanMeetings', COUNT(*) FROM FanMeetings
UNION ALL
SELECT 'FanMeetingReservations', COUNT(*) FROM FanMeetingReservations
UNION ALL
SELECT 'Benefits', COUNT(*) FROM Benefits;