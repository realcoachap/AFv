# Phase 2: Authentication System - Implementation Proposal

**Project:** Ascending Fitness Client Management System  
**Phase:** 2 of 6 - Authentication & Access Control  
**Prepared by:** Vlad  
**Date:** 2026-02-08  
**Status:** Awaiting Approval

---

## 🎯 Goals

Build a secure, user-friendly authentication system that:
1. Allows clients to register themselves
2. Allows you (admin) and clients to log in
3. Routes users to appropriate dashboards based on role
4. Protects sensitive pages from unauthorized access
5. Maintains secure sessions

---

## 🔐 What We're Building

### 1. **Registration Page** (`/register`)
- **Who can access:** Anyone (public)
- **What it does:** 
  - Clients enter email, password, full name, phone
  - Creates User account (role: CLIENT)
  - Creates basic ClientProfile
  - Automatically logs them in
  - Redirects to client dashboard

**Design:**
- Ascending Fitness branding (logo, colors)
- Clean, mobile-friendly form
- Password strength indicator
- Email validation
- Terms of service checkbox (optional)

**Fields:**
```
Email Address         [____________]
Password              [____________] (min 8 chars, show/hide toggle)
Confirm Password      [____________]
Full Name             [____________]
Phone Number          [____________]

[ ] I agree to Terms of Service

[  Register  ] button

Already have an account? Log in
```

---

### 2. **Login Page** (`/login`)
- **Who can access:** Anyone (public)
- **What it does:**
  - User enters email + password
  - System checks credentials
  - If ADMIN → redirect to `/admin/dashboard`
  - If CLIENT → redirect to `/client/dashboard`

**Design:**
- Same branding as registration
- "Forgot password?" link (Phase 3 feature)
- "Don't have an account? Register" link

**Fields:**
```
Email Address    [____________]
Password         [____________] (show/hide toggle)

[ ] Remember me

[  Log In  ] button

Don't have an account? Register here
Forgot your password?
```

---

### 3. **Admin User Creation**
Since registration is client-only, we need to create your admin account.

**Options:**
- **A) Seed script** (run once, creates admin in database)
- **B) Manual creation via Prisma Studio**
- **C) Admin registration page (hidden URL, one-time use)**

**Recommendation:** Option A (seed script)

**Admin credentials:**
```
Email: coach@ascendingfitness.com (or your preferred email)
Password: (you'll set this when we run the seed script)
Role: ADMIN
```

---

### 4. **Password Security**
- **Hashing:** bcrypt (industry standard)
- **Salt rounds:** 10 (secure but performant)
- **Never stored plain text:** Passwords are one-way encrypted
- **Validation:** Min 8 characters, must include letter + number (configurable)

---

### 5. **Session Management**
- **Technology:** NextAuth.js (built for Next.js)
- **Session type:** JWT (JSON Web Token)
- **Duration:** 7 days (stays logged in for a week)
- **Refresh:** Auto-refreshes on activity
- **Logout:** Clears session, redirects to login

---

### 6. **Protected Routes**

**Public pages (anyone can access):**
- `/` (homepage - will design later)
- `/login`
- `/register`

**Client-only pages:**
- `/client/dashboard`
- `/client/profile`
- `/client/appointments`

**Admin-only pages:**
- `/admin/dashboard`
- `/admin/clients`
- `/admin/appointments`
- `/admin/calendar`

**Protection method:**
- Middleware checks session before page loads
- If not logged in → redirect to `/login`
- If wrong role (client trying to access admin) → redirect to appropriate dashboard

---

## 🎨 Branding & Design

