/**
 * case-studies-data.js
 * Centralized data store for all 13 production engineering projects and case studies
 * for Ayaan Shahbaz's Portfolio (ayaanshahbaz.space).
 *
 * Each entry provides end-to-end technical documentation: Overview, The Problem,
 * The Solution, Multi-Step Architecture Workflows, Engineering Challenges, and Quantified Outcomes.
 */

const CASE_STUDIES = [
    {
        id: "orvinhq",
        slug: "orvinhq",
        index: "01",
        title: "OrvinHQ",
        subtitle: "Enterprise-Grade Multi-Tenant Workplace & HR Operations Platform",
        category: "Full-Stack SaaS · HRIS · Workforce Operations",
        projectType: "Independent Product Development",
        isConfidential: false,
        image: "content/Images/Selected Work/OrvinHQ.png",
        imageAlt: "OrvinHQ workplace management platform interface showing team and task dashboards.",
        imageContain: true,
        metrics: [
            { label: "Compiled Routes", value: "69", sub: "Next.js 16 App Router" },
            { label: "Django Tests", value: "34/34", sub: "100% Automated Pass" },
            { label: "Security Audits", value: "20/20", sub: "RBAC & BOLA Checks" },
            { label: "Presence Engine", value: "<1s", sub: "Heartbeat Sync Latency" }
        ],
        techStack: [
            "Django 6.1",
            "Django REST Framework",
            "PostgreSQL",
            "SimpleJWT",
            "Next.js 16 (Turbopack)",
            "React 19",
            "TypeScript",
            "Tailwind CSS",
            "SWR"
        ],
        overview: "Unified, enterprise-grade workplace operations platform consolidating team directory, daily attendance, leave scheduling, project milestones, help desk tickets, and executive PDF reporting into one centralized workspace. Built from scratch and in active production use at Parvaaz.",
        theProblem: "Growing distributed teams rely on disconnected SaaS tools—attendance tracked in Clockify, leaves in spreadsheets, tasks in Jira, and status updates scattered across Slack channels. This fragmentation creates operational blind spots, duplicate data entry, compliance risks, and subscription bloat.",
        theSolution: [
            "Autonomous organization-level tenant isolation returning HTTP 404 on cross-tenant ID probes, completely eliminating BOLA/IDOR vulnerabilities.",
            "Shift clock-in/out engine featuring mandatory end-of-day work summaries (completed_work, pending_work) and 16-hour sliding-window midnight/timezone rollover protection.",
            "Real-time presence heartbeat (available, away, busy, offline) powered by visibilitychange listeners, conditional DB writes, and navigator.sendBeacon on tab termination.",
            "Leave balance tracking with date-overlap validation, tier allocations, and manager approval state machines.",
            "Object-level RBAC task boards where assignees update task status while priority and deadline mutations strictly require manager or admin permissions.",
            "Zero-dependency @media print vector PDF Executive Milestone Reports and 1-click CSV payroll/roster exports.",
            "Asynchronous daemon-thread SMTP welcome email dispatch with cryptographically generated temporary credentials."
        ],
        architecture: [
            {
                step: "01",
                title: "Client & Edge Middleware",
                desc: "Next.js 16 App Router with Turbopack and React 19 server components, guarded by edge proxy middleware enforcing session validity and route access."
            },
            {
                step: "02",
                title: "Stateless JWT Rotation",
                desc: "httpOnly cookie-backed SimpleJWT authentication pipeline with atomic refresh lock preventing token race conditions."
            },
            {
                step: "03",
                title: "BOLA-Defended API Gateway",
                desc: "Django REST Framework ViewSets overriding get_queryset() to strictly isolate queries by request.user.organization_id."
            },
            {
                step: "04",
                title: "Relational Persistence & Indexing",
                desc: "PostgreSQL schema with composite indexes, foreign key constraints, and O(1) Django ORM .annotate() aggregations."
            },
            {
                step: "05",
                title: "Presence Heartbeat Engine",
                desc: "Sub-second heartbeat pings with client-side visibility detection and navigator.sendBeacon fallback on browser unload."
            },
            {
                step: "06",
                title: "Vector PDF & Export Service",
                desc: "Client-side CSS paged media vector PDF generation and streaming server-side CSV roster generation."
            }
        ],
        engineeringChallenges: [
            {
                title: "Cross-Tenant BOLA Isolation",
                desc: "Eliminated cross-tenant data leaks across projects, tasks, and announcements by overriding get_queryset() to filter strictly on request.user.organization_id, backed by a 20-case automated test suite verifying 404 responses."
            },
            {
                title: "Eliminating N+1 SQL Bottlenecks",
                desc: "Executive analytics dashboards initially caused cascading queries. Resolved via Django ORM .select_related() and .prefetch_related() coupled with targeted db_index=True on status, tenant, and timestamp fields."
            },
            {
                title: "JWT Token Rotation Across Edge & Node",
                desc: "Handled httpOnly JWT refresh token race conditions during concurrent Next.js API route calls by implementing an atomic token refresh lock and seamless client-side retry mechanism."
            }
        ],
        outcome: "A production-hardened workplace operations platform built from scratch, cutting administrative friction by 40% and actively used by the Parvaaz team for company-wide coordination.",
        confidentialityNotice: null
    },
    {
        id: "aura-ai",
        slug: "aura-ai",
        index: "02",
        title: "AURA AI",
        subtitle: "RAG-Powered AI Business Knowledge Assistant & Lead Qualifier",
        category: "RAG · AI Agents · Business Intelligence",
        projectType: "AI Systems Development",
        isConfidential: false,
        image: "content/Images/Selected Work/Aura.png",
        imageAlt: "AURA RAG knowledge assistant interface demonstrating AI agent interaction and internal business data retrieval.",
        imageContain: false,
        metrics: [
            { label: "Response Time", value: "<3s", sub: "From hours down to seconds" },
            { label: "Lead Qualification", value: "100%", sub: "Automated Intent Extraction" },
            { label: "Data Accuracy", value: "99.4%", sub: "Source-Grounded Retrieval" },
            { label: "Calendar Sync", value: "Zero", sub: "Booking Conflicts" }
        ],
        techStack: [
            "RAG (Retrieval-Augmented Generation)",
            "AI Agents",
            "Model Context Protocol (MCP)",
            "n8n Orchestration",
            "OpenRouter LLM APIs",
            "Google Calendar API"
        ],
        overview: "Autonomous RAG-powered enterprise knowledge assistant connecting company internal documentation, qualifying inbound prospects through multi-turn dialogue, and scheduling qualified appointments directly into calendar slots.",
        theProblem: "Prospects and internal staff waste hours waiting for team responses regarding operational policies, technical capabilities, and pricing packages, leading to high inbound drop-off rates and lost business opportunities.",
        theSolution: [
            "Vectorized company knowledge base with semantic similarity search ensuring AI answers are 100% grounded in verified source docs.",
            "Multi-step prompt chain extracting lead budget, project timeline, and technical scope during conversational chat.",
            "Model Context Protocol (MCP) tool integration enabling the agent to inspect live calendar availability and lock bookings autonomously.",
            "Fallback escalation protocol routing anomalous or low-confidence queries directly to human account directors with context transcripts.",
            "Strict hallucination guardrails rejecting speculative queries outside the indexed knowledge context."
        ],
        architecture: [
            {
                step: "01",
                title: "User Query Ingestion",
                desc: "Inbound user message received via chat widget, sanitized and normalized for embedding query extraction."
            },
            {
                step: "02",
                title: "Vector Search & Retrieval",
                desc: "Semantic similarity query executed against indexed knowledge chunks using cosine distance matching."
            },
            {
                step: "03",
                title: "Context Injection & Guardrails",
                desc: "Retrieved chunks injected into a strict system prompt with explicit boundaries preventing hallucinations."
            },
            {
                step: "04",
                title: "Agent Reasoning & Tool Call",
                desc: "LLM evaluates conversational intent, checks meeting availability, and initiates MCP booking tools."
            },
            {
                step: "05",
                title: "Calendar Booking & Lock",
                desc: "Agent calls Google Calendar API via n8n webhook, locking a 30-minute discovery call and sending invites."
            },
            {
                step: "06",
                title: "Telemetry & Transcript Log",
                desc: "Session metadata, lead qualification tags, and complete conversation transcript logged to internal CRM."
            }
        ],
        engineeringChallenges: [
            {
                title: "Preventing Hallucinations on Pricing",
                desc: "Implemented strict negative prompting and threshold gating (similarity score >= 0.82) to ensure the agent states 'I don't have that specific information' rather than guessing pricing or SLA guarantees."
            },
            {
                title: "Calendar Timezone Drift",
                desc: "Resolved client/host timezone mismatches by enforcing UTC ISO-8601 timestamps throughout the n8n pipeline and dynamically formatting local times in user-facing dialogue."
            }
        ],
        outcome: "Cut inbound response times from hours to under 3 seconds, quadrupled qualified calendar bookings, and enabled 24/7 business discovery without staffing overhead.",
        confidentialityNotice: null
    },
    {
        id: "convoo-ai",
        slug: "convoo-ai",
        index: "03",
        title: "Convoo AI",
        subtitle: "Full-Stack Real-Time Conversational AI Platform with SSE & Live Web Search",
        category: "Full-Stack Development · Conversational AI · Real-Time Systems",
        projectType: "Independent Product Development",
        isConfidential: false,
        image: "content/Images/Selected Work/Convoo.png",
        imageAlt: "Convoo AI chat platform interface featuring persistent memory and real-time response streaming.",
        imageContain: false,
        metrics: [
            { label: "Token Stream", value: "SSE", sub: "Zero-Lag Server-Sent Events" },
            { label: "Live Search", value: "Real-Time", sub: "Automated Web Search Engine" },
            { label: "Session Memory", value: "Infinite", sub: "Sliding Window Context DB" },
            { label: "Auth Security", value: "JWT", sub: "Rotating Bearer Tokens" }
        ],
        techStack: [
            "Django",
            "Django REST Framework",
            "JWT Authentication",
            "Next.js",
            "TypeScript",
            "Server-Sent Events (SSE)",
            "Live Web Search Retrieval"
        ],
        overview: "High-performance full-stack conversational AI platform built with persistent dialogue memory, token-by-token Server-Sent Events (SSE) streaming, JWT session management, and dynamic live web retrieval.",
        theProblem: "Standard conversational wrappers suffer from high latency, rigid context windows, lack of real-time web awareness, and disjointed session state between web clients and backend API servers.",
        theSolution: [
            "Custom SSE streaming response protocol delivering token-by-token generation with sub-100ms first-chunk time-to-first-byte (TTFB).",
            "Automated live web search engine triggering search queries when the user requests current news, market data, or recent documentation.",
            "Persistent session memory with sliding window context management and database message tree persistence in PostgreSQL.",
            "JWT authentication with automatic token rotation, user quota enforcement, and conversational rate-limiting.",
            "Clean, dark-mode conversational UI built with Next.js, TypeScript, and markdown rendering with syntax-highlighted code blocks."
        ],
        architecture: [
            {
                step: "01",
                title: "Client Stream Connection",
                desc: "Next.js frontend initiates an EventSource / fetch stream connection with authorization headers."
            },
            {
                step: "02",
                title: "Query Analysis & Intent",
                desc: "Django backend parses the prompt to determine whether live external web retrieval is required."
            },
            {
                step: "03",
                title: "Web Search & Synthesis",
                desc: "Live search API fetches top verified results, summarising key snippets into the working context."
            },
            {
                step: "04",
                title: "LLM Streaming Generation",
                desc: "OpenRouter / LLM engine processes conversation history and context, outputting token chunks."
            },
            {
                step: "05",
                title: "SSE Chunk Transmission",
                desc: "Backend flushes tokens immediately as Server-Sent Events with structured event IDs."
            },
            {
                step: "06",
                title: "Session Tree Archival",
                desc: "Completed response and user input are atomically committed to the conversational database."
            }
        ],
        engineeringChallenges: [
            {
                title: "Buffer Dropping in Reverse Proxy",
                desc: "Standard Nginx / Vercel proxies buffer HTTP responses by default, breaking streaming. Configured 'X-Accel-Buffering: no' and SSE headers to allow immediate token passthrough."
            },
            {
                title: "Context Window Overflow",
                desc: "Engineered a rolling token budget trimmer that dynamically prunes ancient turns while preserving the initial system prompt and recent conversational history."
            }
        ],
        outcome: "A responsive, modern conversational AI platform delivering near-instant streaming responses and live web knowledge awareness.",
        confidentialityNotice: null
    },
    {
        id: "content-intelligence",
        slug: "content-intelligence",
        index: "04",
        title: "Autonomous Content Intelligence System",
        subtitle: "Multi-Agent Research, Synthesis & Automated Slack Publishing Pipeline",
        category: "Multi-Agent AI · Content Research · RAG · n8n",
        projectType: "Confidential Client Engagement",
        isConfidential: true,
        image: "content/Images/Selected Work/Autonomous Content Intelligence System.jpg",
        imageAlt: "Autonomous Content Intelligence System workflow representing automated research and content generation pipeline.",
        imageContain: false,
        metrics: [
            { label: "Cycle Cadence", value: "24/7", sub: "Continuous Scheduled Runs" },
            { label: "Research Coverage", value: "5+ Sources", sub: "Reddit, News, X, Substack" },
            { label: "Manual Effort", value: "-90%", sub: "Ideation to Draft Delivery" },
            { label: "Slack Delivery", value: "Instant", sub: "Formatted Block Kit Cards" }
        ],
        techStack: [
            "n8n Orchestration",
            "Multi-Agent AI",
            "RAG Pipelines",
            "Slack Webhooks & Block Kit",
            "Firecrawl & Research APIs",
            "OpenAI GPT-4o"
        ],
        overview: "Autonomous 24/7 multi-agent content research system that continuously monitors trending industry discussions, extracts high-affinity audience topics, synthesizes structured content assets, and delivers ready-to-publish drafts directly into private client Slack channels.",
        theProblem: "Content marketing and thought leadership teams spend 15+ hours weekly manually browsing forums, social feeds, and newsletters to uncover fresh topics, resulting in slow publishing cycles and repetitive ideation.",
        theSolution: [
            "Scheduled autonomous scraping of industry discussions, news feeds, and social trends via specialized n8n nodes.",
            "Multi-agent AI processing pipeline: Research Agent filters noise, Synthesis Agent extracts narrative angles, and Copywriter Agent drafts post options.",
            "RAG knowledge integration referencing previous client content to ensure brand voice consistency and zero duplicate topics.",
            "Rich Slack Block Kit formatting with interactive approval buttons ('Approve Post', 'Regenerate Hook', 'Archive').",
            "Centralized Airtable / Notion content repository syncing approved drafts directly to the publishing schedule."
        ],
        architecture: [
            {
                step: "01",
                title: "Scheduled Ingestion",
                desc: "Cron triggers daily scans of target subreddits, industry newsletters, and RSS feeds."
            },
            {
                step: "02",
                title: "Deduplication & Filter",
                desc: "System hashes topics and queries historical database to prevent redundant ideation."
            },
            {
                step: "03",
                title: "Research Agent Deep-Dive",
                desc: "AI agent scrapes full text of high-engagement discussions, extracting core pain points and metrics."
            },
            {
                step: "04",
                title: "Brand Voice Alignment",
                desc: "Synthesis agent compares raw insights against client brand guidelines and historical high-performers."
            },
            {
                step: "05",
                title: "Draft Asset Generation",
                desc: "Copywriter agent outputs 3 distinct hooks, structured body bullets, and call-to-action suggestions."
            },
            {
                step: "06",
                title: "Slack Block Kit Delivery",
                desc: "Formatted notification sent to #content-feed with 1-click approval and edit triggers."
            },
            {
                step: "07",
                title: "Content Repository Sync",
                desc: "Approved drafts are automatically logged into the master content calendar database."
            }
        ],
        engineeringChallenges: [
            {
                title: "Scraper Rate Limits & Anti-Bot Walls",
                desc: "Integrated headless proxy rotation and retry backoffs within n8n HTTP Request nodes to ensure 99.8% uptime without IP bans."
            },
            {
                title: "Quality Variance in AI Content",
                desc: "Introduced a two-tier evaluation prompt where a 'Critic Agent' scores drafts against a 10-point rubric before approving Slack delivery."
            }
        ],
        outcome: "Eliminated 15+ hours of manual research per week, doubled weekly content production, and established an autonomous trend pipeline running silently in the background.",
        confidentialityNotice: "This system was engineered under a non-disclosure agreement. Client branding, private webhook URIs, and proprietary research sources have been sanitized in this case study."
    },
    {
        id: "dental-receptionist",
        slug: "dental-receptionist",
        index: "05",
        title: "AI-Powered Dental Clinic Receptionist",
        subtitle: "Autonomous WhatsApp Booking, Patient Qualification & Practice Automation",
        category: "WhatsApp Automation · AI Agents · Appointment Management",
        projectType: "Confidential Client Engagement",
        isConfidential: true,
        image: "content/Images/Selected Work/AI-Powered Dental Clinic Receptionist Automation.jpg",
        imageAlt: "AI-Powered Dental Clinic Receptionist Automation workflow diagram.",
        imageContain: false,
        metrics: [
            { label: "Missed Inquiries", value: "0%", sub: "24/7 Instant Responses" },
            { label: "Bookings Converted", value: "+38%", sub: "WhatsApp to Calendar Sync" },
            { label: "Staff Time Saved", value: "22h/wk", sub: "Repetitive Inquiries Handled" },
            { label: "Platform", value: "WhatsApp", sub: "Official Cloud API Engine" }
        ],
        techStack: [
            "WhatsApp Cloud API",
            "n8n Workflow Engine",
            "OpenAI GPT-4o-mini",
            "Google Sheets (Database)",
            "Google Calendar API",
            "Webhook Callbacks"
        ],
        overview: "End-to-end intelligent receptionist automation running 24/7 over WhatsApp for a high-volume dental practice, handling patient inquiries, treatment pricing, appointment scheduling, and calendar reminders.",
        theProblem: "Dental clinics lose up to 35% of potential patient bookings that occur after business hours or during busy clinical procedures when front-desk staff are occupied with in-office patients.",
        theSolution: [
            "24/7 instant WhatsApp response engine operating in natural language, answering treatment FAQs, insurance questions, and clinic hours.",
            "Dynamic appointment scheduling querying real-time doctor availability and locking calendar slots without double-booking.",
            "Two-way patient record synchronization in Google Sheets acting as an accessible, real-time operational database.",
            "Automated appointment reminder sequences sent 24 hours and 2 hours prior to scheduled visits, cutting no-show rates by 45%.",
            "Intelligent escalation alerting the human clinic manager immediately when a patient mentions acute emergencies or dental trauma."
        ],
        architecture: [
            {
                step: "01",
                title: "Inbound Message Webhook",
                desc: "Meta WhatsApp Cloud API notifies n8n endpoint of new patient messages with sender verification."
            },
            {
                step: "02",
                title: "Session State & Patient Lookup",
                desc: "System queries Google Sheets database to check whether the sender is a returning or first-time patient."
            },
            {
                step: "03",
                title: "Clinical AI Agent Reasoning",
                desc: "Agent categorizes intent (inquiry, booking, reschedule, emergency) and applies clinical guidelines."
            },
            {
                step: "04",
                title: "Real-Time Slot Verification",
                desc: "Agent queries Google Calendar API to find open chair slots for the requested procedure type."
            },
            {
                step: "05",
                title: "Slot Booking & Confirmation",
                desc: "Upon patient confirmation, n8n writes the event to the doctor's calendar and sends a WhatsApp confirmation."
            },
            {
                step: "06",
                title: "Reminder Sequence Schedule",
                desc: "Automated delayed execution triggers reminders and preparation instructions before the visit."
            }
        ],
        engineeringChallenges: [
            {
                title: "Handling Concurrent Booking Collisions",
                desc: "Implemented atomic slot locking in Google Calendar to prevent two concurrent WhatsApp chats from claiming the same 45-minute treatment window."
            },
            {
                title: "Emergency Medical Triage",
                desc: "Crafted strict intent triggers that immediately bypass AI chat and dispatch urgent SMS/call alerts to the on-call dentist if keywords like 'severe pain', 'bleeding', or 'broken tooth' are detected."
            }
        ],
        outcome: "Eliminated after-hours missed appointments, increased monthly bookings by 38%, and freed up 20+ hours of receptionist phone time every week.",
        confidentialityNotice: "Developed for a private healthcare clinic. Clinic name, patient identifiers, and proprietary scheduling rules are protected under non-disclosure agreements."
    },
    {
        id: "ai-customer-support",
        slug: "ai-customer-support",
        index: "06",
        title: "AI Customer Support Automation",
        subtitle: "Intelligent Ticket Triage, Autonomous Resolution & Helpdesk Integration",
        category: "AI Agents · Intelligent Routing · Customer Support",
        projectType: "Confidential Client Engagement",
        isConfidential: true,
        image: "n8n-library/ai-support-automation.jpg",
        imageAlt: "AI Customer Support Automation workflow architecture in n8n.",
        imageContain: false,
        metrics: [
            { label: "First Response Time", value: "<15s", sub: "Down from 4 hours" },
            { label: "Auto-Resolution", value: "62%", sub: "Zero Human Touch Required" },
            { label: "CSAT Score", value: "4.8/5", sub: "Post-Interaction Rating" },
            { label: "Ticket Triage", value: "100%", sub: "Automated Tagging & Routing" }
        ],
        techStack: [
            "n8n Workflow Automation",
            "OpenAI GPT-4o",
            "Webhook Ingestion",
            "Zendesk / Freshdesk API",
            "Vector Knowledge Base",
            "Slack Escalations"
        ],
        overview: "Autonomous customer support orchestration pipeline that ingests incoming tickets, performs semantic sentiment and urgency triage, resolves tier-1 technical questions using verified documentation, and routes complex cases to human agents.",
        theProblem: "Customer support desks face overwhelming ticket backlogs filled with repetitive questions regarding account resets, subscription changes, and basic setup, causing days of delay on critical tier-2 issues.",
        theSolution: [
            "High-throughput webhook ingestion parsing incoming emails, web tickets, and contact form submissions in real time.",
            "Semantic classification categorizing incoming tickets by urgency, product category, and customer subscription tier.",
            "RAG knowledge agent generating comprehensive, step-by-step resolution answers citing accurate documentation.",
            "Automated ticket status updates and customer replies delivered directly through the ticketing platform API.",
            "Smart escalation alerting specialized engineers in dedicated Slack channels when high-value accounts submit critical bugs."
        ],
        architecture: [
            {
                step: "01",
                title: "Ticket Webhook Trigger",
                desc: "Ticketing platform fires webhook payload containing customer ID, subject, and ticket body."
            },
            {
                step: "02",
                title: "Enrichment & Sentiment Analysis",
                desc: "n8n extracts user tier from CRM and scores ticket sentiment to identify frustrated customers."
            },
            {
                step: "03",
                title: "Knowledge Base Query",
                desc: "Query vector search across internal product manuals, API docs, and known issue registries."
            },
            {
                step: "04",
                title: "Tier-1 Autonomous Resolution",
                desc: "If confidence score >= 90%, AI posts an empathetic, accurate resolution response directly to the ticket."
            },
            {
                step: "05",
                title: "Escalation & Tagging",
                desc: "If confidence is low or query is billing/security sensitive, tickets are tagged and assigned to human specialists."
            }
        ],
        engineeringChallenges: [
            {
                title: "Avoiding Hallucinatory Solutions",
                desc: "Configured strict confidence thresholds; if the knowledge vector distance indicates missing data, the agent drafts an internal note for human review rather than sending an unverified reply."
            },
            {
                title: "Preventing Infinite Email Loops",
                desc: "Implemented loop-detection headers and sender filtering to avoid auto-reply ping-pong when customers have out-of-office autoreponders."
            }
        ],
        outcome: "Autonomous resolution of 62% of incoming support volume, slashing first-response times to under 15 seconds and sustaining a 4.8/5 CSAT rating.",
        confidentialityNotice: "Client identity and proprietary support documentation sanitized pursuant to non-disclosure obligations."
    },
    {
        id: "cold-email-lead-gen",
        slug: "cold-email-lead-gen",
        index: "07",
        title: "AI Cold Email & Lead Generation System",
        subtitle: "Scraping, Multi-Source Enrichment, AI Hyper-Personalization & Scaled Dispatch",
        category: "Lead Generation · Data Enrichment · Personalized Outreach",
        projectType: "Confidential Client Engagement",
        isConfidential: true,
        image: "n8n-library/lead-generation-cold-email.jpg",
        imageAlt: "AI Cold Email and Lead Generation System workflow architecture in n8n.",
        imageContain: false,
        metrics: [
            { label: "Enrichment Depth", value: "3 Sources", sub: "Apollo, LinkedIn, Web" },
            { label: "Open Rate", value: "64%", sub: "High Deliverability & DNS" },
            { label: "Reply Rate", value: "18.2%", sub: "Hyper-Personalized Icebreakers" },
            { label: "Bounce Rate", value: "<1.2%", sub: "Strict Real-Time MX Checks" }
        ],
        techStack: [
            "n8n Workflow Automation",
            "Apollo / Scraping APIs",
            "NeverBounce / MX Verification",
            "OpenAI GPT-4o-mini",
            "Instantly / Smartlead APIs",
            "Google Sheets"
        ],
        overview: "Fully automated B2B outbound engine that continuously identifies target decision-makers, enriches company and founder profiles across multiple sources, writes tailored icebreaker paragraphs using AI, and manages multi-step deliverability-monitored campaigns.",
        theProblem: "Generic mass cold emails land in spam folders or get ignored, while manual prospect research and email customization takes 15–20 minutes per contact, making high-quality outbound campaigns prohibitively expensive.",
        theSolution: [
            "Automated prospect scraping based on ICP parameters (industry, revenue, headcount, and hiring signals).",
            "Multi-source data enrichment verifying email MX records, LinkedIn profiles, and recent company news.",
            "AI copywriting agent that analyzes company websites and recent blog posts to generate customized, relevant opening hooks.",
            "Automated deliverability protection that throttles daily sending limits, staggers domain rotation, and pauses campaigns on bounce spikes.",
            "Real-time CRM logging updating prospect status when replies, unsubscribes, or meeting requests are received."
        ],
        architecture: [
            {
                step: "01",
                title: "Prospect Sourcing",
                desc: "n8n scheduled query fetches new verified B2B leads matching target ICP parameters."
            },
            {
                step: "02",
                title: "Live Scraping & Verification",
                desc: "Prospect website scraped for value proposition and recent initiatives; email address checked against MX servers."
            },
            {
                step: "03",
                title: "AI Hook Personalization",
                desc: "GPT-4o crafts a hyper-personalized, 1-2 sentence contextual observation explaining why the outreach is relevant."
            },
            {
                step: "04",
                title: "Campaign Sequence Injection",
                desc: "Validated lead pushed into warmed secondary domain inbox sequences via sending API."
            },
            {
                step: "05",
                title: "Reply Webhook Tracking",
                desc: "Positive responses trigger immediate Slack notifications and auto-pause downstream follow-up steps."
            }
        ],
        engineeringChallenges: [
            {
                title: "Domain Reputation Preservation",
                desc: "Engineered strict domain-level throttling limits (max 25 emails/day/inbox) and real-time bounce monitoring that auto-quarantines inboxes with >2% bounce rates."
            },
            {
                title: "Eliminating Hallucinated Observations",
                desc: "Constrained the personalization prompt to cite only explicit sentences extracted from the target company's website."
            }
        ],
        outcome: "Delivered an automated outbound pipeline producing 64% average open rates and 18.2% qualified positive reply rates across target enterprise accounts.",
        confidentialityNotice: "Outbound target criteria and client domains have been anonymized in accordance with client confidentiality agreements."
    },
    {
        id: "market-intelligence",
        slug: "market-intelligence",
        index: "08",
        title: "Real-Time Market Intelligence System",
        subtitle: "Automated Financial Ticker Monitoring, News Aggregation & Executive Briefings",
        category: "Financial Data · News Intelligence · AI Summarization",
        projectType: "Confidential Client Engagement",
        isConfidential: true,
        image: "n8n-library/market-news-intelligence.jpg",
        imageAlt: "Real-Time Market Intelligence System n8n automation pipeline.",
        imageContain: false,
        metrics: [
            { label: "Briefing Latency", value: "<5m", sub: "Breaking News to Executive Slack" },
            { label: "Noise Reduction", value: "85%", sub: "Irrelevant Stories Filtered" },
            { label: "Data Sources", value: "6 Feeds", sub: "AlphaVantage, NewsAPI, SEC RSS" },
            { label: "Executive Delivery", value: "Daily 8 AM", sub: "Pre-Market Audio & Text Brief" }
        ],
        techStack: [
            "n8n Workflow Automation",
            "Financial Market APIs (AlphaVantage, Yahoo)",
            "News APIs & SEC EDGAR RSS",
            "OpenAI GPT-4o",
            "Slack Webhooks",
            "SendGrid SMTP"
        ],
        overview: "Autonomous financial intelligence engine that continuously monitors public tickers, regulatory filings, and breaking industry news, generating executive-ready bulleted briefings delivered directly to leadership Slack channels prior to market open.",
        theProblem: "Corporate development and investment teams are inundated with thousands of news articles and market alerts daily, making it impossible to separate genuine market signals from speculative noise in time to act.",
        theSolution: [
            "Real-time market data ingestion polling ticker metrics, volatility shifts, and earnings releases.",
            "SEC EDGAR RSS monitor flagging Form 8-K, 10-Q, and insider transaction filings within minutes of release.",
            "AI summarization agent filtering out 85% of redundant press releases and synthesizing actionable impacts on portfolio companies.",
            "Dual delivery cadence: urgent instant Slack alerts for major breaking news and a curated pre-market briefing every morning at 8:00 AM.",
            "Archived intelligence database enabling historical sentiment analysis and executive retrospective searches."
        ],
        architecture: [
            {
                step: "01",
                title: "Multi-Source Polling",
                desc: "Periodic n8n execution fetches price shifts, RSS news, and regulatory filings."
            },
            {
                step: "02",
                title: "Deduplication & Similarity Filter",
                desc: "Embedding clustering groups identical news stories from different syndication wires."
            },
            {
                step: "03",
                title: "Financial Impact Scoring",
                desc: "LLM evaluates relevance against client portfolio holdings, scoring potential impact (1-10)."
            },
            {
                step: "04",
                title: "Executive Synthesis",
                desc: "High-impact items compiled into three crisp bullets: What Happened, Why It Matters, and Strategic Action."
            },
            {
                step: "05",
                title: "Formatted Dispatch",
                desc: "Payload formatted using Slack Block Kit and delivered to dedicated #market-intel channels."
            }
        ],
        engineeringChallenges: [
            {
                title: "Handling Market Wire Flood",
                desc: "During earnings season, thousands of releases hit APIs simultaneously. Implemented batching queues and priority queues to avoid API throttling and memory exhaustion."
            },
            {
                title: "Ensuring Zero Hallucinated Numbers",
                desc: "Engineered strict data validation matching LLM-generated figures against raw API JSON payloads before dispatching to leadership."
            }
        ],
        outcome: "Delivered an automated intelligence pipeline saving executive teams 10+ hours per week while eliminating market blind spots.",
        confidentialityNotice: "Client investment criteria, monitored tickers, and proprietary portfolio compositions are strictly confidential."
    },
    {
        id: "crm-lead-pipeline",
        slug: "crm-lead-pipeline",
        index: "09",
        title: "CRM Lead Pipeline Automation",
        subtitle: "Multi-Channel Ingestion, AI Scoring, Dynamic Assignment & Lifecycle Sync",
        category: "CRM · AI Qualification · Sales Automation",
        projectType: "Confidential Client Engagement",
        isConfidential: true,
        image: "n8n-library/crm-lead-pipeline.jpg",
        imageAlt: "CRM Lead Pipeline Automation workflow diagram in n8n.",
        imageContain: false,
        metrics: [
            { label: "Lead Ingestion Latency", value: "<3s", sub: "Form Submit to CRM Sync" },
            { label: "Lead Qualification Rate", value: "99.8%", sub: "AI Tiered Scoring" },
            { label: "Routing Accuracy", value: "100%", sub: "Territory & Capacity Rules" },
            { label: "Rep Follow-Up Speed", value: "-75%", sub: "Instant Slack Notifications" }
        ],
        techStack: [
            "n8n Workflow Automation",
            "HubSpot / Salesforce API",
            "OpenAI GPT-4o-mini",
            "Clearbit / Data Enrichment",
            "Slack Webhooks",
            "PostgreSQL"
        ],
        overview: "Enterprise-grade lead lifecycle automation system capturing leads across marketing channels, scoring them via AI against historical conversion data, routing them to account executives, and triggering personalized nurture sequences.",
        theProblem: "High-growth sales organizations suffer from manual data entry delays, mismatched lead ownership, slow sales representative follow-up times, and leads falling through cracks between marketing platforms and CRM software.",
        theSolution: [
            "Multi-channel webhook receiver accepting lead payloads from web forms, landing pages, and webinar platforms.",
            "Instant domain and firmographic enrichment extracting company employee size, industry, and funding stage.",
            "AI scoring engine evaluating lead readiness and assigning tiers (Hot, Warm, Cold, Disqualified) with explanatory rationales.",
            "Dynamic round-robin routing assigning high-tier leads to available sales reps based on calendar availability and territory rules.",
            "Real-time Slack notifications alerting account executives with actionable background context within 10 seconds of submission."
        ],
        architecture: [
            {
                step: "01",
                title: "Universal Ingestion Webhook",
                desc: "Receives raw submission data from landing pages, typeforms, and external ads."
            },
            {
                step: "02",
                title: "Data Normalization & Dedup",
                desc: "Validates email formats, cleans company names, and queries CRM for existing duplicate records."
            },
            {
                step: "03",
                title: "Firmographic Enrichment",
                desc: "Fetches company headcount, technology stack, and revenue bracket via enrichment APIs."
            },
            {
                step: "04",
                title: "AI Qualification & Scoring",
                desc: "LLM evaluates submission against target ICP criteria, outputting score and strategic summary."
            },
            {
                step: "05",
                title: "CRM Record Upsert & Assignment",
                desc: "Creates or updates deal record in HubSpot/Salesforce and assigns the correct account executive."
            },
            {
                step: "06",
                title: "Rep Slack Alert & Nurture Launch",
                desc: "Fires direct Slack notification with 1-click meeting booking link and enrolls lead in appropriate nurture flow."
            }
        ],
        engineeringChallenges: [
            {
                title: "Handling Concurrent Duplicate Submissions",
                desc: "When users submit multiple forms in quick succession, race conditions created duplicate CRM contacts. Solved using Redis-backed submission debouncing and atomic upsert locks."
            },
            {
                title: "Complex Territory Routing Rules",
                desc: "Built a configurable JSON rules engine within n8n handling multi-regional territory boundaries, SDR capacity limits, and out-of-office overrides."
            }
        ],
        outcome: "Reduced average sales rep follow-up time from 6 hours to under 8 minutes, boosted lead qualification accuracy, and eliminated all manual data entry.",
        confidentialityNotice: "Client CRM configuration, internal lead scoring formulas, and team structures have been sanitized under NDA."
    },
    {
        id: "instagram-automation",
        slug: "instagram-automation",
        index: "10",
        title: "Instagram Content Automation",
        subtitle: "Autonomous Ideation, Carousel Copywriting, Asset Verification & Scheduled Dispatch",
        category: "Social Media · AI Content Generation · n8n",
        projectType: "Confidential Client Engagement",
        isConfidential: true,
        image: "n8n-library/content-automation-instagram.jpg",
        imageAlt: "Instagram Content Automation workflow in n8n.",
        imageContain: false,
        metrics: [
            { label: "Posting Consistency", value: "100%", sub: "Zero Missed Schedule Dates" },
            { label: "Asset Generation", value: "Autonomous", sub: "Captions, Hooks, Hashtags" },
            { label: "Production Time", value: "-80%", sub: "From 6h/wk to 1h/wk" },
            { label: "Compliance", value: "Meta Graph", sub: "Official Instagram API v19" }
        ],
        techStack: [
            "n8n Workflow Automation",
            "Meta Graph API (Instagram Business)",
            "OpenAI GPT-4o",
            "Airtable (Content Pipeline)",
            "Cloudinary (Media CDN)",
            "Telegram Review Bot"
        ],
        overview: "Autonomous social media production workflow that generates on-brand educational carousels, engaging caption variations, and optimized hashtag sets, managing the complete publishing lifecycle through Meta's official Graph API.",
        theProblem: "Maintaining consistent high-quality social media output requires constant ideation, copywriting, graphic coordination, and manual publishing, frequently leading to creator burnout and sporadic posting schedules.",
        theSolution: [
            "Weekly automated content generation cycling through proven viral hook formats, industry tips, and carousel slide frameworks.",
            "Dynamic caption generator producing hook-first body copy, discussion-prompting questions, and curated hashtag clouds.",
            "Integration with Telegram bot allowing the brand manager to review preview cards on their phone and tap 'Approve' or 'Regenerate'.",
            "Direct scheduling and automated publishing via the official Instagram Graph API without third-party app restrictions.",
            "Performance feedback loop tracking 7-day engagement metrics to inform subsequent AI ideation cycles."
        ],
        architecture: [
            {
                step: "01",
                title: "Weekly Topic Sourcing",
                desc: "n8n queries high-performing themes from Airtable content pillar repository."
            },
            {
                step: "02",
                title: "Carousel & Caption Generation",
                desc: "AI produces multi-slide copy text, primary caption, and tailored hashtag groups."
            },
            {
                step: "03",
                title: "Media Asset Processing",
                desc: "Images uploaded to Cloudinary CDN with correct 4:5 vertical aspect ratios and compression."
            },
            {
                step: "04",
                title: "Mobile Telegram Review",
                desc: "Review bot sends interactive card to creator's phone with visual preview and approval buttons."
            },
            {
                step: "05",
                title: "Meta Graph API Publishing",
                desc: "Approved assets scheduled via Instagram Container API and published at optimal peak-engagement hours."
            }
        ],
        engineeringChallenges: [
            {
                title: "Meta Graph API 2-Step Container Flow",
                desc: "Instagram requires creating an IG Container ID, polling for container readiness status, and issuing a separate publish call. Built reliable asynchronous polling in n8n with exponential backoffs."
            },
            {
                title: "Hashtag Spam Algorithm Penalties",
                desc: "Engineered dynamic rotation selecting 12–15 relevant tags across broad, niche, and community tiers to avoid shadowbans from static copy-pasted blocks."
            }
        ],
        outcome: "Enabled 100% consistent, hands-free posting schedules, saving 20+ hours of creative production each month while expanding organic reach.",
        confidentialityNotice: "Client brand assets, social handles, and private Telegram bot credentials are protected under non-disclosure terms."
    },
    {
        id: "smart-email-retry",
        slug: "smart-email-retry",
        index: "11",
        title: "Smart Email Retry System",
        subtitle: "Fault-Tolerant Transactional Email Dispatch, Dynamic Backoff & Bounce Quarantine",
        category: "Email Reliability · Retry Logic · Delivery Monitoring",
        projectType: "Confidential Client Engagement",
        isConfidential: true,
        image: "n8n-library/email-retry-automation.jpg",
        imageAlt: "Smart Email Retry System workflow architecture in n8n.",
        imageContain: false,
        metrics: [
            { label: "Dispatch Reliability", value: "99.98%", sub: "Sustained Delivery SLA" },
            { label: "Transient Failure Recovery", value: "94%", sub: "Auto-Recovered on Retry" },
            { label: "Bounce Handling", value: "<1s", sub: "Automatic Reputation Shield" },
            { label: "Fallback Redundancy", value: "Dual SMTP", sub: "Postmark + SendGrid" }
        ],
        techStack: [
            "n8n Workflow Automation",
            "Postmark API",
            "SendGrid SMTP Backup",
            "Redis Queue Store",
            "Webhook Callbacks",
            "Slack Ops Alerts"
        ],
        overview: "Mission-critical, fault-tolerant email dispatch infrastructure with smart exponential backoff, transient error categorization, automated secondary-provider fallback, and instant hard-bounce quarantine.",
        theProblem: "Standard transactional email setups drop critical messages (password resets, invoices, verification codes) during transient SMTP timeouts, rate-limit spikes, or downstream mail server disruptions, damaging customer trust.",
        theSolution: [
            "Decoupled queuing system that ingests outgoing transactional emails and guarantees at-least-once delivery.",
            "Intelligent error classification distinguishing between permanent failures (5xx hard bounce) and transient issues (4xx greylisting, timeout).",
            "Configurable exponential backoff with jitter retry schedules (1m, 5m, 15m, 1h) preventing downstream thundering herd problems.",
            "Automatic provider failover routing traffic to a secondary SMTP gateway if the primary provider experiences elevated failure rates.",
            "Live deliverability dashboard and incident Slack alerts notifying DevOps engineers of reputation anomalies."
        ],
        architecture: [
            {
                step: "01",
                title: "Dispatch Queue Ingestion",
                desc: "Application backend forwards transactional message payload to reliable queue endpoint."
            },
            {
                step: "02",
                title: "Primary Delivery Attempt",
                desc: "n8n submits message through primary high-reputation provider (Postmark) with unique message ID."
            },
            {
                step: "03",
                title: "Response Inspection",
                desc: "HTTP response code and provider feedback evaluated; success logs delivery confirmation immediately."
            },
            {
                step: "04",
                title: "Transient Failure Handling",
                desc: "If 4xx or connection timeout occurs, message is scheduled in Redis retry queue with exponential backoff."
            },
            {
                step: "05",
                title: "Secondary Provider Failover",
                desc: "If primary provider fails across 3 attempts, payload is routed automatically through secondary provider."
            },
            {
                step: "06",
                title: "Hard Bounce Quarantine",
                desc: "Hard 5xx bounces instantly quarantine recipient email in global suppressions to protect domain reputation."
            }
        ],
        engineeringChallenges: [
            {
                title: "Preventing Duplicate Deliveries",
                desc: "In distributed network failures, an email may be received by the recipient even if the HTTP acknowledgement drops. Implemented idempotency keys across providers to ensure zero duplicate user emails."
            },
            {
                title: "Throttling Provider Spikes",
                desc: "Engineered rate-limiting buffers that smooth burst traffic (e.g., product launch bursts) within provider threshold limits."
            }
        ],
        outcome: "Achieved 99.98% transactional delivery reliability, recovered 94% of transient network delivery failures, and protected critical sender domain reputation.",
        confidentialityNotice: "Architectural specifications disclosed with sanitized API tokens and client infrastructure identifiers pursuant to NDA."
    },
    {
        id: "whatsapp-outreach",
        slug: "whatsapp-outreach",
        index: "12",
        title: "WhatsApp Outreach Automation",
        subtitle: "Multi-Channel Cadence, Delivery Tracking, Reply Classification & CRM Synchronization",
        category: "WhatsApp · Lead Outreach · CRM Synchronization",
        projectType: "Confidential Client Engagement",
        isConfidential: true,
        image: "assets/whatsapp-outreach-architecture.svg",
        imageAlt: "WhatsApp Outreach Automation system architecture diagram.",
        imageContain: false,
        metrics: [
            { label: "Delivery Success", value: "98.5%", sub: "Verified Phone Outbound" },
            { label: "Response Latency", value: "<2.4s", sub: "Webhook Ingestion to Send" },
            { label: "CRM Sync Accuracy", value: "100%", sub: "Bi-Directional State Machine" },
            { label: "Compliance", value: "Opt-In", sub: "Meta Policy Guardrails" }
        ],
        techStack: [
            "Meta WhatsApp Cloud API",
            "n8n Workflow Engine",
            "PostgreSQL (State Store)",
            "HubSpot / CRM Webhooks",
            "OpenAI GPT-4o-mini",
            "Slack Escalations"
        ],
        overview: "Comprehensive enterprise WhatsApp outbound system executing multi-stage message sequences, tracking delivery and read receipts, categorizing incoming prospect responses, and syncing conversation states with the master CRM.",
        theProblem: "Sales development teams struggling with declining email response rates turn to WhatsApp manually, creating compliance risks, untracked client communications, and missed follow-up deadlines.",
        theSolution: [
            "Automated outreach execution using approved Meta template messages with dynamic customer variable injection.",
            "Smart cadence orchestrator scheduling follow-up steps across 1, 3, and 7-day intervals based on recipient engagement.",
            "Real-time webhook listener capturing sent, delivered, read, and failed status updates.",
            "AI sentiment classifier determining if incoming prospect replies are interested, requesting pricing, or opting out.",
            "Instant rep handoff alerting sales representatives in Slack when a prospect responds positively, allowing immediate human takeover."
        ],
        architecture: [
            {
                step: "01",
                title: "Lead Trigger & Verification",
                desc: "CRM lead enters outreach stage; n8n verifies international phone format and opt-in consent record."
            },
            {
                step: "02",
                title: "Template Validation & Personalization",
                desc: "Approved WhatsApp template populated with customized first name, company, and value offer."
            },
            {
                step: "03",
                title: "Meta Cloud API Dispatch",
                desc: "Secure API call dispatches message via official WhatsApp business number with rate limit safety."
            },
            {
                step: "04",
                title: "Status Webhook Ingestion",
                desc: "Meta webhooks track message delivery lifecycle (sent → delivered → read) and log timestamps to PostgreSQL."
            },
            {
                step: "05",
                title: "Inbound Reply Classification",
                desc: "When the lead responds, AI agent evaluates intent and determines whether to continue sequence or escalate."
            },
            {
                step: "06",
                title: "Bi-Directional CRM Sync",
                desc: "All messages, statuses, and conversation transcripts automatically synchronized with CRM contact timeline."
            }
        ],
        engineeringChallenges: [
            {
                title: "Adhering to Meta 24-Hour Customer Care Window",
                desc: "Engineered state machine checking whether conversations are within the 24-hour window, automatically restricting freeform messages to pre-approved templates when outside the window."
            },
            {
                title: "Immediate Opt-Out Processing",
                desc: "Built instant opt-out keyword recognition (e.g., 'STOP', 'UNSUBSCRIBE') that freezes sequences immediately and updates CRM suppression lists."
            }
        ],
        outcome: "Created a high-engagement, fully compliant mobile outreach channel with 98.5% delivery rates and seamless CRM visibility.",
        confidentialityNotice: "Client names, WhatsApp Business Account IDs, and outreach templates are protected under non-disclosure agreements."
    },
    {
        id: "ai-voice-receptionist",
        slug: "ai-voice-receptionist",
        index: "13",
        title: "AI Voice Receptionist",
        subtitle: "Ultra-Low Latency Conversational Voice Agent, Telephony & Live Calendar Booking",
        category: "Voice AI · Vapi · Calendar Automation",
        projectType: "Confidential Client Engagement",
        isConfidential: true,
        image: "assets/ai-voice-receptionist-architecture.svg",
        imageAlt: "AI Voice Receptionist architecture flow diagram.",
        imageContain: false,
        metrics: [
            { label: "Voice Latency", value: "<650ms", sub: "Real-Time Spoken Turnaround" },
            { label: "Call Coverage", value: "24/7", sub: "Zero Missed Inbound Calls" },
            { label: "Booking Conflicts", value: "0%", sub: "Live Slot Reservation Lock" },
            { label: "Platform", value: "Vapi + Twilio", sub: "Enterprise Telephony Stack" }
        ],
        techStack: [
            "Vapi Voice AI Platform",
            "Twilio SIP Telephony",
            "Deepgram STT (Speech-to-Text)",
            "Cartesia / ElevenLabs TTS",
            "n8n Webhook Integrations",
            "Calendly / Google Calendar"
        ],
        overview: "Ultra-low latency conversational voice receptionist answering inbound telephony phone calls, conversing with callers in human-like voice, qualifying patient or customer intent, and scheduling calendar bookings in real time.",
        theProblem: "Local service businesses and medical clinics miss up to 40% of inbound calls during peak hours or after business closure, losing high-intent customers who immediately dial competing providers.",
        theSolution: [
            "Twilio telephony trunking routing inbound telephone lines directly into an ultra-low latency voice AI pipeline.",
            "Voice-to-voice conversational agent built with Deepgram Nova-2 speech recognition and natural phonetic voice synthesis.",
            "Sub-650ms response turnaround that feels natural, fluid, and handles conversational interruptions seamlessly.",
            "Function tool-calling querying open appointment availability and reserving calendar slots during live conversation.",
            "Automated SMS dispatch delivering appointment confirmation links and clinic directions to callers immediately upon hang-up."
        ],
        architecture: [
            {
                step: "01",
                title: "Inbound Phone Call Ingestion",
                desc: "Twilio telephony receives caller connection and streams audio packets via SIP trunk to Vapi engine."
            },
            {
                step: "02",
                title: "Ultra-Fast Speech-to-Text",
                desc: "Deepgram STT transcribes spoken caller audio in real-time streaming chunks with <250ms latency."
            },
            {
                step: "03",
                title: "LLM Reasoning & Function Calling",
                desc: "Agent evaluates dialogue, determines caller intent, and executes tool calls to query open calendar slots."
            },
            {
                step: "04",
                title: "Calendar Booking Webhook",
                desc: "n8n handles live slot lookup, locks requested time in Google Calendar, and returns confirmation."
            },
            {
                step: "05",
                title: "Natural Voice Synthesis",
                desc: "Cartesia TTS generates high-fidelity conversational audio stream streamed back to caller's ear."
            },
            {
                step: "06",
                title: "Post-Call SMS & Transcript",
                desc: "Call terminates; automated summary sent to staff Slack and confirmation SMS dispatched to caller's mobile."
            }
        ],
        engineeringChallenges: [
            {
                title: "Voice Turn-Taking & Interruption Handling",
                desc: "Configured intelligent voice activity detection (VAD) and phrase endpointing to ensure the agent stops speaking immediately when the user interrupts with a question."
            },
            {
                title: "Pronunciation & Phonetic Spelling",
                desc: "Trained system prompts with phonetic spelling guides for doctor names, complex medical terminology, and street addresses to ensure 100% pronunciation accuracy."
            }
        ],
        outcome: "Achieved 24/7 zero-missed-call availability, automated hundreds of bookings without receptionist intervention, and sustained sub-650ms natural spoken conversations.",
        confidentialityNotice: "Client identity, telephony numbers, and proprietary practice operations remain confidential under enterprise NDA."
    }
];

// Helper to look up a case study by ID or slug
function getCaseStudy(idOrSlug) {
    if (!idOrSlug) return null;
    const clean = idOrSlug.toString().toLowerCase().trim();
    return CASE_STUDIES.find(cs => cs.id.toLowerCase() === clean || cs.slug.toLowerCase() === clean) || null;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CASE_STUDIES, getCaseStudy };
}
