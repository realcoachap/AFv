# Comprehensive AI Tools Research Report

*Research Date: February 13, 2026*

---

## 1. AI WEB/APP DEVELOPMENT TOOLS

---

### V0.dev by Vercel
**Website:** https://v0.app

**What it does:**
V0 is Vercel's AI assistant for frontend scaffolding and UI generation. Users describe layouts in natural language (e.g., "marketing hero with navbar, CTA, and pricing grid") or upload mockups, then refine via chat to get React components/pages styled with Tailwind CSS and shadcn/ui. It generates production-ready React/Next.js code with built-in design mode for visual editing.

**Key Features:**
- AI-generated React components from text descriptions or mockups
- Visual editing with Design Mode
- GitHub sync integration
- Figma import capability
- Full-stack app workflow support

**Pricing:**
| Plan | Price | Features |
|------|-------|----------|
| Free | $0/month | $5 monthly credits, 7 messages/day, deploy to Vercel, GitHub sync |
| Premium | $20/month | $20 monthly credits + $2 daily free credits, 5x attachment size, Figma import |
| Team | $30/user/month | $30/user credits + $2 daily credits, shared team billing, collaborative chats |
| Business | $100/user/month | Same as Team + training opt-out by default |
| Enterprise | Custom | SAML SSO, RBAC, priority access, guaranteed SLAs |

**Model Pricing (per 1M tokens):**
- v0 Mini: Input $1, Output $5 (fastest)
- v0 Pro: Input $3, Output $15 (balanced)
- v0 Max: Input $5, Output $25 (maximum intelligence)
- Opus 4.6 Fast: Input $15, Output $75 (2.5x faster)

**Integration Potential:** Excellent - Native Vercel integration, GitHub sync, Figma import, works with any React/Next.js project

**Best Use Cases:**
- Rapid prototyping of React UIs
- Converting designs to code
- Marketing landing pages
- SaaS dashboard interfaces
- Teams already using Vercel/Next.js

---

### Bolt.new
**Website:** https://bolt.new

**What it does:**
AI full-stack app builder that creates stunning apps and websites through chat. Integrates frontier coding agents from AI labs into one visual interface. Handles projects 1,000x larger than previous tools with built-in context management.

**Key Features:**
- Full-stack app generation from prompts
- Built-in cloud hosting with custom domains
- Unlimited databases included
- User management & authentication
- SEO optimization built-in
- 98% fewer errors through auto-testing and refactoring
- Enterprise-grade backend infrastructure

**Pricing:**
- Free tier available for testing
- Paid plans available (specific pricing requires login)
- Enterprise options for teams

**Integration Potential:** High - Built-in deployment, database, and auth. Works as standalone platform or export code

**Best Use Cases:**
- Entrepreneurs launching MVPs quickly
- Product managers creating prototypes
- Marketing teams building campaign pages
- Agencies delivering client projects faster
- Students learning full-stack development

---

### Lovable
**Website:** https://lovable.dev

**What it does:**
AI product builder for creating apps and websites with natural language. "No Code App Builder" that uses AI to generate functional applications from descriptions.

**Key Features:**
- Natural language to app generation
- No-code interface
- Fast deployment

**Pricing:**
- Free tier available
- Paid plans for additional features (specific pricing requires login)

**Integration Potential:** Medium - Primarily standalone no-code platform

**Best Use Cases:**
- Non-technical founders building MVPs
- Rapid prototyping without coding
- Simple web applications

---

### Replit Agent
**Website:** https://replit.com

**What it does:**
AI coding assistant integrated into Replit's cloud development environment. Goes from 0 to production apps at "breakneck speed." Can clone complex applications like LinkedIn from a single prompt.

**Key Features:**
- AI-assisted coding in the cloud
- Built-in deployment and hosting
- Collaborative coding environment
- Multi-language support
- Instant prototyping

**Pricing:**
- Free tier available
- Replit Core: $7/month (enhanced AI features)
- Teams and Enterprise plans available

**Integration Potential:** High - Full cloud IDE with deployment, GitHub integration, multiplayer coding

**Best Use Cases:**
- Educational coding environments
- Rapid prototyping
- Collaborative development
- Learning new programming languages
- Interview coding challenges

---

### Cursor
**Website:** https://cursor.com

