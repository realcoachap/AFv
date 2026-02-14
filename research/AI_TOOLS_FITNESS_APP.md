# AI Tools Research for Fitness RPG App

**Research Date:** February 13, 2025  
**Focus:** AI tools for fitness/business apps with Next.js + Railway + PostgreSQL + WhatsApp integration

---

## 1. FITNESS/HEALTH AI APIs

### Nutrition APIs

#### **Edamam Nutrition API** ⭐ RECOMMENDED
- **Website:** https://developer.edamam.com/
- **Pricing:** Free tier → $999/month for enterprise
- **Key Features:**
  - Natural Language Processing for food input ("1 cup rice", "2 eggs")
  - Real-time nutrition analysis
  - Entity extraction (food, quantity, measure)
  - Recipe analysis with full nutritional breakdown
  - Food database lookup with 900K+ foods
  - Diet and allergy labels
- **Integration:** REST API, easy Node.js integration
- **Use Cases:** Food logging, meal analysis, recipe nutrition calculation

#### **Nutritionix API**
- **Pricing:** Starts at $1,850/month (enterprise-focused)
- **Features:** Large branded food database, natural language processing
- **Best For:** Enterprise apps with large scale requirements

#### **USDA FoodData Central API** (FREE)
- **Website:** https://fdc.nal.usda.gov/
- **Pricing:** Completely free
- **Features:** Government-backed nutritional data, 350K+ foods
- **Trade-offs:** Less polished API, no NLP, requires food ID lookups
- **Best For:** Budget-conscious MVP, accurate base data

### Workout Generation AI

#### **OpenAI GPT-4 / GPT-4o** ⭐ PRIMARY RECOMMENDATION
- **Use Case:** Personalized workout generation
- **Approach:** Few-shot prompting with structured output (JSON)
- **Prompting Strategy:**
  ```
  System: You are an expert fitness coach. Generate structured workout plans.
  Input: User goals, equipment, time constraints, fitness level, injuries
  Output: JSON with exercises, sets, reps, rest periods, progression logic
  ```
- **Cost:** ~$0.03-0.06 per workout generation
- **Libraries:** LangChain.js, Vercel AI SDK

#### **Alternative LLMs:**
- **Claude (Anthropic):** Better at longer context, nuanced coaching advice
- **Llama 4 (Meta):** Open-source, self-hostable via watsonx.ai or Ollama
- **Mistral:** Good balance of cost/performance

### Progress Tracking Automation

**Recommended Architecture:**
```javascript
// PostgreSQL Schema for Progress Tracking
tables:
  - user_workouts (user_id, workout_plan, completed_at, metrics)
  - exercise_logs (workout_id, exercise, weight, reps, rpe)
  - progress_photos (user_id, photo_url, taken_at, ai_analysis)
  - body_metrics (user_id, weight, measurements, recorded_at)
```

**AI Analysis Options:**
- **OpenAI Vision API:** Analyze progress photos for body composition estimates
- **Custom ML Models:** Train on user data for personalized progression recommendations
- **Rule-based AI:** Simple algorithms for progression (increase weight when 3 sets @ RPE < 7)

### Wearable Integrations

#### **Apple HealthKit**
- **Web Limitation:** No direct web API (iOS only)
- **Workaround:** Use HealthKit in React Native app or require iOS Shortcuts integration
- **Alternative:** Apple Health data export via Health Auto Export app

#### **Fitbit Web API**
- **OAuth 2.0** required
- **Data Available:** Steps, heart rate, sleep, activity, workouts
- **Rate Limits:** 150 requests/hour (standard), 3,000/hour (partner)
- **Web:** https://dev.fitbit.com/

#### **Garmin Connect IQ / Health API**
- **Requirements:** Garmin developer account, user consent
- **Data:** Activities, health metrics, sleep, stress
- **Integration:** REST API with OAuth

#### **Google Fit API**
- **Best For:** Android users
- **Unified API:** Aggregates data from multiple sources
- **Integration:** REST API, works well with web apps

---

## 2. GAMIFICATION AI

### Dynamic Quest Generation

