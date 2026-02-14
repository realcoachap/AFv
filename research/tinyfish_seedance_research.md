# Research Report: Tinyfish.AI and Seedance 2

**Date:** February 14, 2026  
**Researcher:** OpenClaw Agent  
**Status:** ACTIVE - Both services are active and available

---

## 1. Tinyfish.AI

### What It Does
Tinyfish is an **enterprise AI agent infrastructure company** that builds web-based agents to automate complex online tasks. The platform enables enterprises to:
- Navigate and extract data from live, dynamic websites at scale
- Perform actions behind logins, forms, and paywalls
- Execute parallel operations (up to 1,000 simultaneous)
- Convert public web pages into structured, usable data

Their core product is **Mino**, an "agentic platform" that provides competitive and pricing intelligence using AI agents to capture real-time data on checkout prices and pricing variations.

### Key Capabilities
- **Live data extraction** from dynamic sites (not cached/stale data)
- **Authentication support** - works behind logins, forms, paywalls
- **Parallel execution** - run 1,000 operations simultaneously
- **Production speed** - sub-minute completion times
- **99.7% success rate** according to their benchmarks
- **Serverless architecture** - no browsers or proxies to manage

### Use Cases
1. **Dynamic price surveillance** - Track competitor prices, promotions, shipping times, inventory in real-time (retail/travel focus)
2. **Hotel price monitoring** - Convert web pages into searchable property data
3. **Event data processing** - Structure leads for sales teams
4. **Job application automation** (via Jobright partnership)
5. **Sales intelligence** (via Amplemarket partnership)

### Current Status
**✅ ACTIVE** - Well-funded, growing rapidly
- Founded: **2024**
- Funding: **$47 million Series A** (August 2025)
- Investors: ICONIQ Capital (lead), USVP, MongoDB Ventures, Sheryl Sandberg's Sandberg Bernthal Venture Partners
- Location: Palo Alto, California
- Team: ~25 people
- Customers: Google Hotels, DoorDash, ClassPass, Jobright, Amplemarket

### Pricing

| Plan | Monthly Price | Price Per Step | Included Steps | Agent Concurrency |
|------|---------------|----------------|----------------|-------------------|
| **Pay As You Go** | $0 | $0.015 | Pay per use | 2 agents |
| **Standard** | $15/mo | $0.014 overage | 1,650/month | 4 agents |
| **Pro** | $150/mo | $0.012 overage | 16,500/month | 20 agents |
| **Enterprise** | Custom | Custom | Custom | Unlimited |

**All plans include:**
- Visual workflow builder
- Remote browser infrastructure ($0/hour)
- Residential proxy ($0/GB)
- All LLM costs included
- Anti-bot protection
- MCP integration
- Agent observability with screenshots

### API & Integration Options
- **REST API** available at `https://agent.tinyfish.ai/v1/`
- **SSE (Server-Sent Events)** for real-time progress streaming
- **MCP (Model Context Protocol)** integration with Claude
- **No SDK required** - simple curl/HTTP requests
- **LangChain and LangGraph** support mentioned

**Sample API Call:**
```bash
curl --location 'https://agent.tinyfish.ai/v1/automation/run-sse' \
--header 'Content-Type: application/json' \
--header 'X-API-Key: TINYFISH_API_KEY' \
--data '{
  "url": "https://amazon.com",
  "goal": "Find me the price of airpods pro 3",
  "proxy_config": { "enabled": false }
}'
```

### Competitive Position
- **vs OpenAI Operator:** Claims 81% success on hard web tasks vs OpenAI's 43%
- **vs Traditional Automation:** 4x broader coverage, 50% lower operational cost
- **vs Search APIs:** Provides live data vs stale cached data
- **Speed benchmark:** 50 portals in 2m 14s (vs 45m+ for traditional automation)

### Verdict
**🟢 HIGHLY USEFUL** - Active, well-funded enterprise tool with clear API access and transparent pricing. Good for businesses needing real-time web data extraction at scale.

---

## 2. Seedance 2 (ByteDance Seed)

### What It Is
**Seedance 2** is ByteDance's next-generation **AI video generation model** designed for creating cinematic, 1080p resolution videos with synchronized audio. It's part of ByteDance's "Seed" AI model family.

**⚠️ IMPORTANT DISTINCTION:** "Seedance" refers to an AI video generation model, NOT a dance-related service despite the name.

