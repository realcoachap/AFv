# Ascending Fitness - Brand Guidelines

## 🎨 Brand Identity

**Company Name:** Ascending Fitness  
**Tagline:** _(to be determined)_  
**Mission:** Empowering clients to reach new heights through personalized training

---

## 🖼️ Logo

**Primary Logo:** `/public/branding/logo.jpg`
- Clean, minimalist design
- Icon: Stylized figure lifting barbell overhead
- Creates sense of strength, progress, upward movement
- Works on dark and light backgrounds

**Animated Logo:** 6-second version (to be added)

**Usage:**
- Authentication pages: Center-aligned, above forms
- Dashboard: Top-left corner of navigation bar
- Emails/notifications: Header
- Mobile: Favicon + app icon

---

## 🎨 Color Palette

### Primary Colors
**Navy/Charcoal** (Background)
- Hex: `#1A2332` (from logo background)
- RGB: `rgb(26, 35, 50)`
- Usage: Backgrounds, headers, navigation

**Cream/Beige** (Accent)
- Hex: `#E8DCC4` (from logo icon/text)
- RGB: `rgb(232, 220, 196)`
- Usage: Icons, text on dark backgrounds, buttons, highlights

### Secondary Colors
**White**
- Hex: `#FFFFFF`
- Usage: Text on dark backgrounds, card backgrounds

**Light Gray**
- Hex: `#F3F4F6`
- Usage: Subtle backgrounds, borders

### Status Colors
**Success/Confirmed** - Green
- Hex: `#10B981`
- Usage: Confirmed appointments, success messages

**Warning/Pending** - Yellow
- Hex: `#F59E0B`
- Usage: Pending approvals, warnings

**Error/Cancelled** - Red
- Hex: `#EF4444`
- Usage: Errors, cancelled items, destructive actions

**Info** - Blue
- Hex: `#3B82F6`
- Usage: Info messages, links

---

## 🔤 Typography

### Headings
- **Font:** Inter, Poppins, or system sans-serif
- **Weight:** 600-800 (SemiBold to Bold)
- **Style:** Clean, modern, professional
- **Letter spacing:** Slightly tight (-0.02em)

### Body Text
- **Font:** Inter or system sans-serif
- **Weight:** 400 (Regular) for body, 500 (Medium) for emphasis
- **Line height:** 1.5-1.7 (comfortable reading)

### Buttons
- **Weight:** 600 (SemiBold)
- **Transform:** None (use sentence case)
- **Size:** 16px minimum for touch targets

---

## 🎯 Design Principles

### 1. **Strength & Power**
- Bold, confident design elements
- Strong typography
- High contrast

### 2. **Simplicity**
- Clean layouts
- Minimal distractions
- Focus on core actions

### 3. **Professionalism**
- Polished UI
- Consistent spacing
- Attention to detail

### 4. **Motivation**
- Upward visual direction (arrows, progress bars)
- Achievement-focused language
- Positive reinforcement

---

## 📱 Component Style Guide

### Buttons
**Primary (Call-to-action):**
- Background: Cream (#E8DCC4)
- Text: Navy (#1A2332)
- Hover: Slightly darker cream
- Border radius: 8px
- Padding: 12px 24px

**Secondary:**
- Background: Transparent
- Border: 2px solid cream
- Text: Cream
- Hover: Background cream, text navy

**Danger (Destructive):**
- Background: Red (#EF4444)
- Text: White
- Hover: Darker red

### Forms
**Input fields:**
- Border: 1px solid gray
- Focus: Border changes to cream
- Border radius: 6px
- Padding: 12px
- Background: White (on dark pages) or light gray (on light pages)

**Labels:**
- Weight: 500 (Medium)
- Color: Navy or gray
- Margin bottom: 6px

### Cards
- Background: White
- Border radius: 12px
- Shadow: Subtle (0 2px 8px rgba(0,0,0,0.08))
- Padding: 24px

---

## 🖥️ Page Layouts

### Authentication Pages
- Centered form (max-width: 400px)
- Logo at top
- Clean, focused
- No navigation bar
- Dark background with cream accents

### Dashboard Pages
- Navigation bar (top or side)
- Logo in nav
- Main content area
- Sidebar for filters/actions (optional)
- Light background

---

## 📐 Spacing System

Use 8px base unit:
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px
- `3xl`: 64px

**Grid:** 12-column grid, 24px gutters

---

## 🚫 Don'ts

- ❌ Don't use Comic Sans or unprofessional fonts
- ❌ Don't use overly bright, neon colors
- ❌ Don't clutter pages with too many elements
- ❌ Don't use generic stock photos
- ❌ Don't mix too many font families (max 2)

---

## ✅ Do's

- ✅ Use high contrast for readability
- ✅ Ensure touch targets are large enough (min 44px)
- ✅ Test on mobile devices
- ✅ Keep animations subtle and purposeful
- ✅ Use whitespace generously

---

## 📦 Assets Location

```
public/
├── branding/
│   ├── logo.jpg              # Static logo
│   ├── logo-animated.mp4     # 6-second animated version
│   ├── favicon.ico           # To be created
│   └── logo-white.svg        # White version for dark backgrounds (to be created)
```

---

## 🎨 Tailwind CSS Config (Proposed)

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#1A2332',
          cream: '#E8DCC4',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    }
  }
}
```

---

**Maintained by Vlad | Last updated: 2026-02-08**