#### **AI-Powered Quest System Architecture**
```javascript
// Quest Generation Prompt
const questPrompt = {
  system: `Generate RPG-style fitness quests based on user profile.
  Consider: fitness level, goals, equipment, recent performance, preferences.
  Output valid JSON with quest name, description, objectives, rewards, difficulty.`,
  
  userContext: {
    level: 5,
    class: "Warrior", // RPG class assigned by goals
    recentWorkouts: [...],
    goals: ["strength", "fat_loss"],
    streak: 12
  }
};
```

**Quest Types AI Can Generate:**
- **Daily Quests:** Complete 3 sets of push-ups, Walk 10,000 steps
- **Weekly Quests:** Try a new exercise, Complete 4 workouts
- **Boss Battles:** AMRAP challenges, Time trials
- **Story Quests:** Progressive narratives tied to fitness milestones

### Adaptive Difficulty

**Implementation Strategy:**
1. **Track Metrics:** RPE (Rate of Perceived Exertion), completion rate, progression speed
2. **AI Analysis:** GPT-4 analyzes user patterns
3. **Adjustment Rules:**
   - If 3 workouts completed at RPE < 6 → Increase difficulty
   - If 2 workouts skipped → Reduce intensity, check motivation
   - If plateau for 2 weeks → Program variation

**Libraries:**
- **TensorFlow.js:** Client-side ML for real-time difficulty adjustment
- **Simple Statistics:** For trend analysis without heavy ML

### Personalized Coaching AI

#### **LangChain.js + OpenAI Setup** ⭐ RECOMMENDED
```javascript
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";

const coachPrompt = PromptTemplate.fromTemplate(`
You are {coachPersonality} fitness coach. 
User context: {userHistory}
Recent workouts: {recentWorkouts}
Current motivation: {motivationLevel}

Provide personalized advice and encouragement.
`);
```

**Coach Personalities (AI-Generated):**
- **Drill Sergeant:** High intensity, direct feedback
- **Supportive Friend:** Encouraging, empathetic
- **Scientific:** Data-driven, analytical
- **RPG NPC:** Character-driven responses ("The Blacksmith is impressed with your strength!")

### Achievement Systems

**AI-Generated Achievements:**
```javascript
// Achievement unlocked when...
const achievementRules = {
  generatedByAI: true,
  criteria: "user pattern analysis",
  examples: [
    "First 5 AM Workout",
    "10 Day Protein Streak",
    "Completed All Quests This Week",
    "New Personal Record: Deadlift"
  ]
};
```

**Achievement Categories:**
- **Consistency:** Streak-based
- **Performance:** PRs, volume milestones
- **Exploration:** Try new exercises, workout types
- **Social:** Invite friends, share achievements

---

## 3. CONTENT GENERATION

### Exercise Video Generation

#### **AI Video Generation Options**

**⚠️ CURRENT STATE:**
- **OpenAI Sora:** Not yet publicly available for API use
- **Runway Gen-2/3:** Available, expensive for high volume
- **Pika Labs:** Good for short clips, fitness demos
- **HeyGen:** AI avatar demos of exercises

**RECOMMENDED APPROACH:**
Use existing video libraries + AI overlays:
- **YouTube API:** Search/embed verified exercise videos
- **Pexels/Wistia:** Free exercise video libraries
- **AI Voiceover:** Generate narration with ElevenLabs
- **AI Captions:** Auto-generate form cues with GPT-4

### Workout Plan Creation

**AI-Generated Workout Plans:**
```typescript
interface WorkoutPlan {
  name: string;
  description: string;
  frequency: number; // days per week
  duration: number; // minutes per session
  split: 'full_body' | 'upper_lower' | 'push_pull_legs';
  phases: TrainingPhase[];
}

// Generated by GPT-4 with structured output
```

**Plan Personalization Factors:**
- Experience level (beginner/intermediate/advanced)
- Available equipment
- Time constraints
- Injury history
- Goal (strength, hypertrophy, endurance, fat loss)
- Preferences (exercise types, workout time)

### Nutrition Plan Generation

