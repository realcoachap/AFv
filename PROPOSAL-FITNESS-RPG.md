# Fitness RPG Game - Project Proposal
**Ascending Fitness Client Management System**
**Date:** February 9, 2026
**Prepared for:** Coach (Ascending Fitness)
**Prepared by:** Vlad (AI Development Assistant)

---

## Executive Summary

This proposal outlines a gamified fitness tracking system inspired by Liftoff and RPG mechanics to increase client engagement, motivation, and retention for Ascending Fitness. The system transforms workout completion into an immersive game experience where clients level up their character, complete quests, earn rewards, and compete on leaderboards.

**Goal:** Create a separate "RPG" tab in the client dashboard that makes fitness fun, addictive, and social while driving accountability and consistent training session attendance.

---

## Research Findings: Liftoff App Analysis

### What is Liftoff?

Liftoff is a **ranked workout tracker** with over 1 million users (4.8/5 stars, 60K ratings) that gamifies strength training through:

#### Core Features:
1. **Ranking System**
   - 400+ exercises ranked by performance vs other users
   - Tier-based ranks: Bronze → Silver → Gold → Platinum → Diamond
   - Real-time feedback: "You're in the top 15% for bench press"

2. **Gamification Elements**
   - **Streaks:** Daily/weekly workout consistency tracking
   - **Quests:** Daily and weekly challenges (e.g., "Complete 3 leg workouts this week")
   - **Rewards Shop:** Earn currency ("eggs") through workouts to unlock cosmetics, gear, workout plans
   - **Leaderboards:** Global + friend-based competition

3. **Social Features**
   - Follow friends and community members
   - Share achievements and PRs
   - Community challenges
   - Invite & earn rewards system

4. **Tracking & Progress**
   - Exercise logger (sets/reps/weight)
   - Progress visualization (charts, body graphs)
   - Custom exercises
   - Workout templates/presets

5. **Engagement Hooks**
   - Daily deals in shop
   - Visual progression (character/avatar customization)
   - Achievement system
   - Motivational notifications

---

## Research Findings: RPG Fitness Mechanics

### What Makes Fitness RPGs Work?

Based on analysis of successful fitness RPGs (Infitnite, Flexion, LevelUP Fitness, Exantra World):

#### 1. **Character Progression System**
- **Real-life workouts = In-game XP**
- Character stats mirror fitness attributes:
  - **Strength** (lifting volume)
  - **Endurance** (cardio/duration)
  - **Agility** (flexibility/mobility work)
  - **Discipline** (consistency streaks)
  - **Power Level** (overall fitness score)
- **Leveling up unlocks abilities, gear, and features**

#### 2. **Quest System**
- **Daily Quests:** Small, achievable goals (e.g., "Complete a session today")
- **Weekly Quests:** Bigger challenges (e.g., "Train 3 times this week")
- **Epic Quests:** Long-term goals (e.g., "Lose 10 lbs in 8 weeks")
- **Personal Bests:** Quest triggers for PRs (new max weight, fastest mile)

#### 3. **Reward Economy**
- **Currency earned through:**
  - Completing workouts
  - Finishing quests
  - Maintaining streaks
  - Hitting milestones
- **Currency spent on:**
  - Character cosmetics (outfits, accessories)
  - Workout plan unlocks
  - Premium features
  - Real-world rewards (protein samples, gym merch, session discounts)

#### 4. **Social Competition**
- **Leaderboards:** Gym-wide rankings (monthly resets)
- **Guilds/Teams:** Compete with other LA Fitness branches or private clients
- **Battle System:** 1v1 workout challenges
- **Achievements:** Badges displayed on profile

#### 5. **Visual Progression**
- **Avatar/Character:** Visual representation that improves with stats
- **Equipment/Gear:** Better performance = cooler gear
- **Skill Trees:** Unlock specialized abilities (Strength Build, Endurance Build, Hybrid)

---

## Proposed Feature Set: "Ascending Fitness RPG"

### Phase 1: Core RPG System (MVP)

#### 1. **Character Dashboard**
**What clients see when they open the RPG tab:**

