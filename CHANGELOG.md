# Changelog

All notable changes to the Ascending Fitness Client Management System will be documented in this file.

## [v0.2.1-alpha] - 2026-02-09

### ✨ Added

- **Professional Branding**
  - Created reusable Logo component supporting multiple sizes
  - Created NavBar component with consistent branding across all pages
  - Replaced all 🏋️ emoji with actual Ascending Fitness logo
  - Enhanced landing page with hero section, features grid, and professional design
  - Improved auth pages with large logo and branded background

- **Interactive Calendar Booking** 🎯
  - Click-to-book feature: Click any empty calendar slot to instantly create a session
  - New QuickBookModal component for fast session creation (pre-fills date/time)
  - Helpful tip banner to guide admins about the click-to-book feature
  - Reduces booking workflow from 3+ clicks to 1 click + quick form
  - Selectable calendar slots (admin only)

- **Enhanced User Experience**
  - Improved welcome message on admin dashboard ("Ready to help your clients crush their goals today 💪")
  - Better loading states and transitions
  - Hover animations on landing page CTAs
  - Mobile-responsive features grid

### 🐛 Fixed

- **Phone Number Update Bug**
  - Added `router.refresh()` after profile save to invalidate cached client data
  - Added `Pragma: no-cache` header to client fetch requests
  - Improved success message to confirm phone number updates
  - Added debug logging to track phone numbers in client loading
  - Phone numbers now properly reflect in sessions immediately after update

### 🧹 Cleanup

- Removed duplicate `-old.tsx` files (admin/client schedule pages)
- Unified navigation bars with reusable NavBar component
- Better code organization with shared components

### 📝 Documentation

- Created comprehensive PROPOSAL-v0.2.1.md with full feature breakdown
- Added detailed commit messages for better git history

---

## [v0.2.0] - 2026-02-08

### ✨ Added

- **Phase 3: Client Profile System**
  - Comprehensive 7-section client profile with 25+ fields
  - Profile completion percentage tracking
  - Admin client editing capabilities
  - Conditional form fields with Yes/No dropdowns
  - Height/weight with unit toggles (inches/cm, lbs/kg)
  - Client-side Zod validation

- **Phase 4: Scheduling System**
  - Full session CRUD (Create, Read, Update, Delete)
  - Interactive calendar with month/week/day views (react-big-calendar)
  - Color-coded sessions by status (green=confirmed, yellow=pending, etc.)
  - Session types: ONE_ON_ONE, GROUP, ASSESSMENT, CHECK_IN
  - Real-time dashboard stats (today, week, month, upcoming, pending)
  - Admin and client schedule views
  - Session status management (CONFIRMED, PENDING_APPROVAL, COMPLETED, CANCELLED, NO_SHOW)

- **WhatsApp Reminders**
  - Twilio integration for production WhatsApp messaging
  - Manual "Send Reminder" buttons on sessions
  - Automatic E.164 phone number formatting
  - Foundation for automated reminder system via OpenClaw cron

### 🔧 Technical

- Railway deployment fixes (import paths, NextAuth v5 API, Next.js 15+ async params)
- Prisma schema updates for scheduling system
- API routes: `/api/schedule`, `/api/admin/schedule/stats`, `/api/reminders/send`
- Cache-busting with timestamps on critical data fetches

---

## [v0.1.0] - 2026-02-07

### ✨ Initial Release

- **Phase 1: Foundation**
  - Next.js 14+ with TypeScript
  - Railway deployment with PostgreSQL
  - Prisma ORM integration

- **Phase 2: Authentication**
  - NextAuth v5 authentication
  - Role-based access control (ADMIN, CLIENT)
  - Login/Register pages
  - Separate admin and client dashboards

---

## Legend

- ✨ **Added**: New features
- 🐛 **Fixed**: Bug fixes
- 🔧 **Technical**: Backend/infrastructure changes
- 🧹 **Cleanup**: Code refactoring and cleanup
- 📝 **Documentation**: Documentation updates
- 🚀 **Performance**: Performance improvements