**AI Nutrition Planning:**
```javascript
const nutritionPrompt = {
  system: "Generate meal plans with specific macros and calories.",
  inputs: {
    calories: 2200,
    protein: 180,
    carbs: 220,
    fat: 73,
    dietaryRestrictions: ["gluten_free"],
    cuisinePreferences: ["mediterranean", "mexican"],
    mealCount: 4
  },
  output: "Daily meal plan with recipes and nutritional breakdown"
};
```

**Integration with Nutrition APIs:**
- Generate meal plan with AI
- Validate nutrition with Edamam API
- Adjust portions to hit macro targets

### Motivational Content

**AI-Generated Motivation:**
- **Dynamic Encouragement:** Based on user's recent performance
- **RPG Flavor:** "Your Strength stat increased! +5 XP"
- **Personalized Quotes:** Reference user's specific journey
- **Voice Notes:** TTS with ElevenLabs for audio motivation

**Content Types:**
- Push notifications
- In-app messages
- WhatsApp/Telegram messages
- Email newsletters
- Social media content

---

## 4. CLIENT MANAGEMENT AI

### Automated Scheduling

#### **Calendly API**
- **Features:** Automated booking, availability management, reminders
- **Integration:** Webhooks for real-time updates
- **Cost:** Free tier available, Pro at $10/user/month

#### **Acuity Scheduling**
- **Better For:** Complex fitness business needs
- **Features:** Class scheduling, package management, intake forms

#### **Custom Scheduling with AI**
```javascript
// AI suggests optimal times based on:
- Client's workout history (when they usually train)
- Trainer availability
- Recovery time from last session
- Client's stated preferences
```

### Client Communication

#### **WhatsApp Business API + Twilio** ⭐ RECOMMENDED

**Setup:**
```javascript
// Twilio + OpenAI Integration
const express = require('express');
const { OpenAI } = require('openai');

app.post('/whatsapp-webhook', async (req, res) => {
  const message = req.body.Body;
  const from = req.body.From;
  
  // Generate AI response
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'You are a supportive fitness coach.' },
      { role: 'user', content: message }
    ]
  });
  
  // Send WhatsApp reply via Twilio
  await twilioClient.messages.create({
    from: 'whatsapp:+14155238886',
    to: from,
    body: completion.choices[0].message.content
  });
});
```

**Use Cases:**
- Workout reminders
- Form check submissions (photo/video + AI analysis)
- Nutrition logging via text
- Progress check-ins
- Motivation/motivational messages

#### **Alternative: WhatsApp Business Cloud API (Meta)**
- Direct integration with Meta
- Lower cost than Twilio for high volume
- Requires business verification

### Progress Reports

**AI-Generated Progress Reports:**
```javascript
// Weekly/Monthly Report Generation
const reportData = {
  workoutsCompleted: 12,
  totalVolume: 45000, // kg lifted
  bodyWeightChange: -1.2, // kg
  consistencyScore: 85,
  prsAchieved: 3
};

// GPT-4 generates personalized summary:
// "This week you crushed it! You completed all 4 scheduled workouts 
// and hit 3 new personal records. Your consistency is paying off!"
```

**Report Formats:**
- PDF generation (with libraries like Puppeteer)
- Interactive web dashboards
- WhatsApp summaries
- Email newsletters

### Retention Prediction

**ML-Based Churn Prediction:**
```javascript
// Features for prediction model:
const churnFeatures = {
  daysSinceLastWorkout: 5,
  workoutsLast30Days: 8,
  responseRateToMessages: 0.3,
  avgRPE: 8.5, // high = potential burnout
  subscriptionTenure: 45, // days
  supportTickets: 2
};

// Model predicts churn risk
// Trigger intervention: Personal message, special offer, check-in call
```

**Implementation Options:**
- **TensorFlow.js:** Build custom model on your data
- **BigQuery ML:** If using Google Cloud
- **Simple Heuristics:** Rule-based scoring (easier MVP)
- **Third-party:** Mixpanel, Amplitude retention analysis

---

## 5. WHATSAPP/TELEGRAM BOT AI

### WhatsApp Bot Architecture

#### **Recommended Stack:**
```
WhatsApp Business API (via Twilio)
    ↓
Node.js/Next.js API Routes
    ↓
LangChain.js + OpenAI GPT-4
    ↓
PostgreSQL (Railway)
```

