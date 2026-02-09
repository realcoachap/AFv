# Phase 3: Client Profile & Intake Form - Implementation Proposal

**Project:** Ascending Fitness Client Management System  
**Phase:** 3 of 6 - Profile Management  
**Prepared by:** Vlad  
**Date:** 2026-02-08  
**Version:** v0.2.0  
**Status:** Awaiting Approval

---

## 🎯 Goals

Build a comprehensive client intake form that:
1. Captures all health, fitness, and goal information
2. Uses conditional fields (show description boxes only when relevant)
3. Makes all fields optional (info can be completed in person)
4. Allows clients to edit their profile anytime
5. Allows admin to view and edit any client profile

---

## 📋 Database Schema Updates

### **Current ClientProfile Fields:**
```prisma
model ClientProfile {
  id                String   @id @default(cuid())
  userId            String   @unique
  fullName          String
  phone             String
  dateOfBirth       DateTime?
  emergencyContact  String?
  emergencyPhone    String?
  fitnessGoals      String?
  medicalHistory    String?
  injuries          String?
  activityLevel     String?
  currentWeight     Float?
  targetWeight      Float?
  height            Float?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

### **NEW Fields to Add:**

```prisma
model ClientProfile {
  // ... existing fields ...
  
  // Personal Information (expanded)
  email             String?   // Copy from User.email for convenience
  age               Int?
  gender            String?   // "Male" or "Female"
  
  // Emergency Contact (already exists but expanded)
  emergencyRelationship String?
  
  // Health & Medical
  hasMedicalConditions  Boolean?
  medicalConditions     String?   // Description (shows if hasMedicalConditions = true)
  isTakingMedications   Boolean?
  medications           String?   // Description (shows if isTakingMedications = true)
  hasInjuries           Boolean?
  injuriesDescription   String?   // Description (shows if hasInjuries = true)
  hasAllergies          Boolean?
  allergies             String?   // Description (shows if hasAllergies = true)
  fitnessLevel          String?   // "Beginner", "Intermediate", "Advanced"
  
  // Fitness History
  hasWorkedOutBefore    Boolean?
  previousExerciseTypes String?   // Cardio, weights, yoga, etc.
  hasHomeEquipment      Boolean?
  homeEquipmentTypes    String?   // Description of equipment
  
  // Goals
  primaryGoal           String?   // Lose weight, gain muscle, etc.
  secondaryGoals        String?   // Additional goals
  targetTimeline        String?   // 3 months, 6 months, 1 year
  
  // Lifestyle
  typicalActivityLevel  String?   // "Sedentary", "Light Active", "Active", "Very Active"
  averageSleepHours     Float?
  dietaryRestrictions   String?   // Allergies, preferences
  
  // Preferences
  exerciseDaysPerWeek   Int?
  preferredWorkoutDays  String?   // Mon, Wed, Fri at 6pm
  sessionsPerMonth      Int?
}
```

---

## 🎨 Form Design

### **Conditional Field Logic:**

**Example 1: Medical Conditions**
```
Do you have any medical conditions?
[ ] Yes  [ ] No

[IF YES is selected, show:]
Please describe your medical conditions:
┌────────────────────────────────────┐
│                                    │
│  (textarea for description)        │
│                                    │
└────────────────────────────────────┘
```

**Example 2: Allergies**
```
Do you have any allergies?
[ ] Yes  [ ] No