**What it does:**
AI-first code editor (fork of VS Code) with built-in agents for coding. Used by over half of Fortune 500 companies. Features Tab completion, Cmd+K for targeted edits, and full autonomy agentic coding.

**Key Features:**
- Tab completion for code
- Agent mode for autonomous coding
- BugBot for code review
- Cloud Agents for remote execution
- Support for all major AI models (OpenAI, Anthropic, Gemini, xAI, Cursor)
- Multi-file editing

**Pricing:**
| Plan | Price | Features |
|------|-------|----------|
| Hobby | Free | Limited Agent requests, limited Tab completions |
| Pro | $20/month | Extended Agent limits, unlimited Tab, Cloud Agents, max context |
| Pro+ | $60/month | 3x usage on all models |
| Ultra | $200/month | 20x usage on all models, priority features |
| Teams | $40/user/month | Shared chats, billing, analytics, SSO, RBAC |
| Enterprise | Custom | Pooled usage, SCIM, audit logs, priority support |

**Integration Potential:** Excellent - Native VS Code extension support, works with existing codebases, Git integration

**Best Use Cases:**
- Professional software development
- Large codebase refactoring
- Code review automation
- Teams wanting AI-assisted coding
- Developers who want to stay in their editor

---

### Windsurf (by Codeium)
**Website:** https://windsurf.com/editor

**What it does:**
AI-native editor with Cascade AI assistant. Features live previews where you can click elements and have Cascade reshape them instantly. Built from the ground up to understand software development.

**Key Features:**
- Cascade AI assistant
- Live previews with click-to-edit
- Linter integration with auto-fix
- Model Context Protocol (MCP) support
- Tab to Jump navigation
- Supercomplete for predicting next actions
- Terminal command generation
- 70M+ lines of AI-written code committed to production

**Pricing:**
| Plan | Price | Features |
|------|-------|----------|
| Free | $0/month | Unlimited Cascade |
| Pro | $15/month | 500 credits/month, premium models, Fast Context, SWE-1.5 |
| Teams | $30/user/month | 500 credits/user, admin dashboard, priority support |
| Enterprise | Custom | 1,000+ credits/user, SSO, RBAC, account management |

**Integration Potential:** High - Works with existing projects, supports all major models, API available

**Best Use Cases:**
- Developers wanting AI-native experience
- Web development with live preview
- Full-stack application building
- Teams needing collaborative AI coding

---

### Claude Code
**What it does:**
Anthropic's coding assistant that integrates with development workflows. Provides intelligent code completion, explanation, and generation with strong reasoning capabilities.

**Key Features:**
- Code explanation and documentation
- Refactoring assistance
- Test generation
- Bug fixing
- Natural language code queries

**Pricing:**
- Available through Claude Pro subscription: $20/month
- API access priced per token

**Integration Potential:** High - Available as IDE extensions, CLI tool, and API

**Best Use Cases:**
- Complex reasoning tasks
- Code review and explanation
- Refactoring large codebases
- Teams wanting careful, thoughtful AI assistance

---

### OpenAI Codex
**Website:** https://openai.com/codex/

**What it does:**
OpenAI's dedicated AI coding partner designed for real engineering work. Handles tasks end-to-end from routine PRs to complex refactors, migrations, and feature building.

**Key Features:**
- Multi-agent workflow support
- Built-in worktrees and cloud environments
- Skills system for custom capabilities
- Automations for background work (CI/CD, issue triage)
- Code understanding and documentation
- Available in Codex app, editor extensions, and CLI

**Pricing:**
- Free tier available
- ChatGPT Plus/Pro subscribers get 2x rate limits
- Usage-based pricing for heavy users

**Integration Potential:** Excellent - Multiple interfaces (app, IDE, terminal), OpenAI ecosystem integration

**Best Use Cases:**
- End-to-end feature development
- Large-scale refactoring
- Automated code review
- CI/CD automation
- Enterprise development teams

---

### Vercel AI SDK
**Website:** https://sdk.vercel.ai

**What it does:**
Open-source SDK for building AI-powered streaming text and chat UIs in React and Vue. Provides abstractions for streaming, tool execution, multi-turn conversations, and error handling.

**Key Features:**
- Streaming text/chat UIs
- Tool calling and execution
- Multi-turn conversation handling
- Error handling and recovery
- Framework agnostic (React, Vue, Svelte, etc.)
- Edge-ready

**Pricing:**
- Open source (free)
- Vercel deployment costs apply

