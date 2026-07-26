// projects.ts

export type TagType = "live" | "type" | "status" | string;

export interface Tag {
  label: string;
  type: TagType;
}

export interface Feature {
  title: string;
  desc: string;
}

export interface Metric {
  value: string;
  label: string;
  highlight: boolean;
}

export type ProjectStatus = "Production" | "Development" | "Archived" | string;
export type ProjectCategory = "Machine Learning" | "WebApp" | "AI" | "Backend" | string;
export type ProjectType = "Backend System" | "Frontend App" | "Full Stack" | string;
export type DiagramType = string;

export interface Project {
  id: string;
  num: string;
  name: string;
  category: ProjectCategory;
  href: string;
  image: string;
  status: ProjectStatus;
  year: string;
  role: string;
  type: ProjectType;
  impact: string;
  duration: string;
  sub: string;
  tags: Tag[];
  overview: string;
  problem: string;
  challenges: string[];
  decisions: string[];
  features: Feature[];
  stack: string[];
  metrics: Metric[];
  githubUrl: string;
  demoUrl: string;
  diagramType: DiagramType;
}

export const projects: Project[] = [
  {
    id: "orbitaim-smtp-server",
    num: "01",
    name: "SMTP Server",
    category: "Email Infrastructure",
    href: "/projects/orbitaim-smtp-server",
    image: `${process.env.NEXT_PUBLIC_CDN_URL}/SMTP.png`,
    status: "Production",
    year: "2026",
    role: "Backend Engineer",
    type: "Multi-tenant Email Platform",
    impact:
      "Replaces third-party email services (SendGrid / Mailgun) with an owned, multi-tenant transactional email platform built directly on AWS SES — giving OrbitAIM full control over deliverability, per-tenant reputation, and cost at scale.",
    duration: "3 months",
    sub: "A self-hosted, multi-tenant transactional email platform on FastAPI + AWS SES — domain onboarding, a gated send pipeline backed by SQS, email verification, deliverability analytics, and a live SSE event stream.",
    tags: [
      { label: "Live", type: "live" },
      { label: "FastAPI", type: "type" },
      { label: "AWS SES", type: "type" },
    ],
    overview:
      "OrbitAIM SMTP Server is a production FastAPI backend that turns AWS SES into a full multi-tenant email platform. Each tenant onboards a sending domain and is handed the exact CNAME/MX/TXT DNS records (DKIM, custom MAIL FROM, SPF, DMARC) to publish, then polls until SES verification flips to ready-to-send. Every message goes through a single strict pipeline — verify → suppress → throttle → stamp → send — where the first two are synchronous gates and the rest run asynchronously off an SQS queue, so accepted sends return instantly as queued. Delivery outcomes flow back through SES → SNS webhooks and surface as live Server-Sent Events, tenant-scoped reputation, and aggregated analytics sourced entirely from AWS (Virtual Deliverability Manager + Message Insights).",
    problem:
      "Relying on hosted email providers meant paying per-message fees, having no per-tenant reputation isolation, and being unable to inspect the raw delivery pipeline. OrbitAIM needed its own sending infrastructure — one that could onboard a customer domain end-to-end, enforce verification and suppression before spending SES quota, and report deliverability without a third party in the loop.",
    challenges: [
      "Making sends non-blocking without losing delivery guarantees — the pipeline runs verify → suppress synchronously as hard gates, then hands off throttle → stamp → send to an SQS-backed background consumer so the API responds 'queued' in milliseconds.",
      "Fully automated domain onboarding — provisioning an SES config set, an SNS topic, and a domain identity per tenant, then returning ready-to-paste DKIM/MAIL-FROM/SPF/DMARC DNS records and polling verification status.",
      "Two-tier email verification — a synchronous 'soft' check (syntax, disposable-domain, MX, known-invalid registry, tenant suppression list) and an async 'hard' check that adds SES address insights and returns a pollable job id.",
      "Sourcing all analytics from AWS rather than a local counter — routing between Message Insights (single message), SES bulk export jobs (per-campaign, up to ~90s), and Virtual Deliverability Manager (fast tenant-wide time series) based purely on which fields the caller supplies.",
      "Streaming pipeline + SES webhook events live to browsers over SSE with keep-alive framing, while EventSource can only issue GET with no custom headers.",
    ],
    decisions: [
      "AWS SES as the sending substrate with everything else built in-house — reuses existing AWS IAM and keeps all mail data inside the AWS boundary while owning the pipeline logic.",
      "SQS between accept and send — decouples the request lifecycle from SES rate limits, gives natural throttling, and keeps the send route fast and idempotent via a caller-supplied unique message_id.",
      "Caller-generated system-wide-unique message_id as the join key — the same id is later used for /pipeline/status and /analytics, so no server-side id reconciliation is needed.",
      "100% AWS-sourced analytics (VDM + Message Insights) instead of a local metrics table — a single source of truth for delivery, bounces, complaints, opens, and clicks.",
      "Per-tenant SES config set + SNS topic — isolates reputation and event routing so one tenant's bounce rate never contaminates another's.",
      "asyncpg pool with a singleton DatabaseManager and SQS consumer tasks started/stopped inside the FastAPI lifespan for clean startup and shutdown.",
    ],
    features: [
      { title: "Automated Domain Onboarding", desc: "POST /onboarding/domain provisions an SES config set + SNS topic, registers the domain identity, and returns the exact CNAME/MX/TXT records (DKIM, custom MAIL FROM, SPF, DMARC) to publish. A status endpoint polls SES until ready_to_send flips true." },
      { title: "Gated Send Pipeline", desc: "POST /pipeline/send is the only send route. It runs verify → suppress as strict synchronous gates, then queues throttle → stamp → send to SQS — returning queued:true instantly and stopped_at on gate rejection." },
      { title: "Soft & Hard Email Verification", desc: "Synchronous soft verification (syntax, disposable-domain, MX, known-invalid registry, tenant suppression) and an async hard tier that adds SES address insights and returns a pollable job id." },
      { title: "AWS-Sourced Analytics", desc: "POST /analytics returns sent/delivered/bounced/complained/opens/clicks and rates, auto-routing between Message Insights, SES bulk export, and Virtual Deliverability Manager (with a day-by-day time series) based on the fields supplied." },
      { title: "Live Event Stream (SSE)", desc: "GET /events/live is a Server-Sent Events feed of pipeline + SES webhook activity (queued, verify-failed, suppressed, Delivery, Bounce, Complaint, Open, Click) as it happens, optionally filtered by tenant." },
      { title: "SES Reputation & Account Health", desc: "GET /health/aws and /account expose system-wide and per-tenant sending status, enforcement state, quotas, and bounce/complaint rates — pulled straight from SES with no local DB dependency." },
      { title: "Suppression & Unsubscribe Handling", desc: "Per-tenant suppression lists and unsubscribe routes keep known-bad and opted-out addresses out of the send path before any SES quota is spent." },
    ],
    stack: ["Python", "FastAPI", "Pydantic", "AWS SES", "AWS SQS", "AWS SNS", "PostgreSQL", "asyncpg", "boto3", "Server-Sent Events", "dnspython", "email-validator", "AWS Secrets Manager", "uvicorn"],
    metrics: [
      { value: "13",      label: "API Endpoints",                     highlight: false },
      { value: "Multi",   label: "Tenant Domain Isolation",           highlight: true  },
      { value: "5-stage", label: "Send Pipeline (verify→suppress→throttle→stamp→send)", highlight: true  },
      { value: "SQS",     label: "Async Send Queue",                  highlight: false },
      { value: "2-tier",  label: "Email Verification (soft / hard)",  highlight: false },
      { value: "SSE",     label: "Live Event Streaming",              highlight: false },
    ],
    githubUrl: "https://github.com/avneeshrai07/orbitaim_SMTP_server",
    demoUrl: "https://smtpserver.miatibro.art",
    diagramType: "pipeline",
  },
    {
    id: "news-scraper-lead-engine",
    num: "02",
    name: "News Scraper & Lead Intelligence Engine",
    category: "AI / Data Engineering",
    href: "/projects/news-scraper-lead-engine",
    image: `${process.env.NEXT_PUBLIC_CDN_URL}/news_scraper.png`,
    status: "Production",
    year: "2024",
    role: "Backend & ML Engineer",
    type: "Automation Pipeline",
    impact:
      "Replaces manual business-development research across 16 Indian news outlets with a fully automated pipeline — extracting structured lead intelligence from hundreds of articles per run without human intervention.",
    duration: "6 months",
    sub: "Built an async Python pipeline that aggregates business news from RSS feeds and Vertex AI Search, scrapes articles via Tor, classifies leads with Bedrock LLMs, enriches company data, performs semantic deduplication using embeddings, and stores structured results in PostgreSQL.",
    tags: [
      { label: "Live", type: "live" },
      { label: "AI / LLM", type: "type" },
      { label: "Web Scraping", type: "type" },
    ],
    overview:
      "A fully automated, asynchronous news-intelligence pipeline built in Python. It ingests articles from 20 RSS feeds (The Hindu, Zee News, Hindustan Times, India TV, Times of India, ET Now, Indian Express, PR Newswire) and Google Vertex AI Discovery Search. Each article is full-text scraped via a Tor hidden-service API, then passed through a two-stage AWS Bedrock (Nova Lite) LLM pipeline: first to classify whether it is a business lead, then to extract structured entities (companies, contacts, signals, project details). Confirmed leads are enriched with LinkedIn data via Unipile. Article summaries and categories are generated by Bedrock, keywords by YAKE. Every article summary is embedded with Alibaba-NLP/gte-large-en-v1.5 (1024-dim) and stored in a pgvector store in PostgreSQL to detect semantically similar prior coverage. Results are fanned out across a normalised 14-table schema.",
    problem:
      "Business development teams spend hours every day manually scanning dozens of Indian news outlets to find companies announcing funding rounds, tech initiatives, and leadership changes — events that represent actionable sales or partnership opportunities. The process is slow, non-scalable, and produces unstructured output that is hard to act on.",
    challenges: [
      "Reliable full-text scraping across news sites with varied anti-bot measures — solved with a Tor-routed onion-service scraper that classifies SOCKS errors (TTL expiry 0x06, host-down 0x01, connection refused 0x05) and auto-restarts the Tor circuit only when genuinely needed.",
      "Semantic deduplication across a growing article store without an O(n²) comparison — solved by embedding each summary (1024-dim) and running a threshold cosine-similarity query directly in PostgreSQL via pgvector.",
      "Extracting structured JSON (companies, contacts, project details) from unstructured LLM output reliably — Pydantic validation is enforced at parse time on every Bedrock response, with graceful fallback defaults.",
      "Long news articles that exceed the sentence-transformer's safe token window — solved with overlapping chunking and re-normalised embeddings across all chunks.",
      "Coordinating async DB pool lifecycle, port binding, and graceful shutdown across a single-process asyncio app — handled with a singleton DatabaseManager with exponential-backoff retry and a dedicated port-lock socket.",
    ],
    decisions: [
      "Tor onion-service (SOCKS5h) over direct scraping — eliminates per-request billing and reduces TLS fingerprinting exposure.",
      "Two-stage LLM calls (classify → extract) rather than one — saves tokens on the ~60% of articles that are not leads; the extraction stage only fires for confirmed leads.",
      "Amazon Bedrock (Nova Lite) over OpenAI — reuses existing AWS IAM/credential infrastructure and keeps all data within the AWS boundary.",
      "PostgreSQL + pgvector over a dedicated vector store (Pinecone/Weaviate) — keeps lead metadata and vectors co-located, eliminates a network hop, and allows JOIN-based retrieval.",
      "YAKE (unsupervised keyword extraction) for article keywords — zero latency, zero cost, sufficient quality for downstream tagging.",
    ],
    features: [
      { title: "Dual-source Ingestion", desc: "Collects articles from 20 RSS feeds across 16 Indian news outlets and from Google Vertex AI Discovery Search using configurable search terms stored in PostgreSQL. Both sources write to the same flat JSON staging file with deduplication." },
      { title: "Tor-routed Full-text Scraping", desc: "Routes each article URL through a remote onion-service scraper API. Distinguishes TTL-expiry (0x06), host-down (0x01), and unreachable (0x04) SOCKS errors, applies targeted retry/circuit-restart logic per error class, and records scraper diagnostics in the DB for monitoring." },
      { title: "Two-stage LLM Lead Pipeline", desc: "Stage 1 (classification): Bedrock Nova Lite determines whether the article is a business lead, returning confidence (HIGH/MEDIUM/LOW) and structured reasons. Stage 2 fires only for confirmed leads — extracting companies, contacts, business signals, project details, funding sources, and stated goals." },
      { title: "Unipile Company Enrichment", desc: "For each extracted company, Unipile is queried to resolve LinkedIn profile URL, logo, website, employee count range, and headquarters city/country. Enriched data is merged into the company record before DB insertion." },
      { title: "Semantic Deduplication with pgvector", desc: "Each confirmed-lead article summary is embedded with Alibaba-NLP/gte-large-en-v1.5 (1024-dim). The embedding is compared against all existing vectors in PostgreSQL via pgvector cosine similarity; near-duplicate articles are stored as 'similar' rather than 'unique'." },
      { title: "Normalised 14-table PostgreSQL Schema", desc: "Articles fan out across primary, main, full-news, vectors, category, keywords, and search-term tables — plus leads-summary, lead-companies, lead-contacts, lead-signals, lead-projects, processed, and failed tables — enabling granular querying and per-stage failure tracking." },
    ],
    stack: ["Python 3.11", "asyncio", "Pydantic v2", "asyncpg", "PostgreSQL", "pgvector", "Amazon Bedrock (Nova Lite)", "Sentence Transformers — GTE-Large-en-v1.5", "Tor / SOCKS5h", "YAKE", "feedparser", "Google Vertex AI Discovery Search", "Unipile API", "AWS Secrets Manager", "python-dotenv", "filelock", "pytz"],
    metrics: [
      { value: "16",      label: "News Sources Integrated",              highlight: true  },
      { value: "20",      label: "RSS Feeds Monitored",                  highlight: false },
      { value: "1024",    label: "Vector Embedding Dimensions",          highlight: false },
      { value: "2-stage", label: "LLM Pipeline Architecture",            highlight: true  },
      { value: "14",      label: "Normalised DB Tables",                 highlight: false },
      { value: "100+",    label: "Articles Processed per Engine Run",    highlight: false },
    ],
    githubUrl: "https://github.com/avneeshrai07/NEWS_SCRAPER_new",
    demoUrl: "https://github.com/avneeshrai07/NEWS_SCRAPER_new",
    diagramType: "pipeline",
  },
  {
    id: "optibuild-python",
    num: "03",
    name: "OptiBuild",
    category: "Structural Engineering Automation",
    href: "/projects/optibuild-python",
    image: `${process.env.NEXT_PUBLIC_CDN_URL}/optibuild.png`,
    status: "Production",
    year: "2025",
    role: "Backend Engineer",
    type: "REST API / Automation Engine",
    impact:
      "Reduces manual STAAD.Pro model creation from hours to seconds for portal-frame industrial steel buildings, enabling engineers to iterate on building designs instantly.",
    duration: "1 year",
    sub: "Flask REST API that auto-generates STAAD.Pro command files and Excel calculation sheets for industrial steel buildings using Indian and American load codes.",
    tags: [
      { label: "Live", type: "live" },
      { label: "Flask API", type: "type" },
    ],
    overview:
      "OptiBuild is a Python/Flask REST API that automates the generation of STAAD.Pro structural analysis models for portal-frame industrial steel buildings. An engineer POSTs parametric building data — dimensions, roof type, bay layout, and wind/seismic parameters — and receives back a complete STAAD command file plus an Excel calculation sheet. The system supports both 3D full-building models (/submit) and 2D cross-section frames (/submit_2D), running Flask 3.1.1 deployed as a systemd service on AWS.",
    problem:
      "Structural engineers spend hours hand-authoring STAAD.Pro input files for every new portal-frame building project. The geometry, member connectivity, and load combinations must be recalculated from scratch each time, making the process slow, error-prone, and hard to standardise across a team.",
    challenges: [
      "Computing accurate 3D node coordinates for compound configurations: offset apex, internal columns (IC), canopies, cranes, and mezzanines — each adding new geometry layers.",
      "Supporting both Indian (IS 875 / IS 1893) and American (ASCE 7) wind and seismic load code pathways with differing pressure factors, importance factors, and terrain categories.",
      "Handling fully dynamic bay spacing where each sidewall and endwall bay can have a different width, while keeping node indexing consistent.",
      "Designing a composable NodeMaker → MemberMaker → StaadProcessor pipeline so optional features (cranes, canopies, mezzanines) can be toggled independently without breaking the rest of the model.",
      "Providing actionable structured error responses that distinguish input-validation failures from runtime errors, and persisting full context (inputs + traceback) to AWS S3 for post-mortem analysis.",
    ],
    decisions: [
      "Flask over FastAPI — dependency-minimal on the self-hosted runner, matching the team's existing Python toolchain.",
      "Geometry separated into discrete NodeMaker sub-packages (ground, eve, apex, brick, IC, canopy, crane, mezz, roof-monitor, cross-bracing) so each segment is independently testable and composable.",
      "openpyxl for Excel output alongside the STAAD command file — matches the sign-off workflow engineers already use for design review.",
      "boto3 + AWS S3 to persist error logs and output files — multi-user concurrent access with no file contention on the server.",
      "GitHub Actions → self-hosted runner → systemd restart on every push to main — continuous delivery without a container layer.",
    ],
    features: [
      { title: "3D & 2D Model Generation", desc: "Two endpoints — /submit for full 3D STAAD models and /submit_2D for 2D portal-frame cross-sections — sharing the same parametric input schema." },
      { title: "Multi-Roof Type Support", desc: "Handles gable and offset-apex roof geometries with per-side configurable slopes and custom apex positions." },
      { title: "Composable Structural Add-ons", desc: "Canopies, overhead cranes, mezzanine floors, internal columns (IC), and roof monitors are optional features that stack cleanly onto any base building." },
      { title: "Dual Load Code Engine", desc: "Full Indian (IS 875 / IS 1893) and American (ASCE 7) wind, seismic, and load-combination pathways, selectable per request via calculation_type." },
      { title: "Dynamic Bay Spacing", desc: "Accepts uniform or fully custom bay-width arrays for sidewalls and endwalls independently, with automatic cross-bracing layout adjustment." },
      { title: "Excel Calculation Sheet Output", desc: "Produces a structured openpyxl workbook alongside the STAAD command text so engineers can review calculations without leaving their existing tools." },
      { title: "Structured Error Reporting", desc: "Returns typed JSON error responses distinguishing InputError (400) from runtime failures (500), with full inputs and tracebacks written to timestamped log files on AWS S3." },
    ],
    stack: ["Python", "Flask", "NumPy", "Pandas", "openpyxl", "boto3 / AWS S3", "Gunicorn", "GitHub Actions", "systemd"],
    metrics: [
      { value: "50+",   label: "Buildings Generated",                  highlight: false },
      { value: "3.1.1", label: "Production API Version",               highlight: false },
      { value: "2",     label: "Structural Codes (Indian & American)",  highlight: true  },
      { value: "< 5s",  label: "Full 3D Model Generation Time",        highlight: true  },
    ],
    githubUrl: "https://github.com/abhinav-tyagi03/optibuild-python",
    demoUrl: "https://optibuild.orbitaim.io/",
    diagramType: "architecture",
  },
  {
    id: "cold-email-python-orbit",
    num: "04",
    name: "Cold E-Mailer",
    category: "AI Automation",
    href: "/projects/cold-email-python-orbit",
    image: `${process.env.NEXT_PUBLIC_CDN_URL}/cold_email.png`,
    status: "Production",
    year: "2025",
    role: "Backend Engineer",
    type: "AI SaaS API",
    impact:
      "Eliminates manual prospect research by autonomously generating hyper-personalized cold emails, LinkedIn messages, and WhatsApp messages using real-time data — covering all outreach channels from a single API call.",
    duration: "6 months",
    sub: "AI-powered B2B cold outreach engine that researches prospects in real-time and generates personalized emails, LinkedIn messages, and WhatsApp messages via a production FastAPI backend.",
    tags: [
      { label: "Production", type: "live" },
      { label: "FastAPI", type: "type" },
      { label: "Python", type: "type" },
      { label: "Gemini 2.5", type: "type" },
    ],
    overview:
      "Orbit Cold Mailer is a production FastAPI backend that orchestrates multi-channel B2B cold outreach. It ingests buyer profiles and seller context, runs AI research using Tavily web search and LinkedIn post analysis, and generates hyper-personalized cold emails, LinkedIn messages, WhatsApp messages, and follow-up emails — each on its own dedicated route. The system supports multiple LLM backends (Gemini Flash, OpenAI GPT, AWS Bedrock) behind a unified router and streams real-time research progress via WebSocket.",
    problem:
      "Sales teams spend hours researching a prospect only to send a cold email that still ends up generic. There is no scalable way to produce outreach that references a prospect's real recent activity, business pain points, and company-specific context while staying concise, natural, and conversion-focused across email, LinkedIn, and WhatsApp.",
    challenges: [
      "Orchestrating multi-step AI research (LinkedIn analysis, company insights) inside a single API request without hitting timeout limits.",
      "Supporting Gemini, GPT, and AWS Bedrock with transparent failover so prompts never need to change across providers.",
      "Managing 12 Tavily API keys with automatic rotation to prevent rate-limit failures during high traffic.",
      "Streaming incremental research progress in real-time via WebSocket while async pipeline tasks run concurrently.",
      "Mapping heterogeneous buyer/seller input into a strict Pydantic model before passing to the LLM pipeline.",
      "Preventing hallucinations in generation — only facts explicitly present in the prompt may appear in the output.",
    ],
    decisions: [
      "FastAPI over Flask — native async/await support enables concurrent research tasks without thread-pool overhead.",
      "Pydantic models at every layer — input validation, LLM structured output, and company insights — for end-to-end type safety.",
      "LLM router abstraction built so Gemini, GPT, and Bedrock are interchangeable without touching any prompt or business logic.",
      "Tavily multi-key pool implemented as an ordered failover list so one exhausted key never blocks a live request.",
      "WebSocket route added alongside REST endpoints to push each research step to the client without polling.",
      "Email prompt engineered with an explicit no-hallucination rule so the model can only use data provided in the context.",
    ],
    features: [
      { title: "Cold Email Generation", desc: "Generates personalized B2B cold emails via /cold-email with AI-researched buyer context, banned-word enforcement, and a strict no-hallucination guarantee." },
      { title: "LinkedIn Message Generation", desc: "Produces concise sub-500-character messages via /cold-message, tailored to the buyer's profile and recent company activity." },
      { title: "WhatsApp Message Generation", desc: "Creates WhatsApp-ready outreach via /cold-whatsapp using the same research-first pipeline as cold email." },
      { title: "Follow-up Email Engine", desc: "Generates contextual follow-ups via /followup that reference the original subject and body for thread continuity." },
      { title: "Real-time WebSocket Streaming", desc: "Pushes each research step as a live chunk to the client over WebSocket so the UI updates while the pipeline is still running." },
      { title: "Multi-LLM Router", desc: "Unified abstraction routing to Gemini Flash, OpenAI GPT, or AWS Bedrock with automatic failover between providers." },
      { title: "Tavily Web Research with Key Pooling", desc: "Runs date-scoped advanced web searches using a 12-key Tavily pool — failed keys are skipped automatically so research never stalls." },
      { title: "LinkedIn Insight Extraction", desc: "Parses buyer and company LinkedIn activity to extract buying intent, opportunities, sentiment, writing style, and mentioned technologies." },
    ],
    stack: ["Python", "FastAPI", "Pydantic", "Google Gemini 2.5 Flash", "OpenAI GPT", "AWS Bedrock", "LangChain", "Tavily", "PostgreSQL", "asyncpg", "WebSocket", "uvicorn"],
    metrics: [
      { value: "4",  label: "Outreach Channels (Email, LinkedIn, WhatsApp, Follow-up)", highlight: true  },
      { value: "12", label: "Tavily API Keys in Rotation",                               highlight: false },
      { value: "3",  label: "LLM Providers Supported (Gemini, GPT, Bedrock)",            highlight: true  },
      { value: "5",  label: "Async Research Steps per Request",                          highlight: false },
    ],
    githubUrl: "https://github.com/avneeshrai07/cold-email-python-orbit",
    demoUrl: "https://github.com/avneeshrai07/cold-email-python-orbit",
    diagramType: "flowchart",
  },
  {
    id: "orbit-python-data",
    num: "05",
    name: "Data Warehouse",
    category: "Backend / Data Infrastructure",
    href: "/projects/orbit-python-data",
    image: `${process.env.NEXT_PUBLIC_CDN_URL}/orbit_data_python.png`,
    status: "Production",
    year: "2025",
    role: "Backend Engineer",
    type: "B2B Lead Intelligence API",
    impact:
      "Powers real-time lead enrichment and prospect search for sales teams across a PostgreSQL warehouse of email-to-LinkedIn mapped records.",
    duration: "6+ months",
    sub: "A production FastAPI microservice that serves B2B lead and company data from a PostgreSQL warehouse, with AWS CloudWatch logging and on-demand LinkedIn scraping.",
    tags: [
      { label: "Live", type: "live" },
      { label: "FastAPI", type: "type" },
    ],
    overview:
      "orbit-python-data is the data backbone for B2B prospecting. It queries a PostgreSQL warehouse of lead profiles (email-to-LinkedIn mapped) and company profiles, supports multi-filter paginated search across 8 dimensions, and enriches company data on cache miss via an external LinkedIn scraper microservice. Structured JSON logs are shipped to AWS CloudWatch with IST timestamps for auditability. Secrets are loaded from AWS Secrets Manager at startup. Deployed to a self-hosted runner via GitHub Actions.",
    problem:
      "Sales teams needed a fast, filterable API to retrieve and enrich B2B leads from a large PostgreSQL warehouse of email-to-LinkedIn mapped records, while also resolving and enriching company profiles on demand — without hitting the scraper redundantly for domains already stored in the local database.",
    challenges: [
      "Managing an async asyncpg connection pool safely across a high-concurrency FastAPI app, including health checks and exponential-backoff retry on startup failure.",
      "Preventing duplicate company inserts from concurrent requests before the first insert completes.",
      "Building a single parameterized SQL query supporting up to 8 optional filter dimensions (LinkedIn URL, email, name, country, domain, job title, company name, employee count, industry) without SQL injection risk.",
      "Shipping structured JSON logs with IST timestamps while stripping invalid UTF-16 surrogate codepoints and never letting a logging failure crash the application.",
      "Integrating an external scraper microservice with graceful error propagation when the scraper returns 504/505 status codes.",
    ],
    decisions: [
      "asyncpg pool with a singleton DatabaseManager protected by an asyncio.Lock to prevent pool duplication under concurrent lifespan startup.",
      "Raw parameterized queries with a manual $N counter instead of an ORM — full control over generated SQL and no N+1 risks on JOINs.",
      "DB-first, scrape-second, insert-third flow in /get_basicCompanyDetails to avoid redundant scraper calls for already-stored domains.",
      "SafeJSONFormatter that delegates IST time formatting and strips surrogates before json.dumps, so logs are always valid UTF-8 JSON in CloudWatch.",
      "All secrets (DB credentials, AWS keys) loaded from AWS Secrets Manager via boss_env.py before any dependent module import, rather than relying on environment variables.",
      "Redis caching and JWT auth middleware kept wired but commented out, so they can be re-enabled without structural changes when needed.",
    ],
    features: [
      { title: "Multi-filter Lead Search", desc: "POST /fetch_data_v2 accepts LinkedIn URL, email, name, country, domain, job title, company name, employee count range, and industry — all combinable, paginated (page/page_size), and safe against SQL injection via asyncpg parameterization." },
      { title: "On-demand Company Enrichment", desc: "POST /get_basicCompanyDetails checks the DB first; on a miss it calls the orbit-data scraper microservice, persists the enriched LinkedIn company profile, and returns it — deduplicating scraper calls for known domains." },
      { title: "Company Name Resolution", desc: "POST /get_company_by_name resolves fuzzy company names (case-insensitive) to structured LinkedIn profiles via DB lookup, falling back to the scraper and inserting new records automatically." },
      { title: "Filter Value Suggestions", desc: "POST /filter-values returns distinct values for filterable columns (company_name, job_title, industry, city, country, hashtags) to power autocomplete dropdowns in the frontend." },
      { title: "Universal Search", desc: "POST /universal_search performs a full-text keyword search across the leads warehouse with page/page_size pagination." },
      { title: "Async Connection Pool with Health Checks", desc: "DatabaseManager maintains an asyncpg pool (2–20 connections, statement_cache_size=1000) with active health checks (SELECT 1) and up to 5 exponential-backoff retries on startup." },
      { title: "Structured CloudWatch Logging", desc: "JSON logs with IST timestamps and full exception stacks are shipped to AWS CloudWatch log group logs/data_logger via a custom CloudWatchLogHandler that auto-refreshes sequence tokens." },
      { title: "AWS Secrets Manager Integration", desc: "boss_env.py pulls the prod/orbit secret bundle from AWS Secrets Manager at process startup, injecting DB credentials and API keys into the environment before any module that needs them is imported." },
    ],
    stack: ["Python 3.10", "FastAPI", "asyncpg", "PostgreSQL", "Pydantic v2", "aiohttp", "boto3 / AWS CloudWatch", "AWS Secrets Manager", "uvicorn", "redis[async]", "PyJWT", "psycopg2-binary", "GitHub Actions", "systemd"],
    metrics: [
      { value: "8",     label: "API Endpoints",                  highlight: false },
      { value: "20",    label: "Max DB Pool Connections",        highlight: true  },
      { value: "3",     label: "PostgreSQL Tables Queried",      highlight: false },
      { value: "60s",   label: "Scraper Request Timeout",        highlight: false },
      { value: "5",     label: "DB Startup Retry Attempts",      highlight: false },
      { value: "v2.2.5", label: "Current API Version",          highlight: true  },
    ],
    githubUrl: "https://github.com/abhinav-tyagi03/orbit-python-data",
    demoUrl: "https://orbit-data.miatibro.art",
    diagramType: "flowchart",
  },
  {
    id: "deep-research-agentic",
    num: "06",
    name: "Deep Research",
    category: "AI / Research Automation",
    href: "/projects/deep-research-agentic",
    image: `${process.env.NEXT_PUBLIC_CDN_URL}/deep_reasearch.png`,
    status: "Production",
    year: "2026",
    role: "Backend & AI Engineer",
    type: "Agentic Research API",
    impact:
      "Automates end-to-end web research — turning a single natural-language query into a source-attributed Markdown report — through two engines: a staged multi-round research pipeline and a tool-calling agent that plans and iterates on its own.",
    duration: "3 months",
    sub: "A FastAPI research service that decomposes a query, runs iterative web + LinkedIn searches, scores coverage gaps with Claude on Bedrock, and writes a structured Markdown report — offered as both a fixed-depth pipeline and an autonomous agentic loop.",
    tags: [
      { label: "Live", type: "live" },
      { label: "Agentic", type: "type" },
      { label: "FastAPI", type: "type" },
      { label: "Claude / Bedrock", type: "type" },
    ],
    overview:
      "Deep Research is a FastAPI backend that conducts comprehensive web-based research from a single query. It ships two complementary engines. The first is a deterministic multi-stage pipeline (POST /deep-research) with three depth levels — Shallow, Intermediate, Deep — that parses intent into research targets, routes each target to a person / company / generic workflow, then loops through analysis rounds where Claude (via AWS Bedrock) extracts NoteItem facts, scores coverage per purpose (FULFILLED / PARTIAL / UNFULFILLED), and generates fresh Tavily queries to close identified gaps before formatting everything into a Markdown report. The second, added on the agentic branch, is a true tool-calling agent (POST /agent): Claude Haiku 4.5 runs an autonomous loop (up to 20 iterations) with five LangChain StructuredTools bound — web_search, page_fetcher, company_profile, person_profile, and person_experience — planning its own tool calls until it has enough to synthesise a sourced answer.",
    problem:
      "Thorough research on a person, company, or topic means running many searches, reading full pages, cross-referencing LinkedIn, and tracking what's still unknown — slow, manual, and inconsistent. A single LLM call can't do it: it hallucinates, has no live data, and no notion of coverage gaps. The system needed to gather real web and LinkedIn data, reason about what's still missing, and iterate — either along a predictable depth budget or by letting the model drive its own tool use.",
    challenges: [
      "Modelling research as iterative gap-closing rather than a single pass — each round scores coverage per purpose and generates targeted follow-up queries, so depth is a budget (Shallow/Intermediate/Deep) rather than a fixed prompt.",
      "Building a tool-calling agent loop over Bedrock — binding five async tools as LangChain StructuredTools, matching model tool calls by name, invoking them via .ainvoke(), and capping runaway iteration at 20 rounds.",
      "Routing each research target to the right workflow (person vs company vs generic) and, for people, chaining person_profile → person_experience using the LinkedIn URL returned by the first call.",
      "Filtering noisy web results down to signal — keeping only Tavily hits above a 0.9 confidence threshold, matching keywords, and deduplicating already-covered topics.",
      "Semantic classification of LinkedIn posts with an MPNet SentenceTransformer (CPU-only PyTorch) for keyword extraction, kept lightweight enough to run alongside the API.",
      "Per-stage LLM routing — intent, shallow, intermediate, deep, markdown, and agentic stages each resolve their own model id from AWS Secrets Manager, so models can be tuned per stage without code changes.",
    ],
    decisions: [
      "Two engines behind one service — a deterministic staged pipeline for predictable cost/latency, and an autonomous agent for open-ended queries — sharing the same tools and data sources.",
      "Claude on AWS Bedrock across all stages — reuses existing AWS auth and keeps data in-boundary, with a different model tunable per stage via Secrets Manager.",
      "LangChain StructuredTool wrappers with a name→tool registry, so the agent loop and any direct call resolve and invoke tools uniformly (Pydantic args in, JSON out).",
      "Coverage scoring with explicit FULFILLED / PARTIAL / UNFULFILLED states drives query generation — the pipeline stops spending search budget once purposes are fulfilled.",
      "Confidence-threshold + keyword + dedup filtering on Tavily results to keep only high-signal sources before they reach the LLM.",
      "All secrets (Tavily keys, model ids, LinkedIn API creds) loaded from AWS Secrets Manager (prod/orbit) at startup rather than committed env values.",
    ],
    features: [
      { title: "Autonomous Agentic Loop", desc: "POST /agent runs Claude Haiku 4.5 in a tool-calling loop (up to 20 iterations) with five bound tools — it plans which tools to call, reads pages, cross-references LinkedIn, and synthesises a sourced answer without a fixed script." },
      { title: "Three-Depth Research Pipeline", desc: "POST /deep-research supports Shallow, Intermediate, and Deep levels — each adds another analysis + search round, so callers trade latency and cost for thoroughness explicitly." },
      { title: "Intent Decomposition", desc: "A query is parsed into a structured ResearchIntent — discrete research targets and purposes — which drives routing and gives every later stage something concrete to score against." },
      { title: "Coverage Gap Scoring", desc: "Each round has Claude score every purpose as FULFILLED / PARTIAL / UNFULFILLED and emit new SearchQuery objects aimed only at the gaps, turning research into measurable gap-closing." },
      { title: "Person / Company / Generic Workflows", desc: "Stage 0 routes each target to a specialised workflow — LinkedIn person profile + post analysis, company profile + posts, or generic Tavily web search." },
      { title: "Five Research Tools", desc: "web_search, page_fetcher (clean full-text extraction), company_profile and person_profile / person_experience (OrbitAIM LinkedIn data) — shared by both the agent and the pipeline." },
      { title: "MPNet Semantic Classification", desc: "LinkedIn posts are classified via an MPNet SentenceTransformer for keyword extraction, running on CPU-only PyTorch alongside the API." },
      { title: "Source-Attributed Markdown Reports", desc: "All accumulated NoteItem facts and findings are formatted into a readable Markdown report with per-fact source URLs." },
    ],
    stack: ["Python", "FastAPI", "Pydantic", "AWS Bedrock (Claude Haiku / Sonnet / Opus)", "LangChain", "Tavily", "PyTorch", "SentenceTransformers (MPNet)", "aiohttp", "boto3", "AWS Secrets Manager", "uvicorn"],
    metrics: [
      { value: "2",     label: "Engines (Staged Pipeline + Agent)", highlight: true  },
      { value: "3",     label: "Research Depth Levels",             highlight: false },
      { value: "5",     label: "Bound Agent Tools",                 highlight: true  },
      { value: "20",    label: "Max Agent Iterations",              highlight: false },
      { value: "0.9",   label: "Result Confidence Threshold",       highlight: false },
    ],
    githubUrl: "https://github.com/avneeshrai07/deep_research/tree/agentic",
    demoUrl: "https://github.com/avneeshrai07/deep_research/tree/agentic",
    diagramType: "flowchart",
  },
  {
    id: "orbitaim-workflows",
    num: "07",
    name: "Agentic Workflows",
    category: "Workflow Orchestration",
    href: "/projects/orbitaim-workflows",
    image: `${process.env.NEXT_PUBLIC_CDN_URL}/workflows_1.png`,
    status: "Production",
    year: "2026",
    role: "Backend Engineer",
    type: "Async Pipeline Engine / SDK",
    impact:
      "Turns multi-step cold-email campaign automations into composable, drag-to-connect nodes — letting non-authors assemble end-to-end outreach pipelines from a UI while developers add new capabilities in a single file with zero boilerplate.",
    duration: "2 months",
    sub: "A modular async pipeline engine with a typed SDK where nodes, flows, and workflows are defined in single files, compiled to a DAG, and executed in parallel with human-in-the-loop checkpoints.",
    tags: [
      { label: "Production", type: "live" },
      { label: "FastAPI", type: "type" },
      { label: "Async Engine", type: "type" },
    ],
    overview:
      "OrbitAIM Workflows is an async pipeline engine for orchestrating multi-step cold-email campaigns. It is built in two layers: an immutable core engine (a PipelineGraph → PipelineExecutor that runs nodes in topological layers with parallel asyncio.gather) and a developer-facing SDK that compiles down to it. Developers write a node as a single file — Pydantic input/output schemas, the API call, and auto-registration co-located — and compose nodes into flows and flows into workflows using a `>>` operator that auto-wires matching fields by name. From the user's perspective everything is just a node: they discover units via GET /nodes, ask what a node can connect to, and POST /run to execute one node or a connected pipeline. A single human-in-the-loop mechanism handles both pre-flight forms and mid-execution pauses (folder pickers, prospect selection) via checkpoints and a /resume endpoint.",
    problem:
      "Cold-email campaign setup is inherently multi-step — create a campaign, assign sending accounts, pick folders and prospects, enrich company data, generate the emails — and each step depends on the last, with several requiring human decisions in the middle. Hard-coding that sequence is brittle, and exposing raw field-level wiring to users is unusable. The system needed a way to define steps once, compose them freely, and pause cleanly for human input without the caller managing execution state.",
    challenges: [
      "Designing a DAG executor that runs independent nodes in parallel per topological layer while correctly marking downstream nodes SKIPPED when a dependency fails.",
      "Suspending mid-pipeline for human input — a node raises HumanInputRequired, sibling nodes in the same layer are flushed first, a checkpoint is saved, and the run returns waiting_for_input with a resumable id.",
      "Auto-wiring node-to-node connections without exposing field mapping — an expander name-matches every output field of the source to input fields of the target and patches each node's input_mapping at compile time.",
      "Supporting both static pre-flight HITL (forms shown before the run) and dynamic mid-run HITL (options resolved from an upstream field) through one HITLField declaration.",
      "Keeping the core engine untouched — the entire SDK ergonomics layer (decorators, the `>>` operator, expansion) compiles to plain core PipelineGraph/Edge objects so the runtime never changes.",
      "Enforcing connection compatibility at boot — every node/flow declares accepts_from and connects_to by hand, and a startup validator fails the server if the two sides of any declared connection disagree.",
    ],
    decisions: [
      "Two-layer architecture (immutable core + SDK) — the execution engine is frozen and testable, while developer ergonomics evolve entirely in the SDK layer above it.",
      "One node = one file — schema, API call, and registration co-located, with registration as a side-effect of import so there is no registry file or __init__.py to maintain.",
      "`>>` operator with name-based auto-wiring as the default, plus explicit field-level wiring as an escape hatch when source/target field names differ or need fallback chains.",
      "'Everything is a node' to users — flows (composite nodes) appear in GET /nodes identically to single nodes, so the UI has one uniform concept to render and connect.",
      "In-memory checkpoint store by default with a swappable backing (e.g. Redis) so HITL pauses can survive restarts when needed.",
      "Every run response includes a per-node timeline and the resolved_inputs each node actually received — HITL nodes included — making pipelines debuggable end to end.",
    ],
    features: [
      { title: "Single-File Node SDK", desc: "The @node decorator reads a function's Pydantic input/output annotations, builds its input_mapping, wraps it in a core BaseNode subclass, and registers it — schema, API call, and registration all in one file." },
      { title: "Composable Flows & Workflows", desc: "@flow groups nodes into a composite node and @workflow chains flows, both wired with a `>>` operator that auto-matches fields by name, with explicit port wiring available for fine control." },
      { title: "Parallel DAG Executor", desc: "PipelineExecutor runs nodes in topological layers via asyncio.gather, propagates failures as SKIPPED downstream, and produces an ExecutionReport with completed/failed/skipped nodes." },
      { title: "Human-in-the-Loop Checkpoints", desc: "A single HITLField mechanism handles pre-flight forms and mid-run pauses (folder/prospect pickers). Runs return waiting_for_input + a checkpoint id; POST /resume continues from the saved state." },
      { title: "Connection Discovery API", desc: "GET /nodes, /nodes/{a}/connections, and /nodes/{a}/accepted_from expose developer-declared compatibility with copy-pasteable /run bodies — everything a canvas UI needs to draw and validate wires." },
      { title: "Boot-time Compatibility Validation", desc: "accepts_from / connects_to are declared on both sides of every connection; a startup validator refuses to boot if they disagree, turning wiring mistakes into hard errors instead of silent bugs." },
      { title: "Built-in Observability", desc: "Every /run and /resume response carries a per-node timeline (layer, start/end, duration) and the resolved_inputs each node saw, so slow steps and HITL pauses are traceable." },
    ],
    stack: ["Python", "FastAPI", "Pydantic", "asyncio", "AWS Bedrock", "AWS CloudWatch", "uvicorn"],
    metrics: [
      { value: "3-tier", label: "Node / Flow / Workflow SDK",      highlight: true  },
      { value: "1 file", label: "Per Node (schema + call + register)", highlight: false },
      { value: "Parallel", label: "Layered Async Execution",        highlight: true  },
      { value: "HITL",   label: "Checkpoint & Resume",              highlight: false },
      { value: "Auto",   label: "Field Wiring by Name",             highlight: false },
    ],
    githubUrl: "https://github.com/avneeshrai07/orbitaim_workflows",
    demoUrl: "https://github.com/avneeshrai07/orbitaim_workflows",
    diagramType: "flowchart",
  },
  {
    id: "optipeb",
    num: "08",
    name: "OptiPEB",
    category: "Structural Engineering Automation",
    href: "/projects/optipeb",
    image: `${process.env.NEXT_PUBLIC_CDN_URL}/OptiPEB.png`,
    status: "Production",
    year: "2026",
    role: "Full Stack Engineer",
    type: "Desktop App + Licensing Cloud",
    impact:
      "Automates STAAD.Pro structural workflows — beam data, reactions, anchor-bolt design, and DXF drawings — inside a single native Windows app, with a cloud controller that licenses each machine and pushes silent, checksummed auto-updates.",
    duration: "Ongoing",
    sub: "A STAAD.Pro automation suite: a FastAPI + Next.js desktop app packaged into one Windows .exe that talks to STAAD via OpenSTAAD, backed by a cloud License Controller for machine activation and auto-updates.",
    tags: [
      { label: "Live", type: "live" },
      { label: "Desktop App", type: "type" },
      { label: "FastAPI", type: "type" },
      { label: "Next.js", type: "type" },
    ],
    overview:
      "OptiPEB is a three-repository system that automates structural-engineering tasks on top of Bentley STAAD.Pro. The desktop app pairs a FastAPI backend — which drives a live STAAD model through the OpenSTAAD COM API (pywin32 / comtypes) and runs analysis with PyNiteFEA / OpenSeesPy — with a Next.js dashboard, then packages both into a single self-contained Windows .exe using Nuitka + pywebview so it opens in a native window with no browser and no separate server. The third repo, the OptiPEB Controller, is a FastAPI + PostgreSQL cloud service (live at optipeb.miatibro.art) that gates the app by machine MAC address, tracks activity, and serves versioned releases. On launch the compiled exe checks the Controller for a newer build, downloads it, verifies its SHA-256, and hot-swaps itself — a fail-safe silent auto-update.",
    problem:
      "Structural engineers extract beam data, base reactions, and design values from STAAD.Pro largely by hand — reading them off the GUI and re-keying them into spreadsheets and CAD, model after model. There was no tool that reads a live STAAD model programmatically, computes designs (anchor bolts, reactions envelopes) and DXF drawings automatically, and ships to non-technical engineers as an installable app that stays licensed and up to date.",
    challenges: [
      "Driving STAAD.Pro through the OpenSTAAD COM API reliably — classifying COM/instance errors (no model open, multiple models, file not found) into clean JSON responses instead of raw crashes, and letting the caller pick among several open models.",
      "Packaging a FastAPI backend + a Next.js (output: export) frontend into one Windows .exe with Nuitka — the same process serves the API and mounts the built frontend, opening in a native pywebview window.",
      "Fixing Nuitka's pywebview plugin (it omits webview.platforms.win32) so the compiled exe actually shows a window instead of silently exiting, and redirecting stdout/stderr in the no-console build so uvicorn doesn't crash on isatty().",
      "In-app licensing rather than launch-time — the window always opens and an AuthGate calls the Controller's /machine/license; unregistered machines see an activation screen with their MAC to send to an admin.",
      "Silent, fail-safe auto-update — the exe checks the Controller, downloads a new build, verifies its SHA-256 against the release checksum, and only then swaps itself; any mismatch or unreachable Controller falls back to the running version.",
      "Computing engineering deliverables from raw model data — base-reaction envelopes across load combinations, pinned/fixed anchor-bolt design checks, and generated anchor-bolt and grid DXF drawings via ezdxf.",
    ],
    decisions: [
      "Three repos with clear seams — OptiPEB (desktop backend), opti_peb_frontend (Next.js UI bundled into the exe), and optiPEB_Controller (cloud licensing + updates) — so the client ships offline-capable while licensing stays server-controlled.",
      "OpenSTAAD COM automation over file parsing — reads the live, in-memory model the engineer already has open, so results always match what's on screen.",
      "Nuitka --onefile + pywebview over Electron — a single native Windows exe with a small footprint that serves its own API and frontend on one port, no browser dependency.",
      "Machine-MAC licensing enforced inside the app (AuthGate), not at launch — the app always opens, degrades to an activation screen when unlicensed, and admins register machines Controller-side.",
      "Checksum-verified silent auto-update with a batch-helper hot-swap — clients stay current without an installer round-trip, and a SHA-256 mismatch aborts the update fail-safe.",
      "A same-origin Next.js proxy to the OptiPEB API — the browser never calls STAAD's API directly, keeping the service URL configurable and sidestepping CORS in dev.",
    ],
    features: [
      { title: "Live STAAD.Pro Automation", desc: "A FastAPI backend drives an open STAAD model through the OpenSTAAD COM API (pywin32 / comtypes), exposing beam data, section properties, geometry, and analysis status as clean REST endpoints." },
      { title: "Reactions & Anchor-Bolt Design", desc: "Computes base-reaction envelopes across load combinations and runs pinned- and fixed-base anchor-bolt design checks, then generates anchor-bolt and grid DXF drawings via ezdxf." },
      { title: "Single-Exe Desktop Packaging", desc: "Nuitka bundles the FastAPI backend and the exported Next.js frontend into one self-contained Windows .exe that serves both on a single port and opens in a native pywebview window — no browser, no separate server." },
      { title: "Cloud License Controller", desc: "A FastAPI + PostgreSQL service (optipeb.miatibro.art) activates each machine by MAC address, tracks activity, and maintains a releases snapshot — with admin-only machine registration." },
      { title: "Silent Checksummed Auto-Update", desc: "On launch the exe asks the Controller for a newer release, downloads it, verifies its SHA-256, and hot-swaps itself via a batch helper — aborting fail-safe to the current version on any mismatch or timeout." },
      { title: "In-App Activation Gate", desc: "The window always opens; a frontend AuthGate checks /machine/license and shows an activation screen (MAC + copy button + retry) for unregistered machines instead of the dashboard." },
      { title: "Next.js Dashboard", desc: "A module-grid dashboard (React 19 / Next.js 16 / Tailwind v4) scans for an open STAAD model and renders live modules like BEAM DATA in SI units, reaching the API through a same-origin proxy." },
    ],
    stack: ["Python", "FastAPI", "OpenSTAAD (COM)", "pywin32", "comtypes", "PyNiteFEA", "OpenSeesPy", "ezdxf", "openpyxl", "Nuitka", "pywebview", "Next.js 16", "React 19", "TypeScript", "TailwindCSS v4", "PostgreSQL", "asyncpg", "AWS"],
    metrics: [
      { value: "3",     label: "Repositories (App · Frontend · Controller)", highlight: true  },
      { value: "1 .exe", label: "Self-contained Windows Build",             highlight: true  },
      { value: "COM",   label: "OpenSTAAD Live Model Automation",           highlight: false },
      { value: "MAC",   label: "Per-Machine Licensing",                     highlight: false },
      { value: "SHA-256", label: "Verified Auto-Update",                    highlight: false },
    ],
    githubUrl: "https://github.com/avneeshrai07/optiPEB_Controller",
    demoUrl: "https://optipeb.miatibro.art/",
    diagramType: "architecture",
  },
];