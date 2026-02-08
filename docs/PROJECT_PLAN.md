# Project Plan: Client Management System

## 🎯 Project Goals

Build a reliable, maintainable web application for managing personal training clients with:
- Client registration and profile management
- Admin dashboard for trainer oversight
- Scheduling system with WhatsApp integration
- Clean, well-organized codebase
- Scalable architecture for future features

## 📅 Development Timeline

### Phase 1: Foundation (Week 1) ✅ IN PROGRESS

**Completed:**
- ✅ Repository setup (GitHub: realcoachap/af)
- ✅ Next.js 14+ with TypeScript
- ✅ Tailwind CSS configuration
- ✅ Prisma ORM installed and initialized
- ✅ Database schema designed (Users, ClientProfile, Appointments)
- ✅ Development environment configured
- ✅ ClawHub skills installed (database, postgres, react-expert, api-dev, test-master)

**Next Steps:**
- [ ] Connect to Railway PostgreSQL database
- [ ] Push Prisma schema to database
- [ ] Create initial admin seed script
- [ ] Test database connection
- [ ] Deploy "Hello World" to Railway (verify CI/CD pipeline)

**Deliverables:**
- Working local development environment
- Database connected and migrated
- Basic deployment pipeline verified

---

### Phase 2: Authentication (Week 1-2)

**Tasks:**
- [ ] Install and configure NextAuth.js
- [ ] Create authentication API routes
- [ ] Build registration page (client-only)
- [ ] Build login page (admin + client)
- [ ] Implement role-based middleware
- [ ] Create protected route wrappers
- [ ] Add session management
- [ ] Password hashing with bcrypt

**Testing:**
- [ ] Can clients register successfully?
- [ ] Can admin log in?
- [ ] Does middleware block unauthorized access?
- [ ] Are passwords properly hashed?
- [ ] Do sessions persist correctly?

**Deliverables:**
- Functional authentication system
- Role-based access control working
- Protected routes enforced

---

### Phase 3: Dashboards (Week 2)

**Admin Dashboard:**
- [ ] Overview metrics (total clients, upcoming appointments, recent registrations)
- [ ] Client list view with search/filter
- [ ] Quick actions (add appointment, view client)
- [ ] Navigation menu
- [ ] Logout functionality

**Client Dashboard:**
- [ ] Personal profile summary
- [ ] Upcoming appointments list
- [ ] Quick links (edit profile, schedule)
- [ ] Navigation menu
- [ ] Logout functionality

**UI Components:**
- [ ] Dashboard layout component
- [ ] Stat cards
- [ ] Data tables
- [ ] Navigation sidebar/header
- [ ] Loading states

**Testing:**
- [ ] Does admin see all clients?
- [ ] Can clients only see their own data?
- [ ] Do dashboards render correctly on mobile?
- [ ] Are loading states smooth?

**Deliverables:**
- Functional admin dashboard
- Functional client dashboard
- Role-based data visibility working

---

### Phase 4: Profile & Intake Form (Week 2-3)

**Profile Pages:**
- [ ] Client profile view page
- [ ] Profile edit page
- [ ] Intake form design (collaborate with Coach on fields)
- [ ] Form validation (client-side + server-side)
- [ ] File upload for profile photo (optional)
- [ ] Success/error messaging

**Intake Form Fields (Initial):**
- Full name
- Phone number
- Date of birth
- Emergency contact info
- Fitness goals
- Medical history
- Current/past injuries
- Activity level
- Current weight, target weight, height
- Additional notes

**API Routes:**
- [ ] GET /api/profile/[userId]
- [ ] PUT /api/profile/[userId]
- [ ] POST /api/profile (create)

**Testing:**
- [ ] Can clients complete intake form?
- [ ] Does validation catch invalid data?
- [ ] Can admin view any client profile?
- [ ] Can admin edit client profiles?
- [ ] Does data persist correctly?

**Deliverables:**
- Complete intake form system
- Profile editing functionality
- Admin profile management

---

### Phase 5: Calendar & Scheduling (Week 3-4)

**Calendar Interface:**
- [ ] Install FullCalendar or React Big Calendar
- [ ] Month/week/day views
- [ ] Create appointment modal
- [ ] Edit appointment modal
- [ ] Cancel appointment functionality
- [ ] Color-coding by status

**Appointment Management:**
- [ ] Admin can create appointments
- [ ] Admin can assign clients
- [ ] Admin can set date/time/duration
- [ ] Status management (scheduled, confirmed, completed, etc.)
- [ ] Notes field for session details