**Integration Potential:** Excellent - Framework-agnostic, works with any LLM provider, production-ready

**Best Use Cases:**
- Building AI chat interfaces
- Streaming text applications
- Tools with LLM integration
- Production AI applications
- Developers wanting full control over AI UX

---

## 2. AI GRAPHIC DESIGN TOOLS

---

### Midjourney
**Website:** https://www.midjourney.com

**What it does:**
Leading AI image generation model known for artistic quality and aesthetic outputs. Creates highly detailed, visually stunning images from text prompts.

**Key Features:**
- Text-to-image generation
- Style variations and upscaling
- Image blending and remixing
- Discord-based interface
- Strong artistic interpretation

**Pricing:**
| Plan | Price | Features |
|------|-------|----------|
| Basic | $10/month | 200 GPU minutes (~200 images) |
| Standard | $30/month | 15 GPU hours, unlimited relax mode |
| Pro | $60/month | 30 GPU hours, stealth mode |
| Mega | $120/month | 60 GPU hours, maximum priority |

**Integration Potential:** Medium - Primarily Discord-based, API available for enterprise

**Best Use Cases:**
- Concept art and illustration
- Marketing visuals
- Album/book cover art
- Mood boards and inspiration
- Artistic exploration

---

### DALL-E 3
**Website:** https://openai.com/dall-e-3

**What it does:**
OpenAI's text-to-image model with superior prompt adherence. Generates images that exactly match provided text descriptions without requiring prompt engineering.

**Key Features:**
- Exceptional text understanding
- Integrated with ChatGPT
- Native text rendering in images
- Safety filters for harmful content
- Full commercial usage rights

**Pricing:**
- Included with ChatGPT Plus ($20/month)
- API: ~$0.04-0.08 per image depending on quality/size

**Integration Potential:** High - API available, ChatGPT integration, Microsoft Copilot integration

**Best Use Cases:**
- Marketing materials with text
- Educational content
- Business presentations
- Content creation at scale
- When precise prompt adherence matters

---

### Stable Diffusion XL (SDXL)
**Website:** https://stability.ai/stable-image

**What it does:**
Open-source text-to-image model with 3.5 billion parameters. Now succeeded by Stable Diffusion 3.5 which offers superior quality and prompt adherence. Available in multiple variants (Large, Turbo, Medium).

**Key Features:**
- High-resolution image generation (1MP)
- Multiple style support (3D, photography, painting, line art)
- Self-hostable
- API access
- Editing tools (inpainting, outpainting)
- Image upscaling

**Pricing:**
- Free for self-hosted
- Stability AI API: Pay-per-use
- Stable Assistant web app: Subscription-based

**Integration Potential:** Excellent - Open source, multiple deployment options (self-hosted, API, cloud partners)

**Best Use Cases:**
- Custom AI image pipelines
- High-volume generation
- Privacy-sensitive applications
- Fine-tuning for specific styles
- Commercial applications

---

### Canva AI (Magic Design, Text to Image)
**Website:** https://www.canva.com

**What it does:**
Design platform with integrated AI tools including Magic Design (auto-generates designs), Text to Image, Magic Edit, and Magic Eraser. Makes design accessible to non-designers.

**Key Features:**
- Magic Design (AI-generated templates)
- Text to Image generation
- Magic Edit (replace objects)
- Magic Eraser (remove objects)
- Magic Write (AI copywriting)
- Brand kit integration

**Pricing:**
| Plan | Price | AI Features |
|------|-------|-------------|
| Free | $0 | Limited AI use |
| Pro | $12.99/month | Full AI suite, 1TB storage |
| Teams | $14.99/user/month | Brand management, collaboration |
| Enterprise | Custom | Advanced controls |

**Integration Potential:** High - Built into popular design platform, API available

**Best Use Cases:**
- Social media content creation
- Marketing materials
- Presentations
- Teams needing design collaboration
- Non-designers creating professional content

---

### Adobe Firefly
**Website:** https://www.adobe.com/products/firefly.html

**What it does:**
Adobe's family of generative AI models for creative work. Integrated across Creative Cloud applications. Trained on Adobe Stock and public domain content for commercial safety.

**Key Features:**
- Text to Image
- Generative Fill (in Photoshop)
- Text Effects
- Vector generation
- Template generation
- Commercially safe training data