```
┌─────────────────────────────────────────────┐
│  [Avatar Image]      Level 12 Warrior       │
│                                             │
│  ████████████░░░░ 450/600 XP to Level 13   │
│                                             │
│  💪 Strength: 45      🏃 Endurance: 32      │
│  🎯 Discipline: 78    ⚡ Power: 195         │
│                                             │
│  🔥 Streak: 14 days   🏆 Rank: #8/150      │
└─────────────────────────────────────────────┘
```

**Key Elements:**
- **Avatar:** Custom character (choose body type, outfit colors, accessories)
- **Level:** Based on total XP earned
- **XP Bar:** Visual progress to next level
- **Stats:** 4 core attributes that grow with workout types
- **Streak Counter:** Days with completed sessions
- **Leaderboard Rank:** Position among all clients

---

#### 2. **XP & Leveling System**

**How XP is Earned:**

| Activity | XP Reward |
|----------|-----------|
| Complete scheduled session | 100 XP |
| Complete unscheduled workout | 75 XP |
| Hit a new PR | +50 XP bonus |
| Complete daily quest | 50 XP |
| Complete weekly quest | 200 XP |
| Maintain 7-day streak | 150 XP bonus |
| Maintain 30-day streak | 1000 XP bonus |
| Refer a friend who signs up | 500 XP |

**Level Curve:**
- Level 1-5: 100 XP per level (beginner zone)
- Level 6-10: 200 XP per level
- Level 11-20: 400 XP per level
- Level 21+: 600 XP per level

**Level Unlocks:**
- **Level 5:** Unlock custom avatar accessories
- **Level 10:** Unlock "Battle Mode" (challenge other clients)
- **Level 15:** Unlock legendary gear cosmetics
- **Level 20:** Unlock "Elite Trainer" title + badge
- **Level 25:** Unlock ability to create custom quests

---

#### 3. **Quest System**

**Daily Quests (refresh every day):**
- ✅ "Complete a training session" → 50 XP + 10 coins
- ✅ "Log your weight/measurements" → 25 XP + 5 coins
- ✅ "Check in with Coach via WhatsApp" → 25 XP + 5 coins

**Weekly Quests (refresh Monday):**
- 🎯 "Complete 3 sessions this week" → 200 XP + 50 coins
- 🎯 "Hit a new PR on any exercise" → 150 XP + 30 coins
- 🎯 "Maintain workout streak all week" → 250 XP + 75 coins

**Monthly Epic Quests:**
- 🏆 "Complete 12+ sessions this month" → 1000 XP + 500 coins + exclusive badge
- 🏆 "Lose 5+ lbs this month" → 800 XP + 300 coins + "Fat Slayer" title
- 🏆 "Refer 2 new clients" → 1500 XP + 1000 coins + "Recruiter" badge

**Personal Quests (Coach-assigned):**
- Coach can create custom quests for individual clients
- Example: "Squat 225 lbs for 5 reps" → Custom XP/coins + badge

---

#### 4. **Currency & Shop System**

**Currency: "AF Coins"** 🪙
- Earned through quests, sessions, streaks
- Spent in the RPG Shop

**Shop Categories:**

**A. Avatar Customization**
- Outfits (50-200 coins)
- Accessories (hats, headbands, wristbands) (25-100 coins)
- Color schemes/skins (50 coins)
- Legendary cosmetics (500+ coins, level-gated)

**B. Gameplay Boosts**
- "2x XP Weekend Pass" (100 coins)
- "Streak Freeze" (save streak if you miss 1 day) (150 coins)
- "Quest Refresh Token" (reroll daily quest) (50 coins)

**C. Real-World Rewards**
- "Free session with Coach" (1000 coins)
- "10% off next month membership" (500 coins)
- "Ascending Fitness t-shirt" (750 coins)
- "1lb protein sample" (200 coins)
- "Personalized meal plan" (800 coins)

**D. Workout Plans (optional unlock)**
- "Arms Blaster Program" (300 coins)
- "6-Week Shred" (500 coins)
- "Powerlifting 101" (400 coins)

---