### Key Capabilities
- **Text-to-Video:** Generate videos from text descriptions
- **Image-to-Video:** Animate static images
- **Multi-shot storytelling:** Maintains character/style consistency across scene sequences
- **Native audio generation:** Creates dialogue, ambient sounds, and SFX synchronized to video
- **1080p/2K resolution output** with cinematic quality
- **Up to 20-second video generation** (according to some sources)
- **Multimodal inputs:** Supports text, image, audio, and video references
- **30% faster generation** than Seedance 1.0

### Current Status
**✅ ACTIVE** - Recently launched/updated
- **Released:** Seedance 2.0 (current version as of early 2025/2026)
- **Developer:** ByteDance Seed team
- **Official site:** https://seed.bytedance.com/en/seedance2_0
- **Availability:** Accessible via multiple third-party platforms and ByteDance's own interfaces

### Access Points
1. **ByteDance Official:** https://seed.bytedance.com/en/seedance2_0
2. **Seedance2AI.app:** https://www.seedance2ai.app/ (third-party wrapper)
3. **Seedance.io:** https://seedance.io/seedance-2
4. **EaseMate AI:** https://www.easemate.ai/seedance-2-0-ai-video-generator
5. **Imagine.art:** https://www.imagine.art/features/seedance-2-0

### Pricing (Third-Party Platforms)

**Seedance2AI.app Pricing:**

| Plan | Monthly Price | Annual Credits | Videos/Month | Notes |
|------|---------------|----------------|--------------|-------|
| **Basic** | $9.90/mo | 9,600 | ~80 | Entry level |
| **Pro** | $19.90/mo | 24,000 | ~200 | For creators |
| **Enterprise** | $49.90/mo | 72,000 | ~600 | For teams |

*Note: Pricing varies by platform. These are from third-party wrappers, not official ByteDance pricing.*

**Credit System:**
- Videos cost credits based on duration and resolution
- Free trials/credits available on most platforms
- Credit cost per 100 credits: $0.83-$1.24 depending on plan

### API & Integration Options
- **No official public API documentation found** for direct ByteDance access
- Available through third-party platforms with their own APIs
- ByteDance Seed platform appears to be primarily web-interface based
- Enterprise access likely available through ByteDance business channels

### Model Variants in Seedance Line
1. **Seedance 1.0** - Original multi-tasking video generation model
2. **Seedance 1.5 Pro** - Joint audio-video model with complex instruction following
3. **Seedance 2.0** - Latest with unified multimodal audio-video architecture

### Use Cases
- **Marketing/advertising videos** - Social ads, product demos
- **Short films/storytelling** - Multi-shot narrative content
- **Social media content** - Clips for TikTok, Instagram, etc.
- **Storyboarding** - Pre-visualization for productions
- **Creative projects** - Anime, indie films, concept videos

### Comparison to Competitors
- **vs Sora (OpenAI):** Competitive quality, potentially faster generation
- **vs Runway Gen-4:** Strong on narrative coherence
- **vs Veo (Google):** Similar 1080p output quality
- **Advantage:** Native audio generation (most competitors don't include audio)

### Verdict
**🟢 USEFUL** - Active, cutting-edge video generation model with impressive capabilities including native audio. However, direct API access appears limited; most access is through third-party platforms with varying pricing. Best for content creators and marketers needing quick video generation.

---

## Summary Comparison

| Aspect | Tinyfish.AI | Seedance 2 |
|--------|-------------|------------|
| **Category** | Web agent/automation | AI video generation |
| **Status** | ✅ Active | ✅ Active |
| **Developer** | Tinyfish Inc. | ByteDance |
| **Funding** | $47M Series A | Corporate-backed |
| **Pricing** | Transparent ($0-$150+/mo) | Varies by platform (~$10-50/mo) |
| **API Access** | ✅ Clear REST API | ⚠️ Limited/unclear direct API |
| **Best For** | Enterprise data extraction | Content creators, marketers |
| **Unique Feature** | Live web navigation | Native audio + video generation |

---

## Sources

### Tinyfish.AI
- https://www.tinyfish.ai/
- https://www.tinyfish.ai/pricing
- Reuters: "AI agent startup TinyFish raises $47 million" (Aug 20, 2025)
- Medium: "TinyFish: The AI Startup That Raised $47 Million"
- Reddit r/aicuriosity: Product launch discussion

### Seedance 2
- https://seed.bytedance.com/en/seedance2_0
- https://seed.bytedance.com/en/models
- https://www.seedance2ai.app/
- https://seedance.io/seedance-2
- https://seadanceai.com/seedance-2
- https://www.easemate.ai/seedance-2-0-ai-video-generator

---

*Report generated by OpenClaw Agent on February 14, 2026*
