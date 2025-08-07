-- Fanzip Test Database Schema Setup - ERD와 정확히 일치
-- MySQL Database for testing fancard functionality

DROP DATABASE IF EXISTS fanzip_test;
CREATE DATABASE fanzip_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE fanzip_test;

-- Users table
CREATE TABLE Users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role ENUM('USER', 'ADMIN', 'INFLUENCER') DEFAULT 'USER',
    social_type ENUM('KAKAO', 'NAVER', 'GOOGLE') DEFAULT 'KAKAO',
    social_id VARCHAR(100),
    address1 VARCHAR(255),
    address2 VARCHAR(255),
    zipcode VARCHAR(10),
    recipient_name VARCHAR(100),
    recipient_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- Influencers table
CREATE TABLE Influencers (
    influencer_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    influencer_name VARCHAR(100) NOT NULL,
    category ENUM('KPOP', 'ACTOR', 'COMEDIAN', 'YOUTUBER', 'MODEL') DEFAULT 'KPOP',
    description TEXT,
    profile_image VARCHAR(500),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE SET NULL
);

-- MembershipGrades table
CREATE TABLE MembershipGrades (
    grade_id INT AUTO_INCREMENT PRIMARY KEY,
    grade_name VARCHAR(50) NOT NULL,
    color VARCHAR(7) NOT NULL,
    benefits_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Memberships table
CREATE TABLE Memberships (
    membership_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    influencer_id BIGINT NOT NULL,
    grade_id INT NOT NULL,
    subscription_start DATE NOT NULL,
    subscription_end DATE,
    monthly_amount DECIMAL(10,2) NOT NULL,
    total_paid_amount DECIMAL(12,2) DEFAULT 0.00,
    status ENUM('ACTIVE', 'PAUSED', 'CANCELLED', 'EXPIRED') DEFAULT 'ACTIVE',
    auto_renewal BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (influencer_id) REFERENCES Influencers(influencer_id) ON DELETE CASCADE,
    FOREIGN KEY (grade_id) REFERENCES MembershipGrades(grade_id) ON DELETE CASCADE
);

-- UserDevices table
CREATE TABLE UserDevices (
    device_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    device_identifier VARCHAR(255) UNIQUE NOT NULL,
    device_name VARCHAR(100),
    device_type ENUM('MOBILE', 'TABLET', 'DESKTOP') DEFAULT 'MOBILE',
    is_primary BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- FanCards table
CREATE TABLE FanCards (
    card_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    membership_id BIGINT UNIQUE NOT NULL,
    card_number VARCHAR(50) UNIQUE NOT NULL,
    qr_code VARCHAR(255) UNIQUE,
    issue_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    card_design_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    registered_device_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (membership_id) REFERENCES Memberships(membership_id) ON DELETE CASCADE,
    FOREIGN KEY (registered_device_id) REFERENCES UserDevices(device_id) ON DELETE SET NULL
);

-- FanMeetings table
CREATE TABLE FanMeetings (
    meeting_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    influencer_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    venue_name VARCHAR(200) NOT NULL,
    venue_address TEXT,
    meeting_date DATETIME NOT NULL,
    total_seats INT NOT NULL DEFAULT 0,
    available_seats INT NOT NULL DEFAULT 0,
    silver_open_time DATETIME,
    gold_open_time DATETIME,
    platinum_open_time DATETIME,
    vip_open_time DATETIME,
    general_open_time DATETIME,
    status ENUM('UPCOMING', 'OPEN', 'SOLDOUT', 'CANCELLED', 'COMPLETED') DEFAULT 'UPCOMING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (influencer_id) REFERENCES Influencers(influencer_id) ON DELETE CASCADE
);

-- FanMeetingSeats table
CREATE TABLE FanMeetingSeats (
    seat_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    meeting_id BIGINT NOT NULL,
    seat_number VARCHAR(20) NOT NULL,
    seat_type ENUM('VIP', 'GOLD', 'SILVER', 'GENERAL') DEFAULT 'GENERAL',
    price DECIMAL(10,2) NOT NULL,
    is_reserved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (meeting_id) REFERENCES FanMeetings(meeting_id) ON DELETE CASCADE,
    UNIQUE KEY unique_seat_per_meeting (meeting_id, seat_number)
);

-- FanMeetingReservations table
CREATE TABLE FanMeetingReservations (
    reservation_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    meeting_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    seat_id BIGINT NOT NULL,
    reservation_number VARCHAR(50) UNIQUE NOT NULL,
    qr_code VARCHAR(255) UNIQUE,
    status ENUM('RESERVED', 'CONFIRMED', 'USED', 'CANCELLED') DEFAULT 'RESERVED',
    verified_device_id BIGINT,
    reserved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMP NULL,
    used_at TIMESTAMP NULL,
    FOREIGN KEY (meeting_id) REFERENCES FanMeetings(meeting_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (seat_id) REFERENCES FanMeetingSeats(seat_id) ON DELETE CASCADE,
    FOREIGN KEY (verified_device_id) REFERENCES UserDevices(device_id) ON DELETE SET NULL
);

-- Products table
CREATE TABLE Products (
    product_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    influencer_id BIGINT NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    group_buy_price DECIMAL(10,2),
    discount_rate DECIMAL(5,2) DEFAULT 0.00,
    discounted_price DECIMAL(10,2),
    shipping_price DECIMAL(10,2) DEFAULT 0.00,
    min_quantity INT DEFAULT 1,
    max_quantity INT DEFAULT 999,
    current_quantity INT DEFAULT 0,
    stock INT NOT NULL DEFAULT 0,
    thumbnail_image VARCHAR(500),
    detail_images JSON,
    description_images JSON,
    silver_open_time DATETIME,
    gold_open_time DATETIME,
    white_open_time DATETIME,
    vip_open_time DATETIME,
    general_open_time DATETIME,
    silver_discount_rate DECIMAL(5,2) DEFAULT 0.00,
    gold_discount_rate DECIMAL(5,2) DEFAULT 0.00,
    white_discount_rate DECIMAL(5,2) DEFAULT 0.00,
    vip_discount_rate DECIMAL(5,2) DEFAULT 0.00,
    status ENUM('DRAFT', 'ACTIVE', 'SOLDOUT', 'DISCONTINUED') DEFAULT 'DRAFT',
    group_buy_end_date DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (influencer_id) REFERENCES Influencers(influencer_id) ON DELETE CASCADE
);

-- ProductOptions table
CREATE TABLE ProductOptions (
    option_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    option_name_1 VARCHAR(100),
    option_name_2 VARCHAR(100),
    stock INT NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE
);

-- Cart table
CREATE TABLE Cart (
    cart_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- CartItems table
CREATE TABLE CartItems (
    cart_item_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cart_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    product_option_id BIGINT,
    quantity INT NOT NULL DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_selected BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (cart_id) REFERENCES Cart(cart_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (product_option_id) REFERENCES ProductOptions(option_id) ON DELETE CASCADE
);

-- Orders table
CREATE TABLE Orders (
    order_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    discount_amount DECIMAL(12,2) DEFAULT 0.00,
    final_amount DECIMAL(12,2) NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED') DEFAULT 'PENDING',
    recipient_name VARCHAR(100) NOT NULL,
    recipient_phone VARCHAR(20) NOT NULL,
    shipping_address1 VARCHAR(255) NOT NULL,
    shipping_address2 VARCHAR(255),
    zipcode VARCHAR(10) NOT NULL,
    shipping_memo TEXT,
    ordered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP NULL,
    shipped_at TIMESTAMP NULL,
    delivered_at TIMESTAMP NULL,
    cancelled_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- OrderItems table
CREATE TABLE OrderItems (
    order_item_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    product_option_id BIGINT,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    discount_rate DECIMAL(5,2) DEFAULT 0.00,
    final_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (product_option_id) REFERENCES ProductOptions(option_id) ON DELETE CASCADE
);

-- Payments table
CREATE TABLE Payments (
    payment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    order_id BIGINT NULL,
    reservation_id BIGINT NULL,
    membership_id BIGINT NULL,
    payment_type ENUM('ORDER', 'RESERVATION', 'MEMBERSHIP') NOT NULL,
    payment_method ENUM('CARD', 'KAKAO_PAY', 'NAVER_PAY', 'TOSS', 'BANK_TRANSFER') NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    status ENUM('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED') DEFAULT 'PENDING',
    transaction_id VARCHAR(100),
    paid_at TIMESTAMP NULL,
    cancelled_at TIMESTAMP NULL,
    refunded_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (reservation_id) REFERENCES FanMeetingReservations(reservation_id) ON DELETE CASCADE,
    FOREIGN KEY (membership_id) REFERENCES Memberships(membership_id) ON DELETE CASCADE
);

-- Benefits table
CREATE TABLE Benefits (
    benefit_id INT AUTO_INCREMENT PRIMARY KEY,
    grade_id INT NOT NULL,
    benefit_type ENUM('DISCOUNT', 'FREE_SHIPPING', 'PRIORITY_BOOKING', 'EXCLUSIVE_CONTENT', 'MERCHANDISE') DEFAULT 'DISCOUNT',
    benefit_name VARCHAR(100) NOT NULL,
    benefit_value VARCHAR(100),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (grade_id) REFERENCES MembershipGrades(grade_id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_memberships_user_id ON Memberships(user_id);
CREATE INDEX idx_memberships_influencer_id ON Memberships(influencer_id);
CREATE INDEX idx_fancards_membership_id ON FanCards(membership_id);
CREATE INDEX idx_fanmeeting_reservations_user_id ON FanMeetingReservations(user_id);
CREATE INDEX idx_fanmeeting_reservations_meeting_id ON FanMeetingReservations(meeting_id);
CREATE INDEX idx_products_influencer_id ON Products(influencer_id);
CREATE INDEX idx_cart_items_cart_id ON CartItems(cart_id);
CREATE INDEX idx_order_items_order_id ON OrderItems(order_id);
CREATE INDEX idx_payments_user_id ON Payments(user_id);