#### **Key Libraries:**
- **twilio:** Official SDK for WhatsApp API
- **node-telegram-bot-api:** For Telegram bots
- **telegraf:** Modern Telegram bot framework
- **langchain:** For AI conversation management
- **bull/redis:** Message queue for async processing

### AI Chatbot Implementation

#### **Example: Fitness Coach Bot**
```javascript
// Bot conversation flow
const botFlow = {
  '/start': 'Welcome! I\'m your AI fitness coach. What\'s your goal?',
  'log workout': aiProcessWorkout,
  'check progress': generateProgressReport,
  'get motivation': sendMotivationalMessage,
  'default': handleWithOpenAI
};

// AI handler with context
async function handleWithOpenAI(userId, message) {
  const userContext = await getUserHistory(userId);
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: getCoachPrompt(userContext) },
      { role: 'user', content: message }
    ]
  });
  
  return response.choices[0].message.content;
}
```

### Automated Responses

**Response Categories:**
- **FAQ:** Common questions about exercises, nutrition
- **Workout Reminders:** Scheduled motivational messages
- **Progress Celebrations:** Auto-detect achievements, send congratulations
- **Check-ins:** "How was your workout today?"

**Smart Reply System:**
```javascript
// Intent classification with AI
const intents = {
  'log_workout': ['just finished', 'completed', 'did 3 sets'],
  'ask_nutrition': ['how many calories', 'is this healthy', 'protein in'],
  'need_motivation': ['feeling lazy', 'don\'t want to', 'skipping today'],
  'form_check': ['is this right', 'check my form', 'how\'s my technique']
};

// Use embeddings + similarity for intent matching
// Or fine-tuned classifier for better accuracy
```

### Workout Reminders

**Reminder System:**
```javascript
// Scheduled reminders with n8n or node-cron
cron.schedule('0 7 * * *', async () => {
  const users = await getUsersWithWorkoutToday();
  
  for (const user of users) {
    const personalizedMsg = await generateMotivation(user);
    await sendWhatsAppMessage(user.phone, personalizedMsg);
  }
});
```

**Reminder Types:**
- **Pre-workout:** Morning motivation, workout preview
- **Mid-workout:** Rest timer notifications (via app)
- **Post-workout:** Log reminder, celebration
- **Missed workout:** Gentle check-in, reschedule offer

### Telegram Bot Alternative

**Why Telegram:**
- Free API (no per-message costs)
- Rich formatting (Markdown, buttons)
- Larger file uploads for form checks
- Bot commands built-in

**Telegram Bot Features:**
```javascript
// Command handlers
bot.onText(/\/workout/, async (msg) => {
  const plan = await generateTodaysWorkout(msg.from.id);
  bot.sendMessage(msg.chat.id, plan, { parse_mode: 'Markdown' });
});

bot.onText(/\/progress/, async (msg) => {
  const chart = await generateProgressChart(msg.from.id);
  bot.sendPhoto(msg.chat.id, chart);
});
```

---

## INTEGRATION GUIDE: Next.js + Railway + PostgreSQL + WhatsApp

### Recommended Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Next.js App                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Web Client  │  │  API Routes  │  │  AI Features │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────┬────────────────────────────────────────┘
                     │
         ┌───────────┼───────────┐
         ↓           ↓           ↓
    ┌─────────┐ ┌─────────┐ ┌──────────┐
    │Railway  │ │ OpenAI  │ │  Twilio  │
    │Postgres │ │   API   │ │ WhatsApp │
    └─────────┘ └─────────┘ └──────────┘