#### 5. **Leaderboard System**

**Multiple leaderboard types:**

**A. Global Leaderboard (All Clients)**
- Ranked by total XP this month
- Top 10 displayed prominently
- Monthly resets (keeps it competitive)
- Winner gets "Champion" badge + bonus coins

**B. Streak Leaderboard**
- Ranked by current streak length
- Encourages consistency

**C. Level Leaderboard**
- Ranked by character level
- Long-term progression

**D. Class-Specific Leaderboards (future)**
- "Warriors" (strength-focused)
- "Runners" (cardio-focused)
- "Balanced" (hybrid)

**Display Format:**
```
🏆 Monthly XP Leaderboard
1. 👑 Sarah M.     Level 18    3,450 XP
2. 🥈 James T.     Level 15    3,200 XP
3. 🥉 Maria G.     Level 16    3,100 XP
4. Alex P.         Level 12    2,800 XP
5. YOU             Level 12    2,650 XP
...
```

---

#### 6. **Stat System**

**4 Core Stats (grow based on workout types):**

**💪 Strength**
- Increases: Lifting heavy weight, resistance training, PRs
- Visual: Bigger/more defined avatar arms/chest
- Perks: Unlock strength-based achievements

**🏃 Endurance**
- Increases: Cardio sessions, long workouts, timed circuits
- Visual: Leaner avatar physique
- Perks: Unlock endurance challenges

**🎯 Discipline**
- Increases: Maintaining streaks, logging workouts, completing quests
- Visual: Avatar glow effect, "aura"
- Perks: Bonus coin multipliers, streak protection

**⚡ Power Level**
- Combined score: (Strength + Endurance + Discipline) / 3
- Overall fitness indicator
- Displayed on leaderboards and profile

**Stat Growth:**
- +1 Strength per resistance training session
- +1 Endurance per cardio session
- +2 Discipline per 7-day streak maintained
- Stats cap at 100 (endgame mastery)

---

#### 7. **Achievement/Badge System**

**Categories:**

**Milestones:**
- "First Steps" (complete 1st session)
- "Warrior" (reach Level 10)
- "Legend" (reach Level 25)
- "Century Club" (100 total sessions)

**Streaks:**
- "On Fire" (7-day streak)
- "Unstoppable" (30-day streak)
- "Iron Will" (90-day streak)

**Strength:**
- "Bench Press Hero" (bench 1.5x bodyweight)
- "Squat King/Queen" (squat 2x bodyweight)
- "Deadlift Demon" (deadlift 2.5x bodyweight)

**Social:**
- "Recruiter" (refer 3 clients)
- "Community Leader" (top 3 on leaderboard)
- "Helpful Hand" (encourage 10 clients)

**Special:**
- "Early Bird" (complete 10 morning sessions)
- "Night Owl" (complete 10 evening sessions)
- "Comeback Kid" (return after 30-day break)

Badges displayed on profile + unlocked in achievements gallery.

---

### Phase 2: Advanced Features (Post-MVP)