**Pricing:**
- Included with Creative Cloud subscriptions
- Free tier: 25 generative credits/month
- Premium: $4.99/month for 100 credits

**Integration Potential:** Excellent - Native integration in Photoshop, Illustrator, Express

**Best Use Cases:**
- Professional creative workflows
- Commercial design work
- Photoshop/Illustrator users
- Content requiring IP safety
- Enterprise creative teams

---

### Remove.bg
**Website:** https://www.remove.bg

**What it does:**
Specialized AI tool for automatically removing backgrounds from images. Industry-leading accuracy for isolating subjects.

**Key Features:**
- One-click background removal
- Bulk processing (up to 500 images/minute)
- API access
- Figma, Photoshop, Zapier integrations
- Mobile app available

**Pricing:**
| Plan | Price | Credits |
|------|-------|---------|
| Free | $0 | 1 credit + 50 previews |
| Subscription | From $9/month | 40-3,000 credits |
| Pay as you go | From $1.99 | 1-1,000 credits |

**Integration Potential:** Excellent - API, plugins for major design tools, Zapier integration

**Best Use Cases:**
- E-commerce product photos
- Marketing asset creation
- Portrait photography
- Batch processing workflows
- Any image requiring background removal

---

### Cleanup.pictures
**Website:** https://cleanup.pictures

**What it does:**
AI-powered object removal and image retouching tool. Uses advanced inpainting to remove unwanted objects, people, text, watermarks, and defects from photos.

**Key Features:**
- Object removal with brush tool
- Text/watermark removal
- Blemish and wrinkle removal
- Tourist removal from photos
- High-resolution export (Pro)
- API access

**Pricing:**
| Plan | Price | Features |
|------|-------|----------|
| Free | $0 | 720px export limit |
| Pro | $5/month or $36/year | Unlimited resolution, all features |
| API | Custom | For integration into products |

**Integration Potential:** High - API available, ClipDrop ecosystem integration

**Best Use Cases:**
- Photo retouching
- Real estate photography
- E-commerce product cleanup
- Portrait editing
- Restoring old photos

---

### Runway ML (Image/Video)
**Website:** https://runwayml.com

**What it does:**
Creative suite with AI tools for image generation, video editing, and content creation. Recently released Gen-4.5, described as "world's top-rated video model."

**Key Features:**
- Gen-4 / Gen-4.5 (text/image to video)
- Gen-4 Turbo (fast video generation)
- Act-Two (performance capture)
- Image generation (Gemini models)
- Text to Speech
- Video editing tools

**Pricing:**
| Plan | Price | Credits |
|------|-------|---------|
| Free | $0 | 125 credits one-time |
| Standard | $12/month | 625 credits/month |
| Pro | $28/month | 2,250 credits/month |
| Unlimited | $76/month | 2,250 credits + unlimited Explore mode |
| Enterprise | Custom | Custom |

**Integration Potential:** Medium - Web-based platform, API available for enterprise

**Best Use Cases:**
- AI video generation
- Creative filmmaking
- Advertising and marketing videos
- Content creators
- Fashion and design visualization

---

## 3. SPECIFIC TOOLS USER MENTIONED

---

### Tinyfish.AI
**Website:** https://tinyfish.ai

**What it does:**
Enterprise infrastructure for web data operations designed for AI agents. Enables live execution on dynamic websites at scale - navigate, authenticate, extract, and transact. Serverless architecture with no browsers or proxies to manage.

**Key Features:**
- 1,000 parallel operations via single API
- Behind-login data extraction
- Form and paywall navigation
- Real-time data from live sites (not cached)
- Sub-minute execution times
- 98.7% success rate
- Claude MCP integration

**Pricing:**
- Usage-based: ~$0.04 per operation (all-inclusive)
- Includes: LLM costs, remote browser ($0/hour), residential proxy ($0/GB), anti-bot protection
- Volume discounts available
- Free trial available

**Integration Potential:** Excellent - Single API, MCP support, SSE streaming, no SDK required

**Best Use Cases:**
- Price monitoring
- Competitor analysis
- Data aggregation from multiple sources
- Financial data extraction
- Enterprise data operations
- AI agent web browsing infrastructure

---

### Seedance 2
**Status:** Could not locate specific product information

**Research Notes:**
- May be related to ByteDance's AI initiatives
- Possibly a video generation tool
- Could be a regional/China-market product
- May require access to specific platforms