```

### Database Schema (PostgreSQL)

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) UNIQUE,
  email VARCHAR(255),
  whatsapp_opt_in BOOLEAN DEFAULT false,
  telegram_id VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Fitness Profiles
CREATE TABLE fitness_profiles (
  user_id UUID REFERENCES users(id),
  goals JSONB, -- ['strength', 'fat_loss', 'endurance']
  experience_level VARCHAR(20),
  available_equipment JSONB,
  workout_days INTEGER[], -- [1,3,5] for Mon,Wed,Fri
  rpg_class VARCHAR(50), -- 'Warrior', 'Mage', 'Rogue'
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0
);

-- Workouts
CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  name VARCHAR(255),
  plan JSONB, -- AI-generated workout structure
  scheduled_for DATE,
  completed_at TIMESTAMP,
  rpe INTEGER, -- Rate of Perceived Exertion 1-10
  notes TEXT
);

-- Quests (Gamification)
CREATE TABLE quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title VARCHAR(255),
  description TEXT,
  quest_type VARCHAR(50), -- 'daily', 'weekly', 'boss', 'story'
  requirements JSONB,
  rewards JSONB, -- { xp: 100, achievement_id: '...' }
  status VARCHAR(20) DEFAULT 'active',
  expires_at TIMESTAMP,
  completed_at TIMESTAMP
);

-- Chat History (for AI context)
CREATE TABLE chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  channel VARCHAR(20), -- 'whatsapp', 'telegram', 'in_app'
  role VARCHAR(20), -- 'user', 'assistant'
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Progress Tracking
CREATE TABLE progress_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  metric_type VARCHAR(50), -- 'weight', 'body_fat', 'strength'
  value DECIMAL,
  unit VARCHAR(20),
  recorded_at TIMESTAMP DEFAULT NOW()
);
```

### Environment Variables (.env)

```env
# Database (Railway)
DATABASE_URL=postgresql://user:pass@host:port/db

# OpenAI
OPENAI_API_KEY=sk-...

# Twilio (WhatsApp)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=whatsapp:+14155238886

# Telegram
TELEGRAM_BOT_TOKEN=...

# Nutrition API
EDAMAM_APP_ID=...
EDAMAM_API_KEY=...

# Optional: Other services
FITBIT_CLIENT_ID=...
FITBIT_CLIENT_SECRET=...
```

### Key Dependencies

```json
{
  "dependencies": {
    "next": "^14.x",
    "@langchain/openai": "^0.x",
    "@langchain/core": "^0.x",
    "ai": "^3.x",
    "twilio": "^5.x",
    "telegraf": "^4.x",
    "node-telegram-bot-api": "^0.x",
    "@prisma/client": "^5.x",
    "date-fns": "^3.x",
    "openai": "^4.x"
  }
}
```

---

## COST ESTIMATES

| Service | Usage | Est. Monthly Cost |
|---------|-------|-------------------|
| OpenAI GPT-4 | 10K requests | $20-50 |
| OpenAI GPT-3.5 | Reminders, simple responses | $5-10 |
| Twilio WhatsApp | 1K messages | $5-15 |
| Railway (PostgreSQL) | Standard plan | $5-20 |
| Railway (Hosting) | Starter plan | $5-19 |
| Edamam API | 10K calls | $0 (free tier) |
| **TOTAL** | | **$40-115** |

---

## QUICK START CHECKLIST

- [ ] Set up Next.js project with TypeScript
- [ ] Create Railway PostgreSQL database
- [ ] Set up Prisma ORM
- [ ] Create database schema (users, workouts, quests, chat_history)
- [ ] Integrate OpenAI API with LangChain.js
- [ ] Build workout generation endpoint
- [ ] Set up Twilio WhatsApp sandbox
- [ ] Create webhook endpoint for WhatsApp messages
- [ ] Implement basic AI chatbot flow
- [ ] Add Edamam API for nutrition features
- [ ] Build gamification system (XP, levels, quests)
- [ ] Set up scheduled reminders (n8n or node-cron)
- [ ] Create progress tracking dashboard
- [ ] Test end-to-end flow

---

## ADDITIONAL RESOURCES

- **LangChain.js Docs:** https://js.langchain.com/
- **Vercel AI SDK:** https://sdk.vercel.ai/
- **Twilio WhatsApp Quickstart:** https://www.twilio.com/docs/whatsapp/quickstart
- **Telegram Bot API:** https://core.telegram.org/bots/api
- **Railway Docs:** https://docs.railway.app/
- **Edamam API Docs:** https://developer.edamam.com/edamam-docs-nutrition-api
