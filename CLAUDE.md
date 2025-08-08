# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**fanzip-client** is a Vue 3 frontend application for a K-pop fan service platform that handles fan meetings, merchandise marketplace, fan cards, and membership features. Built with Vite, uses Pinia for state management, Vue Router for navigation, and TailwindCSS for styling.

## Key Commands

### Development
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production 
- `npm run preview` - Preview production build locally
- `npm run lint` - Lint and auto-fix code with ESLint
- `npm run format` - Format code with Prettier

### Installation
- `npm install` - Install all dependencies

## Architecture & Structure

### Domain-Based Organization
The codebase follows a domain-driven structure with clear separation of concerns:

**Main Domains:**
- `auth/` - Authentication (Kakao social login, token management)
- `fancard/` - Digital fan cards and mobile tickets
- `market/` - E-commerce marketplace for fan merchandise
- `reservation/` - Fan meeting reservations and seat selection
- `mypage/` - User profile and account management
- `cart/` - Shopping cart functionality
- `membership/` - Membership tiers and benefits
- `payment/` - Payment processing integration

### Key Architectural Patterns

**State Management (Pinia)**
- Each domain has its own store (e.g., `authStore.js`, `marketStore.js`)
- Stores use Composition API with `defineStore()`
- Token-based authentication with automatic refresh handling

**API Layer**
- Centralized axios instance in `src/api/axios.js` with interceptors
- Domain-specific API modules (e.g., `authApi.js`, `marketApi.js`)
- Automatic token attachment and 401 handling with refresh logic

**Routing Structure**
- Domain-based route modules imported into main router
- Each domain has its own route file (e.g., `auth.js`, `market.js`)
- Scroll behavior resets to top on navigation

### Component Architecture
- Base components in `components/common/` (BaseButton, BaseModal, etc.)
- Domain-specific components organized by feature
- Layout components provide consistent structure across pages

### Styling System
- TailwindCSS with custom design tokens
- Brand colors: Primary (#FFD633), Accent (#FFBC00)
- Custom spacing for consistent button sizing
- Pretendard font family

## Development Environment

**Vite Configuration:**
- Dev server proxy: `/api` routes to `http://localhost:8080`
- Path alias: `@` maps to `src/` directory
- Vue DevTools enabled in development

**Code Quality:**
- ESLint with Vue plugin and Prettier integration
- Flat config format using `eslint.config.js`
- Auto-formatting on lint command

## Authentication Flow

The app uses Kakao social login with JWT tokens:
1. User redirects to Kakao OAuth
2. Callback handles code exchange
3. 200 response = existing user (set token, redirect home)
4. 202 response = new user (collect additional info, then register)
5. Automatic token refresh on 401 errors via axios interceptors

## API Integration

- Base URL proxy configured for `/api` routes
- All requests automatically include Bearer token
- 1-second timeout configured
- Comprehensive error handling with token refresh logic

## Payment Integration

Supports multiple payment methods:
- TossPayments SDK
- PortOne browser SDK  
- KakaoPay, NaverPay, KB Pay options

## Mobile-First Design

Built with mobile-first responsive design principles using TailwindCSS utilities and custom spacing tokens for consistent UI components.