**Recommendation:** Check for alternative spellings or related ByteDance/TikTok AI tools

---

### OpenAI Codex
(See detailed entry in Section 1 - AI Web/App Development Tools)

---

## 4. VIDEO/MOTION AI

---

### Runway Gen-2, Gen-3, Gen-4 / Gen-4.5
**Website:** https://runwayml.com

**What it does:**
State-of-the-art video generation models. Gen-4.5 is described as the "world's top-rated video model" with unprecedented visual fidelity and creative control.

**Key Features:**
- Text to Video (Gen-4.5)
- Image to Video (Gen-4, Gen-4 Turbo)
- Act-Two (performance capture from video)
- High-fidelity outputs
- Precise camera control
- 4K resolution support

**Pricing:** (See Runway ML entry in Section 2)

**Integration Potential:** Medium - Web platform, enterprise API available

**Best Use Cases:**
- Cinematic video production
- Advertising campaigns
- Creative filmmaking
- Music videos
- Concept visualization

---

### Pika Labs
**Website:** https://pika.art

**What it does:**
AI video generation platform with focus on creative expression. Recently launched "Pikaformance" model for hyper-real expressions synced to any sound.

**Key Features:**
- Text/Image to video
- Pikaformance model (lip-sync to audio)
- Make images sing, speak, rap
- Near real-time generation speed

**Pricing:**
- Free tier available
- Paid plans for higher usage (specifics require login)

**Integration Potential:** Medium - Web-based platform

**Best Use Cases:**
- Social media content
- Meme creation
- Creative video experiments
- Short-form content

---

### HeyGen
**Website:** https://www.heygen.com

**What it does:**
AI video platform specializing in lifelike avatars and video generation. Creates professional videos with AI avatars, voiceovers, and translations.

**Key Features:**
- 1,000+ stock AI avatars
- Custom avatar creation (Video, Photo, or Avatar IV)
- Text to video with AI avatars
- AI video translator (175+ languages)
- Voice cloning
- API access
- Studio Editor for easy editing

**Pricing:**
| Plan | Price | Features |
|------|-------|----------|
| Free | $0 | Limited features, watermark |
| Creator | From $29/month | 15-30 videos/month |
| Business | Custom | Unlimited videos, API, priority support |
| Enterprise | Custom | Custom avatars, dedicated support |

**Integration Potential:** High - API available, Zapier integration, LMS integrations

**Best Use Cases:**
- Marketing videos
- Training and onboarding
- Sales enablement
- Personalized outreach
- Multilingual content
- E-learning

---

### Synthesia
**Website:** https://www.synthesia.io

**What it does:**
Leading enterprise AI video platform for business. Creates professional training, marketing, and communication videos with AI avatars.

**Key Features:**
- 160+ languages and voices
- Custom AI avatars
- Expressive Avatars
- AI Video Assistant (turn docs into videos)
- 1-click translation
- Screen recorder with auto-transcription
- SCORM export for LMS
- Analytics and version control

**Pricing:**
| Plan | Price | Features |
|------|-------|----------|
| Free | $0 | 10 minutes/month, 9 avatars |
| Starter | ~$22/month | 10 videos/month |
| Creator | ~$67/month | 30 videos/month, custom avatars |
| Enterprise | Custom | Unlimited, API, SSO, analytics |

**Integration Potential:** Excellent - LMS integrations, API, SCORM export, enterprise SSO

**Best Use Cases:**
- Corporate training
- Compliance training
- Sales enablement
- Internal communications
- Enterprise learning
- Global team communication

---

## 5. MUSIC/AUDIO AI

---

### Suno
**Website:** https://suno.com

**What it does:**
AI music generator that creates complete songs from text prompts. Generates vocals, instruments, and production in various genres.

**Key Features:**
- Text to music generation
- Full song creation (vocals + instruments)
- Multiple genre styles
- Lyrics generation
- Cover art generation

**Pricing:**
| Plan | Price | Credits |
|------|-------|---------|
| Free | $0 | 50 credits/day |
| Pro | $10/month | 2,500 credits/month |
| Premier | $30/month | 10,000 credits/month |

**Integration Potential:** Medium - Web platform, API available for some tiers

**Best Use Cases:**
- Content creator background music
- Song prototyping
- Jingles and ads
- Creative exploration
- Podcast intros

---

### Udio
**Website:** https://www.udio.com