### **Color Scheme** (from logo)
- **Primary:** Dark navy/charcoal (#1A2332 - from logo background)
- **Accent:** Cream/beige (#E8DCC4 - from logo icon)
- **Text:** White on dark, dark on light
- **Error:** Red (#EF4444)
- **Success:** Green (#10B981)

### **Typography**
- **Headings:** Bold, clean sans-serif
- **Body:** Readable, professional
- **Buttons:** Bold, all-caps or sentence case

### **Logo Placement**
- Top center or top left on auth pages
- Navigation bar on dashboard pages

### **Mobile-First**
- Forms stack vertically on mobile
- Large touch targets (buttons)
- Easy keyboard input on phones

---

## 🛠️ Technical Implementation

### **Libraries to Install**
```bash
npm install next-auth@^5
npm install bcryptjs
npm install @types/bcryptjs --save-dev
npm install zod (for form validation)
npm install react-hook-form (for form handling)
```

### **File Structure**
```
app/
├── (auth)/                   # Auth pages (no layout navbar)
│   ├── login/
│   │   └── page.tsx
│   └── register/
│       └── page.tsx
├── api/
│   └── auth/
│       └── [...nextauth]/
│           └── route.ts     # NextAuth config
├── (dashboard)/              # Protected pages
│   ├── admin/
│   │   └── dashboard/
│   │       └── page.tsx
│   └── client/
│       └── dashboard/
│           └── page.tsx
└── middleware.ts             # Route protection
lib/
├── auth.ts                   # NextAuth configuration
├── prisma.ts                 # Prisma client singleton
└── validations/
    └── auth.ts               # Form validation schemas
components/
├── auth/
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   └── AuthLayout.tsx
└── ui/                       # shadcn/ui components
```

---

## 🔄 User Flows

### **New Client Registration Flow**
```
1. Visit /register
2. Fill out form (email, password, name, phone)
3. Submit
   → Validate inputs (email format, password strength, etc.)
   → Check if email already exists (error if yes)
   → Hash password with bcrypt
   → Create User record (role: CLIENT)
   → Create ClientProfile record
   → Create session (auto-login)
   → Redirect to /client/dashboard
4. See welcome message + empty dashboard
```

### **Returning User Login Flow**
```
1. Visit /login
2. Enter email + password
3. Submit
   → Find user by email
   → Compare hashed password
   → If match:
     → Create session
     → Check role:
       - ADMIN → redirect to /admin/dashboard
       - CLIENT → redirect to /client/dashboard
   → If no match:
     → Show error: "Invalid email or password"
```

### **Admin Access Flow**
```
1. Run seed script (creates admin user)
2. Visit /login
3. Enter admin credentials
4. Redirect to /admin/dashboard
5. See admin controls
```

---

## 🧪 Testing Checklist

**Registration:**
- [ ] Can create account with valid info
- [ ] Rejects duplicate email
- [ ] Rejects weak password
- [ ] Rejects invalid email format
- [ ] Rejects missing required fields
- [ ] Auto-logs in after registration
- [ ] Redirects to client dashboard

**Login:**
- [ ] Can log in with correct credentials
- [ ] Rejects wrong password
- [ ] Rejects non-existent email
- [ ] Admin goes to admin dashboard
- [ ] Client goes to client dashboard
- [ ] Session persists on page refresh

**Security:**
- [ ] Password is hashed in database (never plain text)
- [ ] Can't access admin pages as client
- [ ] Can't access client pages without login
- [ ] Logout clears session properly
- [ ] No sensitive data in browser storage

**UI/UX:**
- [ ] Forms work on mobile
- [ ] Error messages are clear
- [ ] Loading states during submit
- [ ] Password show/hide toggle works
- [ ] Logo displays correctly

---

## ⏱️ Estimated Timeline

**Development:**
- NextAuth.js setup: 2-3 hours
- Registration page: 2-3 hours
- Login page: 1-2 hours
- Admin seed script: 30 minutes
- Middleware + route protection: 1-2 hours
- Testing: 2-3 hours
- Bug fixes: 1-2 hours

**Total:** ~12-16 hours (split over 2-3 days)

---

## 🚨 Potential Issues & Solutions

### **Issue:** Password reset (user forgets password)
**Solution:** Phase 3 feature - not blocking for MVP

### **Issue:** Email verification (confirm email is real)
**Solution:** Phase 3 feature - not blocking for MVP

### **Issue:** Two-factor authentication
**Solution:** Future feature - not needed for MVP

### **Issue:** Social login (Google, Facebook)
**Solution:** Not needed - email/password is sufficient for personal training clients

---

## 📋 Deliverables

By end of Phase 2, you'll have:

✅ Working registration page  
✅ Working login page  
✅ Admin account created  
✅ Password hashing enabled  
✅ Role-based routing (admin vs client)  
✅ Protected routes (can't access without login)  
✅ Session management (stay logged in)  
✅ Logout functionality  
✅ Error handling (clear user feedback)  
✅ Mobile-responsive forms  
✅ Ascending Fitness branding applied  

---

## 🎨 Design Mockup (Text Version)

**Login Page:**
```
┌────────────────────────────────────────┐
│                                        │
│         [Ascending Fitness Logo]       │
│                                        │
│         Welcome Back                   │
│         Log in to your account         │
│                                        │
│  Email Address                         │
│  ┌──────────────────────────────────┐ │
│  │ coach@ascendingfitness.com       │ │
│  └──────────────────────────────────┘ │
│                                        │
│  Password                              │
│  ┌──────────────────────────────────┐ │
│  │ ••••••••••                 👁    │ │
│  └──────────────────────────────────┘ │
│                                        │
│  ☐ Remember me     Forgot password?   │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │         LOG IN                   │ │
│  └──────────────────────────────────┘ │
│                                        │
│  Don't have an account? Register      │
│                                        │
└────────────────────────────────────────┘
```

---

## ✅ Approval Checklist

Before I start coding, I need your approval on:

- [ ] **Registration flow:** Client self-registration is enabled
- [ ] **Admin account email:** What email should I use for your admin account?
- [ ] **Password requirements:** Min 8 characters, must include letter + number (good?)
- [ ] **Session duration:** 7 days (stay logged in for a week) - too long/short?
- [ ] **Branding:** Use the logo and color scheme from the image
- [ ] **No email verification for now:** Add in Phase 3 (future)
- [ ] **No password reset for now:** Add in Phase 3 (future)

---

## ❓ Questions for You

1. **Admin email:** What email address should I use for your admin account?
   - Suggestion: `coach@ascendingfitness.com` or your personal email?

2. **Color scheme:** Should I use the dark navy from the logo, or different brand colors?

3. **Homepage:** Should login/register redirect to a homepage first, or go straight to the form?

4. **Terms of Service:** Do you need a Terms checkbox on registration? (We can add placeholder for now)

5. **Client verification:** Should I send you a notification when a new client registers? (WhatsApp or just see in dashboard)

---

## 🚀 Next Steps (If Approved)

1. You approve this proposal
2. You answer the questions above
3. I install NextAuth.js and dependencies
4. I build the pages (login, register, dashboards)
5. I create admin seed script
6. We test together
7. Deploy to Railway

**Estimated delivery:** 2-3 days from approval

---

**Ready to build this, Coach. What do you think?** 💪

**Approve, adjust, or ask questions - I'm here!**

---

**Document by Vlad | Awaiting Coach approval**