**WhatsApp Integration:**
- [ ] Research WhatsApp Business API options
- [ ] Set up WhatsApp credentials
- [ ] Create notification template
- [ ] Send booking confirmation
- [ ] Send appointment reminders (24h before)
- [ ] Handle delivery status

**API Routes:**
- [ ] GET /api/appointments
- [ ] POST /api/appointments
- [ ] PUT /api/appointments/[id]
- [ ] DELETE /api/appointments/[id]
- [ ] POST /api/notifications/whatsapp

**Testing:**
- [ ] Can admin create appointments?
- [ ] Do clients see their appointments?
- [ ] Are WhatsApp messages sent?
- [ ] Do reminders trigger correctly?
- [ ] Can appointments be cancelled?

**Deliverables:**
- Functional scheduling system
- WhatsApp integration working
- Appointment lifecycle complete

---

### Phase 6: Polish & Launch (Week 4)

**Quality Assurance:**
- [ ] Mobile responsiveness audit
- [ ] Cross-browser testing (Chrome, Safari, Firefox)
- [ ] Error handling review
- [ ] Loading states everywhere
- [ ] User feedback messages
- [ ] Security audit

**Performance:**
- [ ] Image optimization
- [ ] Database query optimization
- [ ] API response time checks
- [ ] Lighthouse audit (aim for >90 scores)

**Documentation:**
- [ ] User guide (how to use the system)
- [ ] Admin guide (management tasks)
- [ ] API documentation
- [ ] Deployment runbook

**Final Deployment:**
- [ ] Domain configuration (if applicable)
- [ ] SSL certificate verified
- [ ] Environment variables set in Railway
- [ ] Database backups configured
- [ ] Monitoring set up

**Testing:**
- [ ] Full user flow test (registration → profile → booking)
- [ ] Admin workflow test
- [ ] Load testing (simulate multiple users)
- [ ] Security penetration test (basic)

**Deliverables:**
- Production-ready application
- Complete documentation
- Monitoring and backups active

---

## 🔮 Future Phases (Post-MVP)

### Phase 7: Payments & Subscriptions
- Stripe integration
- Package/plan management
- Payment history
- Automated billing

### Phase 8: Workout Plans
- Exercise library
- Workout plan builder
- Assign plans to clients
- Progress tracking

### Phase 9: Progress Tracking
- Weight tracking over time
- Measurement history
- Photo uploads (progress pics)
- Charts and graphs

### Phase 10: Nutrition
- Meal planning
- Macro tracking
- Food diary
- Recipe library

### Phase 11: Mobile App
- React Native app
- Push notifications
- Offline mode
- Camera integration

---

## 🛠️ Technical Decisions

### Why Next.js?
- Server-side rendering for performance
- Built-in API routes (no separate backend)
- Great TypeScript support
- Industry standard, huge community

### Why Prisma?
- Type-safe database queries
- Excellent migrations
- Visual database browser
- Works perfectly with PostgreSQL

### Why Railway?
- Includes PostgreSQL database
- Simple deployment
- Affordable pricing
- Auto-deploys from GitHub

### Why NextAuth.js?
- Built for Next.js
- Supports JWT and sessions
- Easy role-based access
- Well-documented

---

## 📊 Success Metrics

**Phase 1 Complete When:**
- ✅ Can run locally without errors
- ✅ Database connected and schema applied
- ✅ Deployed to Railway and accessible

**MVP Complete When:**
1. Clients can register and log in
2. Clients can fill out intake form
3. Admin can view all clients
4. Admin can schedule appointments
5. Clients see their appointments
6. WhatsApp notifications work
7. System is live on Railway

**Quality Metrics:**
- Zero critical security vulnerabilities
- <2s page load time
- 100% of user flows tested
- Mobile responsive (all pages)
- Lighthouse score >90

---

## 🚨 Risks & Mitigation

### Risk: WhatsApp API Complexity
**Mitigation:** Research multiple providers (Twilio, Meta, etc.), have backup (email notifications)

### Risk: Railway Costs
**Mitigation:** Monitor usage, set spending limits, optimize database queries

### Risk: Scope Creep
**Mitigation:** Stick to MVP features, document future features separately

### Risk: Data Loss
**Mitigation:** Railway auto-backups, test restore procedure

### Risk: Security Breach
**Mitigation:** Security audit before launch, follow OWASP guidelines, regular updates

---

## 📝 Change Log

**2026-02-08:**
- Project initialized
- Foundation phase started
- Database schema designed
- Repository connected to Railway (pending)

---

**Document maintained by Vlad | Last updated: 2026-02-08**