[IF YES is selected, show:]
Please describe your allergies:
┌────────────────────────────────────┐
│                                    │
│  (textarea for description)        │
│                                    │
└────────────────────────────────────┘
```

**Same pattern for:**
- Taking medications?
- Injuries or surgeries?
- Home workout equipment?

---

## 📄 Page Structure

### **1. Client Profile View** (`/client/profile`)

**Read-only display of all filled information:**

```
┌─────────────────────────────────────────┐
│  My Profile                             │
│  [Edit Profile Button]                  │
├─────────────────────────────────────────┤
│                                         │
│  Personal Information                   │
│  • Name: John Doe                       │
│  • Age: 30                              │
│  • Gender: Male                         │
│  • Height: 6'0"                         │
│  • Weight: 180 lbs                      │
│  • Phone: (555) 123-4567                │
│  • Email: john@example.com              │
│                                         │
│  Emergency Contact                      │
│  • Name: Jane Doe                       │
│  • Relationship: Spouse                 │
│  • Phone: (555) 987-6543                │
│                                         │
│  Health & Medical                       │
│  • Medical Conditions: Yes              │
│    - Hypertension                       │
│  • Medications: None                    │
│  • Injuries: None                       │
│  • Allergies: Yes                       │
│    - Peanuts                            │
│  • Fitness Level: Beginner              │
│                                         │
│  [... more sections ...]                │
│                                         │
└─────────────────────────────────────────┘
```

**Missing data shows as:**
- "Not provided" (gray text)
- Encourage user to complete profile

---

### **2. Edit Profile Page** (`/client/profile/edit`)

**Multi-section form:**

```
┌─────────────────────────────────────────┐
│  Edit Profile                           │
│  [Save Changes] [Cancel]                │
├─────────────────────────────────────────┤
│                                         │
│  ▼ Personal Information                 │
│  ────────────────────────────────       │
│  Name:        [John Doe            ]    │
│  Age:         [30]                      │
│  Gender:      [Male ▼]                  │
│  Height:      [6'] [0"]                 │
│  Weight:      [180] lbs                 │
│  Phone:       [(555) 123-4567      ]    │
│  Email:       [john@example.com    ]    │
│                                         │
│  ▼ Emergency Contact                    │
│  ────────────────────────────────       │
│  Name:         [Jane Doe           ]    │
│  Relationship: [Spouse ▼]               │
│  Phone:        [(555) 987-6543     ]    │
│                                         │
│  ▼ Health & Medical                     │
│  ────────────────────────────────       │
│  Do you have any medical conditions?    │
│  ○ Yes  ● No                            │
│  [Description box shows only if Yes]    │
│                                         │
│  Are you taking any medications?        │
│  ● Yes  ○ No                            │
│  ┌──────────────────────────────────┐  │
│  │ Lisinopril 10mg daily            │  │
│  └──────────────────────────────────┘  │
│                                         │
│  [... more fields ...]                  │
│                                         │
│  [Save Changes] [Cancel]                │
│                                         │
└─────────────────────────────────────────┘
```

**Features:**
- Collapsible sections (▼ arrow to expand/collapse)
- Save button at top and bottom
- Cancel button returns to view page
- Loading state during save
- Success message on save
- Validation errors inline

---

### **3. Admin Client View** (`/admin/clients/[id]`)

**Admin sees:**
- Same layout as client profile view
- "[Edit as Admin]" button
- Last updated timestamp
- Profile completion percentage

```
┌─────────────────────────────────────────┐
│  Client Profile: John Doe               │
│  [Edit as Admin] [Back to Clients]      │
│  ────────────────────────────────────   │
│  Profile: 85% Complete                  │
│  Last Updated: 2026-02-08               │
├─────────────────────────────────────────┤
│  [... same sections as client view ...] │
└─────────────────────────────────────────┘
```

---

### **4. Admin Client List** (`/admin/clients`)

**New page - list all clients:**

```
┌─────────────────────────────────────────┐
│  Clients                                │
│  ────────────────────────────────────   │
│  [Search: _________________] [Filter ▼] │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ John Doe                        │   │
│  │ john@example.com • (555) 123... │   │
│  │ Profile: 85% • Joined: Feb 8    │   │
│  │ [View Profile] [Message]        │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Jane Smith                      │   │
│  │ jane@example.com • (555) 456... │   │
│  │ Profile: 60% • Joined: Feb 7    │   │
│  │ [View Profile] [Message]        │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Showing 2 of 2 clients                 │
│                                         │
└─────────────────────────────────────────┘
```

**Features:**
- Search by name or email
- Filter by profile completion
- Sort by name, join date, profile %
- Click to view full profile
- Pagination (when >10 clients)

---

## 🔧 Technical Implementation

### **New API Routes:**

1. **GET `/api/profile`** - Get current user's profile
2. **PUT `/api/profile`** - Update current user's profile
3. **GET `/api/admin/clients`** - Get all clients (admin only)
4. **GET `/api/admin/clients/[id]`** - Get specific client (admin only)
5. **PUT `/api/admin/clients/[id]`** - Update client profile as admin

### **Components to Build:**

```
components/
├── profile/
│   ├── ProfileView.tsx           # Read-only profile display
│   ├── ProfileEditForm.tsx       # Full edit form
│   ├── ConditionalField.tsx      # Yes/No with conditional textarea
│   ├── PersonalInfoSection.tsx   # Personal info fields
│   ├── HealthSection.tsx         # Health & medical
│   ├── FitnessHistorySection.tsx # Fitness history
│   ├── GoalsSection.tsx          # Goals
│   ├── LifestyleSection.tsx      # Lifestyle
│   └── PreferencesSection.tsx    # Preferences
└── admin/
    └── ClientList.tsx            # Admin client list
```

### **Form State Management:**

- React Hook Form for form handling
- Zod for validation (optional fields)
- Controlled components for conditional fields
- Auto-save draft (localStorage, optional)

---

## 📊 Database Migration

**Migration Command:**
```bash
npx prisma migrate dev --name add_client_intake_fields
```

**Changes:**
- Add ~20 new fields to ClientProfile
- All fields nullable (optional)
- No breaking changes (backward compatible)

---

## 🎨 UI/UX Design

### **Conditional Fields:**

**When "No" is selected:**
- Description field is hidden
- Database stores `false` for the boolean

**When "Yes" is selected:**
- Description field slides in below
- Placeholder text guides user
- Required if boolean is `true` (enforce on save)

### **Dropdowns:**

**Gender:**
- Male
- Female
- Prefer not to say (optional)

**Fitness Level:**
- Beginner
- Intermediate
- Advanced

**Activity Level:**
- Sedentary (desk job, no exercise)
- Light Active (light exercise 1-3 days/week)
- Active (moderate exercise 3-5 days/week)
- Very Active (intense exercise 6-7 days/week)

**Emergency Contact Relationship:**
- Spouse
- Parent
- Sibling
- Friend
- Other

### **Input Types:**

- **Text:** Name, goals, descriptions
- **Number:** Age, sessions per month, days per week
- **Height:** Two dropdowns (feet + inches) OR single input
- **Weight:** Number + "lbs" label
- **Phone:** Formatted input (555) 123-4567
- **Email:** Email validation
- **Textarea:** Long descriptions (medical conditions, goals)
- **Radio:** Yes/No questions
- **Checkbox:** Multiple selections (future)

---

## ✅ Success Criteria

**Phase 3 is complete when:**

1. ✅ Client can view their profile
2. ✅ Client can edit all intake form fields
3. ✅ Conditional fields show/hide correctly
4. ✅ Admin can view all clients list
5. ✅ Admin can view any client's profile
6. ✅ Admin can edit any client's profile
7. ✅ All fields save correctly to database
8. ✅ Form validation works (no errors on save)
9. ✅ Mobile responsive (works on phones)
10. ✅ Profile completion percentage shows

---

## 🚧 Not Included in Phase 3

**Saved for Phase 4+:**
- ❌ Profile photo upload
- ❌ Progress photos
- ❌ Measurement tracking over time
- ❌ Admin notes on clients
- ❌ Email notifications on profile update
- ❌ Export profile to PDF

---

## ⏱️ Estimated Timeline

**Day 1: Database & Backend**
- Update Prisma schema
- Run migration
- Create API routes
- Test API endpoints

**Day 2: Client Profile Pages**
- Profile view page
- Profile edit form
- Conditional field logic
- Form validation

**Day 3: Admin Client Management**
- Client list page
- Admin client view
- Admin edit capability
- Search/filter

**Day 4: Polish & Testing**
- Mobile responsive
- Loading states
- Error handling
- Test all flows
- Deploy to Railway

**Total: 3-4 days of development**

---

## 📝 Folder Structure (Clean & Organized)

```
app/
├── (dashboard)/
│   ├── client/
│   │   ├── dashboard/page.tsx
│   │   └── profile/
│   │       ├── page.tsx           # Profile view
│   │       └── edit/page.tsx      # Profile edit
│   └── admin/
│       ├── dashboard/page.tsx
│       └── clients/
│           ├── page.tsx           # Client list
│           └── [id]/
│               ├── page.tsx       # View client
│               └── edit/page.tsx  # Edit client
├── api/
│   ├── profile/
│   │   └── route.ts               # GET/PUT current user profile
│   └── admin/
│       └── clients/
│           ├── route.ts           # GET all clients
│           └── [id]/
│               └── route.ts       # GET/PUT specific client
components/
├── profile/
│   └── [all profile components]
└── admin/
    └── [admin components]
prisma/
└── migrations/
    └── [timestamp]_add_client_intake_fields/
        └── migration.sql
```

---

## 🔄 Version Control Strategy

**Each major change gets its own commit:**

1. `v0.2.0-alpha.1` - Database schema update
2. `v0.2.0-alpha.2` - API routes created
3. `v0.2.0-alpha.3` - Client profile pages
4. `v0.2.0-alpha.4` - Admin client management
5. `v0.2.0` - Phase 3 complete

**Easy to revert:**
```bash
git checkout v0.2.0-alpha.2  # Go back to specific version
git revert <commit-hash>     # Undo specific commit
```

---

## 💰 What This Gets You

After Phase 3:
- ✅ Complete client intake process
- ✅ All health & fitness data captured
- ✅ Admin can manage all clients
- ✅ Professional, organized UI
- ✅ Mobile-friendly forms
- ✅ Conditional fields (smart UX)
- ✅ No required fields (flexible)
- ✅ Easy to expand later

---

## 🤔 Questions for You, Coach

1. **Height format:** Dropdown (6' 0") or single input (72 inches)?
2. **Weight units:** Pounds only, or allow kg?
3. **Profile photo:** Skip for now, or add later?
4. **Admin notes:** Do you want a private notes field for your observations?
5. **Auto-save:** Save drafts as user types, or only on "Save" button?
6. **Sections:** Keep all sections or prioritize some?

---

## ✅ Approval Checklist

Before I start coding:

- [ ] **Schema looks good** (all fields you need)
- [ ] **Conditional logic approved** (Yes/No with description)
- [ ] **All fields optional** (confirmed)
- [ ] **Pages layout makes sense** (view, edit, admin list)
- [ ] **Timeline acceptable** (3-4 days)
- [ ] **Answer the 6 questions above**

---

**Ready to build this, Coach. Approve and answer the questions, and I'll start implementing!** 💪

---

**Proposal by Vlad | Awaiting Approval | 2026-02-08**