**What it does:**
AI music generator focused on high-quality audio production. Creates music in various styles with professional sound quality.

**Key Features:**
- Text to music
- Style reference uploads
- High-fidelity audio output
- Various genre support

**Pricing:**
- Free tier available
- Paid subscriptions for additional features

**Integration Potential:** Medium - Web platform

**Best Use Cases:**
- Music production prototyping
- Content creation
- Creative experimentation

---

### ElevenLabs
**Website:** https://elevenlabs.io

**What it does:**
Leading AI voice platform with text-to-speech, voice cloning, speech-to-text, and AI voice agents. Offers the most realistic AI voices available.

**Key Features:**
- Text to Speech (70+ languages)
- Voice cloning
- Speech to Text (Scribe - 98% accuracy)
- AI Voice Agents (ElevenAgents)
- AI Music generation (Eleven Music)
- Sound effects generation
- API access
- Real-time voice API

**Pricing:**
| Plan | Price | Characters |
|------|-------|------------|
| Free | $0 | 10,000 characters/month |
| Starter | $5/month | 30,000 characters |
| Creator | $22/month | 100,000 characters |
| Pro | $99/month | 500,000 characters |
| Scale | $330/month | 2,000,000 characters |
| Business | Custom | Custom limits |

**Integration Potential:** Excellent - Comprehensive API, real-time streaming, voice agent platform

**Best Use Cases:**
- Audiobooks
- Podcasts
- Voiceovers for video
- AI voice agents
- Accessibility features
- Game character voices
- Real-time applications
- Content localization

---

## SUMMARY TABLE: QUICK COMPARISON

| Tool | Category | Starting Price | Best For |
|------|----------|----------------|----------|
| V0.dev | Web Dev | Free ($20/mo) | React/Next.js UI generation |
| Bolt.new | Web Dev | Free | Full-stack prototypes |
| Lovable | Web Dev | Free | No-code app building |
| Replit Agent | Web Dev | Free | Cloud coding education |
| Cursor | Web Dev | Free ($20/mo) | Professional coding |
| Windsurf | Web Dev | Free ($15/mo) | AI-native development |
| Claude Code | Web Dev | $20/mo | Thoughtful code assistance |
| OpenAI Codex | Web Dev | Free | End-to-end development |
| Vercel AI SDK | Web Dev | Free | Building AI UIs |
| Midjourney | Design | $10/mo | Artistic images |
| DALL-E 3 | Design | $20/mo (ChatGPT) | Precise image generation |
| Stable Diffusion | Design | Free | Self-hosted/custom |
| Canva AI | Design | $12.99/mo | Non-designer graphics |
| Adobe Firefly | Design | $4.99/mo | Professional creatives |
| Remove.bg | Design | Free | Background removal |
| Cleanup.pictures | Design | $5/mo | Object removal |
| Runway ML | Video | Free ($12/mo) | AI video generation |
| Pika Labs | Video | Free | Creative video |
| HeyGen | Video | Free ($29/mo) | AI avatar videos |
| Synthesia | Video | Free ($22/mo) | Enterprise training |
| Suno | Audio | Free ($10/mo) | AI music generation |
| Udio | Audio | Free | AI music production |
| ElevenLabs | Audio | Free ($5/mo) | Voice synthesis |
| Tinyfish.AI | Data | $0.04/op | Web data extraction |

---

## RECOMMENDATIONS BY USE CASE

### For Web/App Development:
- **Startups/MVPs:** Bolt.new or Lovable
- **Professional Development:** Cursor or Windsurf
- **React/Next.js Teams:** V0.dev
- **Enterprise:** Claude Code or OpenAI Codex
- **Learning/Education:** Replit Agent

### For Graphic Design:
- **Artistic/Creative:** Midjourney
- **Marketing Content:** Canva AI
- **Professional Work:** Adobe Firefly
- **Product Photos:** Remove.bg + Cleanup.pictures
- **Self-hosted/Custom:** Stable Diffusion

### For Video:
- **High-quality cinematic:** Runway Gen-4.5
- **Enterprise training:** Synthesia or HeyGen
- **Social content:** Pika Labs

### For Audio:
- **Voice synthesis:** ElevenLabs
- **Music generation:** Suno or Udio

### For Data/Automation:
- **Web data extraction:** Tinyfish.AI

---

*Report compiled: February 13, 2026*