#### 8. **Battle Mode** 🥊
- Challenge another client to a "workout duel"
- Both complete a specific workout (e.g., "20 burpees, fastest time")
- Winner gets bonus XP + bragging rights
- Async battles (don't need to be online at same time)

#### 9. **Guilds/Teams**
- Create or join teams (e.g., "Morning Warriors", "LA Fitness Squad")
- Team leaderboards
- Shared team quests
- Guild vs Guild challenges

#### 10. **Skill Trees** 🌳
- At Level 10, choose a specialization:
  - **Warrior Path** (strength-focused perks)
  - **Runner Path** (endurance-focused perks)
  - **Monk Path** (discipline/consistency perks)
- Unlock unique abilities and cosmetics per path

#### 11. **Boss Battles**
- Monthly event: entire gym fights a "boss"
- Boss = cumulative goal (e.g., "Complete 500 total sessions this month")
- Everyone contributes, everyone wins rewards if defeated
- Fosters community cooperation

#### 12. **Seasonal Events**
- Limited-time quests and cosmetics
- "Summer Shred Challenge" (June-August)
- "New Year, New You" (January)
- Holiday-themed gear

#### 13. **AR/Photo Integration** (advanced)
- Take progress photos → avatar updates to match physique
- AI-powered body composition tracking
- Visual transformation timeline

---

## Technical Implementation Plan

### Database Schema Additions

**New Tables:**

```sql
-- RPG character data
CREATE TABLE rpg_characters (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  level INT DEFAULT 1,
  xp INT DEFAULT 0,
  coins INT DEFAULT 0,
  strength INT DEFAULT 0,
  endurance INT DEFAULT 0,
  discipline INT DEFAULT 0,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  avatar_config JSONB, -- stores customization choices
  class VARCHAR(50) DEFAULT 'beginner',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Quest tracking
CREATE TABLE rpg_quests (
  id UUID PRIMARY KEY,
  type VARCHAR(50), -- 'daily', 'weekly', 'monthly', 'personal'
  name VARCHAR(200),
  description TEXT,
  xp_reward INT,
  coin_reward INT,
  requirements JSONB, -- flexible quest conditions
  active BOOLEAN DEFAULT true,
  repeatable BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User quest progress
CREATE TABLE rpg_user_quests (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  quest_id UUID REFERENCES rpg_quests(id),
  progress JSONB, -- tracks completion state
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Achievements/Badges
CREATE TABLE rpg_achievements (
  id UUID PRIMARY KEY,
  name VARCHAR(200),
  description TEXT,
  badge_icon VARCHAR(255), -- image path
  category VARCHAR(50),
  unlock_criteria JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User achievements
CREATE TABLE rpg_user_achievements (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  achievement_id UUID REFERENCES rpg_achievements(id),
  unlocked_at TIMESTAMP DEFAULT NOW()
);

-- Shop items
CREATE TABLE rpg_shop_items (
  id UUID PRIMARY KEY,
  name VARCHAR(200),
  description TEXT,
  category VARCHAR(50), -- 'cosmetic', 'boost', 'reward'
  cost_coins INT,
  level_requirement INT DEFAULT 1,
  image VARCHAR(255),
  metadata JSONB, -- item-specific data
  active BOOLEAN DEFAULT true
);

-- User inventory
CREATE TABLE rpg_user_inventory (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  item_id UUID REFERENCES rpg_shop_items(id),
  equipped BOOLEAN DEFAULT false,
  purchased_at TIMESTAMP DEFAULT NOW()
);

-- Leaderboard (computed view)
CREATE VIEW rpg_leaderboard AS
SELECT 
  u.id,
  u.name,
  rc.level,
  rc.xp,
  rc.current_streak,
  (rc.strength + rc.endurance + rc.discipline) AS power_level,
  RANK() OVER (ORDER BY rc.xp DESC) as rank
FROM users u
JOIN rpg_characters rc ON u.id = rc.user_id
WHERE u.role = 'CLIENT';

-- XP transaction log (for transparency/debugging)
CREATE TABLE rpg_xp_transactions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  amount INT,
  source VARCHAR(100), -- 'session_complete', 'quest_complete', etc.
  reference_id UUID, -- id of session/quest/etc
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

### Integration Points

**1. Session Completion Hook**
When a client marks a session as complete (or admin confirms):
```typescript
async function onSessionComplete(sessionId: string, userId: string) {
  // Award XP
  await grantXP(userId, 100, 'session_complete', sessionId)
  
  // Update stats based on session type
  const session = await getSession(sessionId)
  if (session.type === 'strength') {
    await incrementStat(userId, 'strength', 1)
  } else if (session.type === 'cardio') {
    await incrementStat(userId, 'endurance', 1)
  }
  
  // Update streak
  await updateStreak(userId)
  
  // Check quest progress
  await checkQuestProgress(userId, 'session_complete')
  
  // Check for level up
  await checkLevelUp(userId)
  
  // Check for achievements
  await checkAchievements(userId)
}
```

**2. Daily Cron Job**
- Reset daily quests at midnight
- Award streak bonuses
- Send "quest available" notifications

**3. Weekly Cron Job**
- Reset weekly quests on Monday
- Calculate weekly leaderboard winners
- Award top 10 bonus coins

**4. Monthly Cron Job**
- Reset monthly leaderboard
- Crown champion
- Archive stats for historical tracking
- Reset epic quests

---

### Frontend Components

**New Routes:**
- `/client/rpg` - Main RPG dashboard
- `/client/rpg/character` - Character customization
- `/client/rpg/quests` - Quest log
- `/client/rpg/shop` - Item shop
- `/client/rpg/leaderboard` - Rankings
- `/client/rpg/achievements` - Badge gallery
- `/admin/rpg` - Admin RPG management (create quests, award bonuses, etc.)

**Key Components:**
- `CharacterCard.tsx` - Displays avatar, level, stats, XP bar
- `QuestList.tsx` - Active quests with progress bars
- `Leaderboard.tsx` - Ranked list with avatars
- `ShopGrid.tsx` - Item catalog with purchase modal
- `AchievementGallery.tsx` - Badge showcase (locked/unlocked states)
- `XPNotification.tsx` - Toast notification when XP is earned
- `LevelUpModal.tsx` - Celebration modal on level up

---

### Avatar System

**Simple approach (Phase 1):**
- Predefined avatar templates (male/female body types)
- Color picker for outfit
- Accessory slots (head, wrist, feet)
- SVG-based (scalable, lightweight)

**Advanced approach (Phase 2):**
- AI-generated avatars from progress photos
- Customizable body proportions based on stats
- 3D models (Three.js integration)

**Recommendation:** Start with simple SVG avatars, upgrade later.

---

## User Experience Flow

**Client logs in → Opens RPG tab:**

1. **Dashboard loads:**
   - See character + current level
   - XP bar shows progress
   - Streak counter (motivates daily check-ins)
   - Active quests (3 daily, 2 weekly visible)
   - Leaderboard snippet (your rank + top 3)

2. **After completing a session:**
   - XP notification pops up: "+100 XP! 🎉"
   - Quest progress updates: "Daily: Complete a session ✅"
   - Stat increases: "+1 Strength 💪"
   - Streak updates: "14-day streak! 🔥"

3. **Level up!**
   - Full-screen modal: "LEVEL UP! You're now Level 13!"
   - Show new stats
   - Show coins earned (50 per level)
   - Show unlocks (e.g., "New cosmetics available in shop!")

4. **Quest completion:**
   - Toast notification: "Quest Complete! +200 XP, +50 coins"
   - Quest removed from active list
   - New quest auto-fills slot

5. **Shop visit:**
   - Browse items by category
   - Preview cosmetics on avatar
   - Purchase with coins
   - Equip immediately

6. **Leaderboard check:**
   - See ranking: "#12/150"
   - See how much XP needed to climb: "250 XP to reach #11"
   - Motivates next session

---

## Why This Will Work

### Psychological Hooks

1. **Progress Visibility**
   - XP bar gives instant feedback
   - Levels provide long-term milestones
   - Stats show tangible improvement

2. **Variable Rewards**
   - Not just "do workout, get XP" - also PRs, streaks, quests
   - Randomized daily quests keep it fresh
   - Surprise bonuses (e.g., double XP weekends)

3. **Social Proof**
   - Leaderboard creates healthy competition
   - Badges show status
   - Public profile displays achievements

4. **Loss Aversion**
   - Streaks make clients afraid to miss days
   - Leaderboard rank can drop if inactive
   - Limited-time items create FOMO

5. **Autonomy & Mastery**
   - Clients choose quests to pursue
   - Character customization = self-expression
   - Specialization paths (Warrior/Runner/Monk) = strategic choice

6. **Endowed Progress Effect**
   - Start clients at Level 1 with 50 XP (not 0) - feels like progress already made
   - First quest is always easy - instant win

---

## Business Benefits for Ascending Fitness

### 1. **Increased Client Retention**
- Gamification proven to increase engagement by 30-50%
- Streaks incentivize consistent training
- Investment in character makes clients less likely to quit

### 2. **Higher Session Attendance**
- Quests drive session bookings
- Clients want XP → book more sessions
- Reduces no-shows (quest failure)

### 3. **Referral Engine**
- "Refer a friend" quests = built-in referral system
- Leaderboard bragging rights encourage social sharing
- Viral potential (clients share level-ups on social media)

### 4. **Data Goldmine**
- Track which quests drive most engagement
- See which clients are at-risk (low XP, broken streaks)
- Identify top performers for testimonials

### 5. **Premium Upsell Opportunities**
- Sell coin packs (real money → AF Coins)
- Offer "RPG Premium" subscription (2x XP, exclusive cosmetics)
- Partner with supplement brands (branded items in shop)

### 6. **Community Building**
- Leaderboards foster gym culture
- Guilds create sub-communities
- Challenges bring clients together

### 7. **Competitive Differentiation**
- No other local personal trainers have this
- "Gamified fitness" is a strong marketing angle
- Appeals to millennials/Gen Z

---

## Implementation Timeline

### Phase 1: MVP (4-6 weeks)
**Week 1-2: Backend**
- Database schema
- XP/leveling logic
- Session integration hooks

**Week 3-4: Frontend**
- Character dashboard
- Quest system
- Leaderboard

**Week 5: Integration & Testing**
- Connect to existing session system
- Seed initial quests
- Internal testing

**Week 6: Soft Launch**
- Beta with 5-10 clients
- Gather feedback
- Fix bugs

### Phase 2: Enhanced Features (4-8 weeks post-launch)
- Shop system
- Avatar customization
- Achievement badges
- Admin quest creation tools

### Phase 3: Advanced (8-12 weeks post-launch)
- Battle mode
- Guilds
- Skill trees
- Seasonal events

---

## Open Questions for Coach

1. **Branding & Theme:**
   - Should avatars be realistic or stylized (anime, pixelated, etc.)?
   - What's the vibe? (Dark/gritty RPG vs bright/fun?)
   - Any specific theme? (Medieval fantasy, sci-fi, modern gym?)

2. **Rewards:**
   - What real-world rewards can we offer in the shop?
   - Budget for prizes? (or just cosmetic items?)
   - Discounts on sessions as rewards?

3. **Competition Level:**
   - Do you want aggressive competition (public callouts) or supportive (private rankings)?
   - Should clients be able to challenge each other directly?

4. **Integration:**
   - Should RPG stats pull from client profile data (current weight, PRs)?
   - Link to WhatsApp for quest reminders?

5. **Monetization:**
   - Free for all clients, or premium feature?
   - Sell coin packs? ($5 for 500 coins, etc.)
   - RPG Premium tier? ($10/month for 2x XP, exclusive items)

6. **Admin Control:**
   - How much control do you want over quests/rewards?
   - Auto-generated daily quests vs manually curated?
   - Ability to award bonus XP manually for exceptional clients?

---

## Next Steps

1. **Review this proposal** - thoughts, questions, changes?
2. **Decide on theme/branding** - I can mock up avatar designs
3. **Prioritize features** - which Phase 1 features are must-haves?
4. **Green light to start** - database design + first prototype

Once approved, I can start building Phase 1 MVP immediately. First milestone: working XP system with session integration (1 week).

---

## Inspiration & References

**Apps Analyzed:**
- Liftoff (ranked workouts, streaks, quests, shop)
- Infitnite (fantasy RPG fitness)
- LevelUP Fitness (anime-inspired)
- Flexion (stat-based progression)
- Nike Training Club (achievement system)

**Key Insight:**
The most successful fitness games combine:
1. **Instant gratification** (XP per session)
2. **Long-term goals** (levels, achievements)
3. **Social dynamics** (leaderboards, guilds)
4. **Autonomy** (customization, choices)

**Your Advantage:**
You're a real trainer with real clients. Unlike generic apps, you can:
- Create personalized quests
- Award bonus XP for effort/attitude
- Host in-person "boss battles" (group challenges)
- Integrate real-world gym culture into the game

---

**Let's make fitness addictive. 🎮💪**

Coach, what do you think? Ready to turn Ascending Fitness into an RPG?
