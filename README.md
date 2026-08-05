# 🐾 Pet Food E-commerce Platform

An enterprise-grade, scalable, high-performance E-commerce Platform specifically tailored for pet food and supplies. Built using modern cloud-native architecture, Next.js 16, React 19, NestJS, PostgreSQL (Supabase Pro), and Upstash Redis.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.style=flat-square)](https://github.com/sevenx-labs/pet-food-platform)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?style=flat-square)](https://github.com/sevenx-labs/pet-food-platform)
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.0-red?style=flat-square&logo=nestjs)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16.0-blue?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.0-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Status](https://img.shields.io/badge/status-production--ready-success?style=flat-square)](#)

---

- **Project Version**: `1.0.0-release`
- **License**: MIT License
- **Status**: Active / Production-Ready
- **Maintained By**: SevenX Labs Engineering & Architecture Team (`engineering@sevenxlabs.com`)

---

# 📖 Table of Contents

1. [Project Title](#-pet-food-e-commerce-platform)
2. [Table of Contents](#-table-of-contents)
3. [Introduction](#-3-introduction)
4. [Features](#-4-features)
5. [Tech Stack & Pricing](#-5-tech-stack--pricing)
6. [Project Architecture](#-6-project-architecture)
7. [Folder Structure](#-7-folder-structure)
8. [Module Architecture](#-8-module-architecture)
9. [Database Design](#-9-database-design)
10. [API Structure](#-10-api-structure)
11. [Authentication & RBAC](#-11-authentication--rbac)
12. [Installation & Quickstart](#-12-installation--quickstart)
13. [Environment Variables](#-13-environment-variables)
14. [Database Management](#-14-database-management)
15. [Running the Project](#-15-running-the-project)
16. [Deployment Guide](#-16-deployment-guide)
17. [API Documentation (Swagger)](#-17-api-documentation-swagger)
18. [Customer Application Modules](#-18-customer-application-modules)
19. [Admin Panel Modules](#-19-admin-panel-modules)
20. [Security Architecture](#-20-security-architecture)
21. [Performance & Caching Strategy](#-21-performance--caching-strategy)
22. [Monitoring & Health Checks](#-22-monitoring--health-checks)
23. [Logging System](#-23-logging-system)
24. [Queue & Background Worker System](#-24-queue--background-worker-system)
25. [Notification System](#-25-notification-system)
26. [Full-Text Search Engine](#-26-full-text-search-engine)
27. [Payment Integration & Workflow](#-27-payment-integration--workflow)
28. [Order Processing Lifecycle](#-28-order-processing-lifecycle)
29. [Folder & File Naming Conventions](#-29-folder--file-naming-conventions)
30. [Code Standards & Architecture Guidelines](#-30-code-standards--architecture-guidelines)
31. [Git & Branching Strategy](#-31-git--branching-strategy)
32. [Testing Strategy](#-32-testing-strategy)
33. [CI/CD Pipeline](#-33-cicd-pipeline)
34. [Scalability Roadmap](#-34-scalability-roadmap)
35. [Future Roadmap & Phase 2 Improvements](#-35-future-roadmap--phase-2-improvements)
36. [License](#-36-license)
37. [Contributors & Core Team](#-37-contributors--core-team)
38. [Support & Community](#-38-support--community)
39. [Contact & Communication](#-39-contact--communication)
40. [Acknowledgements & Credits](#-40-acknowledgements--credits)

---

# 💡 3. Introduction

## 3.1 Project Overview
The **Pet Food E-commerce Platform** (Codename: **KICKAT**) is a modern, high-throughput, enterprise-level digital commerce ecosystem tailored to pet nutrition, care products, and accessories. Built with standard-setting backend infrastructure (NestJS) and ultra-responsive frontend applications (Next.js 16 & React 19), it delivers a seamless end-to-end shopping experience for pet owners and a comprehensive control hub for store administrators.

## 3.2 Purpose
Pet care products require precise dietary filtering (breed, age, weight, allergies, veg/non-veg compliance), batch tracking for safety/expiry dates, and fast, reliable delivery schedules. This platform solves the gap in generic e-commerce engines by placing **Pet Profiles** at the heart of the customer experience, enabling personalized product recommendations, automated diet plan matching, and dynamic re-ordering.

> [!NOTE]  
> The system operates on a single unified PostgreSQL database shared between the customer-facing storefront and the internal back-office administration panel, guaranteeing real-time inventory synchronization, instant order updates, and consistent data governance.

## 3.3 Business Problem Addressed
- **Generic E-commerce Inefficiency**: standard stores treat dog kibble like clothing, leading to wrong product selection, nutritional mismatches, and high return rates.
- **Inventory & Expiry Loss**: Pet food items have strict shelf lives. Missing batch expiry monitoring leads to spoiled inventory write-offs.
- **Friction in Repeat Purchases**: Pet food is a high-frequency replenishable item. Lack of 1-tap reordering causes high customer churn.
- **Fragmented Multi-Channel Operations**: Lack of centralized inventory, shipping courier synchronization (Shiprocket/Delhivery), and payment reconciliation creates operational bottlenecks.

## 3.4 Solution Architecture
- **Pet-Centric UX**: 3-Step onboarding that binds customer profiles directly to pet parameters (species, breed, age, allergies, diet preferences).
- **Automated Inventory & Expiry Safeguards**: Batch & HSN tracking with automated stock level alerts and expiry date enforcement ("Best before MM/YYYY").
- **Asynchronous Event-Driven Micro-Tasks**: BullMQ worker queues for SMS OTP dispatching, WhatsApp transactional updates, automated PDF invoice generation, and refund processing.
- **Enterprise Security & Compliance**: Strict Role-Based Access Control (RBAC), Argon2 password hashing, dual-token JWT flow (HTTP-only cookies), and Razorpay webhook cryptographic verification.

---

# ✨ 4. Features

## 4.1 Customer Features
- **Flexible Multi-Channel Authentication**: Mobile OTP (MSG91 SMS), Email OTP, One-Tap Google OAuth 2.0, and Guest Browsing.
- **Personalized Onboarding**: 3-Step workflow capturing basic user information, default delivery address with auto-GPS pincode lookup, and pet profile details.
- **Smart Pet Recommendations**: Curated "Buy Again" quick reordering and AI/Rule-based product suggestions linked to registered pet profiles.
- **Rich Product Discovery**:
  - Full-text search with instant auto-suggestions.
  - Granular multi-facet filtering: Pet species (Dog, Cat, Bird, etc.), Veg/Non-Veg badges, price range slider, brand, rating, and stock status.
  - Multi-variant selection pills (weight, package size, flavor).
- **Interactive Product Details (PDP)**:
  - Swipeable high-res gallery with pinch-zoom & embedded video support.
  - Nutritional composition, key ingredients list, and age/weight feeding recommendations.
  - Up to 3-product side-by-side comparison matrix.
  - Verified buyer reviews with photo uploads and "Helpful" upvoting.
- **Frictionless Checkout & Payments**:
  - Unified cart breakdown (Item total, GST split, delivery fee, automated promo savings).
  - Razorpay payment gateway integration supporting UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, and Pincode-verified COD.
- **Post-Purchase Order Tracking**:
  - Real-time milestone pipeline (`Placed` → `Confirmed` → `Packed` → `Shipped` → `Out for Delivery` → `Delivered`).
  - Interactive map integration for live shipment tracking.
  - Instant 1-tap PDF invoice download.
  - 1-click self-serve order cancellation (prior to packing) and returns flow with photo evidence upload.

## 4.2 Admin Features
- **Secure Access Control**: Dual-factor authentication (Email OTP), password recovery flow, session timeout enforcement, and sub-admin activity logging.
- **Comprehensive Executive Dashboard**: Real-time business KPIs (Total Revenue, Order Velocity, Customer Counts, Low Stock Alerts, Pending Refunds) with dynamic sales trend charts.
- **Full CRUD Product Management**: Drag-and-drop media manager, rich-text editor for descriptions, variant matrix editor, tax/HSN configurations, and bulk Excel export/import.
- **Category & Taxonomy Engine**: Nested parent/child subcategories with custom image banners and visual display order management.
- **Order Lifecycle Fulfillment Hub**: Dedicated operational tabs (`New`, `Processing`, `Packed`, `Shipped`, `Delivered`, `Cancelled`, `RTO`), automated courier assignment, and shipping label printing.
- **Customer Relationship Management (CRM)**: Customer master list, lifetime value (LTV) metrics, pet profile auditing, and single-click account suspension.
- **Financial & Payment Management**: Gateway reconciliation report, failed transaction analysis, and manual/automated refund triggering via Razorpay APIs.
- **CMS & Legal Content Manager**: WYSIWYG rich-text editors for Privacy Policy, T&C, Shipping Policy, Blog posts, and categorized FAQs.
- **Role-Based Access Control (RBAC)**: Fine-grained module permissions (View Only, Full Access, No Access) for sub-admin accounts.

## 4.3 Backend Features
- **Modular NestJS Architecture**: High cohesion, low coupling, single-responsibility modules.
- **Prisma ORM Integration**: Type-safe database query building with automated schema migrations.
- **Caching Layer**: Upstash Redis caching for hot product listings, session tokens, and rate-limiting counters.
- **Asynchronous Queue Worker**: BullMQ job processors executing background email, SMS, WhatsApp notifications, and report rendering.
- **PostgreSQL Full-Text Search**: Native `tsvector` and `tsquery` search indexing with GIN indexes for fast term matching.

## 4.4 Security Features
- **Argon2 Password Hashing**: Modern, memory-hard hashing algorithm resisting GPU-based brute force attacks.
- **Dual JWT Token Architecture**: Short-lived Access Tokens (15m) paired with encrypted Refresh Tokens (7d) stored in `HttpOnly`, `SameSite=Strict` cookies.
- **HTTP Protection**: Helmet middleware enforcing HTTP Strict Transport Security (HSTS), Content Security Policy (CSP), and X-Frame-Options.
- **Rate Limiting & Throttling**: IP-based and user-based request caps managed via Redis.
- **Input Sanitization**: `class-validator` DTO constraints and `xss-filters` blocking XSS and SQL injection vulnerabilities.

## 4.5 Developer Features
- **Fully Typed Ecosystem**: End-to-end TypeScript enforcement across frontend, backend, and database schema.
- **Auto-Generated OpenAPI (Swagger)**: Live interactive API reference hosted directly at `/api/docs`.
- **Pre-configured CI/CD**: GitHub Actions workflows for automated linting, building, testing, and continuous deployment.
- **Dockerized Local Environment**: `docker-compose.yml` pre-configured with PostgreSQL and Redis containers for instant developer setup.

---

# 🛠️ 5. Tech Stack & Pricing

## 5.1 Technology Matrix

| Layer | Technology / Library | Version | Purpose / Description |
| :--- | :--- | :--- | :--- |
| **Frontend Core** | Next.js | `16.x` | React Framework with App Router, SSR, and Server Actions |
| **UI Library** | React | `19.x` | Component UI rendering layer |
| **Programming Language**| TypeScript | `5.5+` | End-to-end static type enforcement |
| **Styling** | Tailwind CSS | `v4.0` | Utility-first CSS engine |
| **Component Kit** | shadcn/ui | `Latest` | Accessible, customizable headless UI primitives |
| **Animations** | Framer Motion | `11.x` | Smooth page transitions and micro-interactions |
| **State Management** | Zustand & TanStack Query| `v5` / `v5` | Client-side transient state & Server-state cache synchronizer |
| **Forms** | React Hook Form | `7.x` | High-performance form state & client validation |
| **Backend Core** | NestJS | `10.x` | Progressive TypeScript Node.js backend framework |
| **Database** | PostgreSQL (Supabase Pro)| `16.x` | Shared relational database engine |
| **ORM** | Prisma ORM | `6.x` | Type-safe SQL query generation and migration management |
| **Caching** | Upstash Redis | `Serverless`| Ultra-low latency key-value cache & rate-limiting store |
| **Job Queue** | BullMQ | `5.x` | Redis-backed asynchronous queue and worker processing engine |
| **Authentication** | JWT & Argon2 | `v2` / `v0.20` | Secure dual-token system & password hashing |
| **SMS Gateway** | MSG91 OTP | `REST` | Transactional SMS OTP delivery |
| **WhatsApp API** | MSG91 WhatsApp | `v5` | Transactional order updates & notification engine |
| **Email Service** | Resend API | `v3` | Transactional HTML email dispatching |
| **Payment Gateway** | Razorpay SDK | `v2` | Online payments, UPI auto-pay, and automated refund engine |
| **Cloud Storage** | Supabase Storage | `S3 API` | Object storage for product media, invoices, and banners |
| **Map Services** | Google Maps Platform | `v3` | Geocoding, reverse pincode lookup, and shipment tracking |
| **Search Engine** | PostgreSQL Full-Text | `Native` | Native SQL text matching with ranking and weighted search |
| **CDN & Security** | Cloudflare | `Free` | Global Edge caching, DNS management, DDoS mitigation |
| **Frontend Hosting** | Vercel | `Serverless`| Edge deployment platform for Next.js app |
| **Backend Hosting** | Render | `Team Plan` | Managed container hosting for NestJS REST API |
| **CI/CD** | GitHub Actions | `v4` | Automated testing, linting, and build pipeline |

## 5.2 Estimated Production Fixed Infrastructure Pricing

| Service Provider | Service Plan | Monthly Base Cost | Included Resources / Quotas |
| :--- | :--- | :--- | :--- |
| **Supabase** | Pro Plan | $25.00 | PostgreSQL 8 GB DB, 100 GB File Storage, Daily Backups |
| **Render** | Team Plan | $25.00 | Managed Node.js app runner, autoscaling, 25 GB bandwidth |
| **Vercel** | Hobby / Free Tier | $0.00 | Unlimited edge deployments, global CDN distribution |
| **Upstash Redis** | Developer Free Tier | $0.00 | Up to 10,000 commands/day (Upgrade to Pay-as-you-go as traffic grows) |
| **Cloudflare** | Free Tier | $0.00 | Global DNS, free SSL, DDoS protection, CDN caching |
| **Resend Email** | Free Tier | $0.00 | 3,000 emails/month (Upgrade to Pro at $20/mo for 50,000 emails) |
| **TOTAL FIXED COST** | *(Initial Launch)* | **$50.00 / month** | *(Scales linearly with transactional usage)* |

## 5.3 Usage-Based Services Cost Structure

### SMS OTP Pricing (MSG91 India)
| SMS Volume Pack | Price per SMS | Total Cost (excl. GST) | Recommendation |
| :--- | :--- | :--- | :--- |
| **5,000 SMS** | ₹0.25 | ₹1,250 | **Launch Tier**: Ideal for initial user base |
| **15,000 SMS** | ₹0.22 | ₹3,300 | **Growth Tier**: Cost reduction as registration accelerates |
| **27,000 SMS** | ₹0.20 | ₹5,400 | **Scale Tier**: High volume transactional OTPs |

### WhatsApp Conversation API Pricing (MSG91 India)
| Category | Cost per Conversation | Usage Scenarios |
| :--- | :--- | :--- |
| **Authentication** | ₹0.115 (12 Paise) | Login OTP, Password Reset OTP, Registration Verification |
| **Utility** | ₹0.115 (12 Paise) | Order Placement Confirmation, Payment Receipt, Courier Tracking |
| **Marketing** | ₹0.8631 (90 Paise) | Seasonal discounts, promotional broadcasts, abandoned cart prompts |

---

# 🏗️ 6. Project Architecture

## 6.1 High-Level Enterprise Architecture

```mermaid
flowchart TB
    subgraph Clients["Client Layer"]
        WEB["Next.js 16 Customer Storefront\n(Vercel Edge)"]
        ADMIN["Next.js 16 Admin Dashboard\n(Vercel Edge)"]
    end

    subgraph Edge["Edge & Security Layer"]
        CF["Cloudflare DNS & WAF / CDN"]
    end

    subgraph Backend["Application Layer (Render)"]
        API["NestJS REST API Engine\n(Express Core)"]
        SWAGGER["Swagger Docs\n(/api/docs)"]
        BULL["BullMQ Queue Manager"]
    end

    subgraph Data["Data & Storage Layer"]
        PG[(PostgreSQL Database\nSupabase Pro)]
        REDIS[(Upstash Redis\nCache & Job Queue)]
        S3[(Supabase Storage\nBucket)]
    end

    subgraph External["External Integrations"]
        RZP["Razorpay Gateway"]
        MSG["MSG91 (SMS / WhatsApp)"]
        RESEND["Resend Email API"]
        MAPS["Google Maps Platform"]
    end

    CLIENTS --> CF
    CF --> WEB
    CF --> ADMIN
    WEB -->|HTTPS / REST| API
    ADMIN -->|HTTPS / REST| API
    API --- SWAGGER
    API -->|Prisma ORM| PG
    API -->|Redis Client| REDIS
    API -->|S3 Protocol| S3
    API --> BULL
    BULL -->|Dispatch Jobs| REDIS
    API -->|Payments| RZP
    BULL -->|OTP & Alerts| MSG
    BULL -->|Emails| RESEND
    API -->|Geocoding| MAPS
```

## 6.2 Low-Level Request Processing Pipeline

```mermaid
sequenceDiagram
    autonumber
    actor User as Customer Client
    participant Guard as Auth Guard (JWT)
    participant RateLimiter as Throttler Guard
    participant Controller as NestJS Controller
    participant Pipe as Validation Pipe
    participant Service as Business Service
    participant Cache as Redis Cache
    participant DB as PostgreSQL (Prisma)
    participant Queue as BullMQ Worker

    User->>Guard: HTTP Request + Bearer Token
    Guard->>Guard: Verify JWT Signature & Expiry
    Guard->>RateLimiter: Check Request Rate Cap
    RateLimiter->>Controller: Route to Target Method
    Controller->>Pipe: Validate DTO Schema (class-validator)
    Pipe->>Service: Pass Sanitized Payload
    Service->>Cache: Check Cache Key (e.g. `product:123`)
    alt Cache Hit
        Cache-->>Service: Return Cached JSON
    else Cache Miss
        Service->>DB: Execute Prisma Query
        DB-->>Service: Return Database Record
        Service->>Cache: Write Key with TTL (60s)
    end
    Service->>Queue: Enqueue Async Event (e.g. Order Placed Notification)
    Service-->>Controller: Return Result DTO
    Controller-->>User: Standard JSON Response Envelope `{ success: true, data: ... }`
```

---

# 📂 7. Folder Structure

## 7.1 Complete Frontend Application Structure (Next.js 16)

```
frontend/
├── .github/                      # GitHub Actions CI/CD workflows
│   └── workflows/
│       ├── deploy-customer.yml
│       └── deploy-admin.yml
├── public/                       # Static public assets
│   ├── favicon.ico
│   ├── images/
│   │   ├── hero-banner.webp
│   │   └── placeholders/
│   └── manifest.json
├── src/
│   ├── app/                      # Next.js 16 App Router Directory
│   │   ├── (auth)/               # Authentication route group
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── verify-otp/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (customer)/           # Customer Storefront route group
│   │   │   ├── onboarding/
│   │   │   │   ├── step-1/page.tsx
│   │   │   │   ├── step-2/page.tsx
│   │   │   │   └── step-3/page.tsx
│   │   │   ├── products/
│   │   │   │   ├── page.tsx      # PLP (Product Listing Page)
│   │   │   │   └── [slug]/page.tsx # PDP (Product Detail Page)
│   │   │   ├── cart/
│   │   │   │   └── page.tsx
│   │   │   ├── checkout/
│   │   │   │   └── page.tsx
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── profile/
│   │   │   │   └── page.tsx
│   │   │   ├── compare/
│   │   │   │   └── page.tsx
│   │   │   ├── page.tsx          # Homepage
│   │   │   └── layout.tsx
│   │   ├── admin/                # Admin Panel Route Group
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── products/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/edit/page.tsx
│   │   │   ├── categories/
│   │   │   │   └── page.tsx
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── customers/
│   │   │   │   └── page.tsx
│   │   │   ├── payments/
│   │   │   │   └── page.tsx
│   │   │   ├── reports/
│   │   │   │   └── page.tsx
│   │   │   ├── settings/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── api/                  # Next.js BFF API endpoints (if required)
│   │   ├── globals.css           # Tailwind v4 import & custom tokens
│   │   └── layout.tsx            # Root HTML & Providers Wrapper
│   ├── components/               # UI Components
│   │   ├── ui/                   # shadcn/ui primitive components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   └── input.tsx
│   │   ├── common/               # Shared global components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── NavigationBar.tsx
│   │   │   └── RatingStars.tsx
│   │   ├── customer/             # Customer-specific components
│   │   │   ├── ProductCard.tsx
│   │   │   ├── CartDrawer.tsx
│   │   │   ├── PetProfileCard.tsx
│   │   │   └── ReviewFormModal.tsx
│   │   └── admin/                # Admin-specific components
│   │       ├── Sidebar.tsx
│   │       ├── MetricCard.tsx
│   │       ├── OrderStatusBadge.tsx
│   │       └── AnalyticsChart.tsx
│   ├── config/                   # Client app configuration
│   │   ├── site.ts
│   │   └── constants.ts
│   ├── hooks/                    # Custom React Hooks
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   ├── useWishlist.ts
│   │   └── useDebounce.ts
│   ├── lib/                      # Helper libraries & client instances
│   │   ├── axios.ts              # Axios instance with interceptors
│   │   ├── react-query.ts        # TanStack query client wrapper
│   │   └── utils.ts              # cn helper & formatters
│   ├── services/                 # API service request functions
│   │   ├── auth.service.ts
│   │   ├── product.service.ts
│   │   ├── order.service.ts
│   │   └── admin.service.ts
│   ├── store/                    # Zustand global client state stores
│   │   ├── useCartStore.ts
│   │   ├── useUserStore.ts
│   │   └── useCompareStore.ts
│   └── types/                    # TypeScript type definitions
│       ├── api.ts
│       ├── product.ts
│       └── order.ts
├── .env.example
├── next.config.ts
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

## 7.2 Complete Backend Application Structure (NestJS)

```
backend/
├── prisma/
│   ├── migrations/               # Database SQL migrations list
│   ├── schema.prisma             # Primary Prisma DB schema models
│   └── seed.ts                   # Initial DB seed file
├── src/
│   ├── common/                   # Cross-cutting module utilities
│   │   ├── decorators/           # Custom TS decorators (@CurrentUser, @Roles)
│   │   ├── dto/                  # Shared base DTOs (PaginationDto)
│   │   ├── filters/              # Global exception filters (HttpExceptionFilter)
│   │   ├── guards/               # Auth & RBAC guards (JwtAuthGuard, RolesGuard)
│   │   ├── interceptors/         # Response format & Logging interceptors
│   │   ├── middleware/           # HTTP Request Logger middleware
│   │   └── pipes/                # Custom validation & parse pipes
│   ├── config/                   # Configuration namespaces
│   │   ├── app.config.ts
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── redis.config.ts
│   ├── database/                 # Prisma Module & Service wrapper
│   │   ├── database.module.ts
│   │   └── database.service.ts
│   ├── modules/                  # Application Business Modules
│   │   ├── auth/                 # Authentication & Token module
│   │   │   ├── dto/
│   │   │   ├── strategies/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.module.ts
│   │   │   └── auth.service.ts
│   │   ├── users/                # User & Customer management module
│   │   ├── pets/                 # Pet Profile management module
│   │   ├── products/             # Product catalog module
│   │   ├── categories/           # Product categories module
│   │   ├── orders/               # Order orchestration module
│   │   ├── payments/             # Razorpay payment & webhook module
│   │   ├── shipping/             # Courier & Logistics module
│   │   ├── reviews/              # Product reviews module
│   │   ├── cms/                  # Content management module
│   │   ├── analytics/            # Admin analytics & reporting module
│   │   ├── search/               # PostgreSQL Full-text search module
│   │   ├── notifications/        # Email/SMS/WhatsApp dispatch module
│   │   └── health/               # Terminus system health module
│   ├── queue/                    # BullMQ job processor configuration
│   │   ├── queue.module.ts
│   │   ├── processors/           # Background event processors
│   │   │   ├── email.processor.ts
│   │   │   └── notification.processor.ts
│   ├── redis/                    # Upstash Redis wrapper module
│   ├── app.module.ts             # Root Application Module
│   └── main.ts                   # Application bootstrap entry point
├── test/                         # E2E & Integration tests
│   ├── app.e2e-spec.ts
│   ├── jest-e2e.json
│   └── setup.ts
├── .env.example
├── Dockerfile
├── docker-compose.yml
├── nest-cli.json
├── package.json
└── tsconfig.json
```

---

# 🧩 8. Module Architecture

The backend application is designed around domain-driven, single-responsibility modules:

```mermaid
graph TD
    AppModule --> AuthModule
    AppModule --> UsersModule
    AppModule --> PetsModule
    AppModule --> ProductsModule
    AppModule --> CategoriesModule
    AppModule --> OrdersModule
    AppModule --> PaymentsModule
    AppModule --> ShippingModule
    AppModule --> ReviewsModule
    AppModule --> CmsModule
    AppModule --> AnalyticsModule
    AppModule --> NotificationsModule
    
    OrdersModule --> PaymentsModule
    OrdersModule --> ShippingModule
    OrdersModule --> NotificationsModule
    AuthModule --> NotificationsModule
```

1. **Authentication Module (`auth`)**: Handles OTP generation, verification, password hashing via Argon2, JWT token issuance (Access & Refresh), and Google OAuth token validation.
2. **Products Module (`products`)**: Manages product CRUD operations, multi-variant options, inventory management, Veg/Non-Veg classifications, HSN code assignments, and price calculations.
3. **Categories Module (`categories`)**: Handles hierarchical product structuring (Categories and Sub-categories), display ordering, and image attachments.
4. **Orders Module (`orders`)**: Manages the complete lifecycle of customer orders, cart validations, total cost calculations (including GST and shipping), order status state transitions, and cancellation/return authorization.
5. **Payments Module (`payments`)**: Direct integration with Razorpay REST APIs and Webhook listeners. Handles signature verification, payment status updates, idempotency checks, and automated refunds.
6. **Shipping Module (`shipping`)**: Interfaces with logistics providers (Shiprocket / Delhivery) to generate Airway Bills (AWB), fetch pincode serviceability, track shipment events, and calculate shipping fees.
7. **Customers Module (`users`)**: Manages customer profiles, delivery addresses, communication preferences, account status, and transaction history.
8. **Pets Module (`pets`)**: Handles creation and maintenance of pet profiles (species, breed, age, weight, dietary needs, allergies) to drive custom storefront recommendations.
9. **Reviews Module (`reviews`)**: Manages customer product ratings, text reviews, media attachments, verified purchase tags, upvoting, and admin moderation controls.
10. **Notifications Module (`notifications`)**: Orchestrates outbound communications through MSG91 (SMS/WhatsApp) and Resend (Email) driven by background queue tasks.
11. **CMS Module (`cms`)**: Provides content APIs for managing static legal pages, promotional blogs, and categorized FAQ sections.
12. **Analytics Module (`analytics`)**: Generates aggregated administrative reports for sales velocity, payment method distribution, order fulfillment rates, and customer retention metrics.
13. **Settings Module (`settings`)**: Stores store-wide application parameters, tax rates (GST), shipping cost thresholds, and messaging templates.

---

# 🗄️ 9. Database Design

## 9.1 Shared Database Architecture
The platform utilizes a single shared PostgreSQL database hosted on Supabase Pro. Shared tables enforce data integrity via strict foreign key constraints while eliminating sync delays between the Customer Application and Admin Dashboard.

## 9.2 Complete Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    USERS ||--o{ PET_PROFILES : owns
    USERS ||--o{ ADDRESSES : maintains
    USERS ||--o{ ORDERS : places
    USERS ||--o{ REVIEWS : writes
    USERS ||--o{ REFRESH_TOKENS : holds
    
    PRODUCTS ||--|{ PRODUCT_VARIANTS : contains
    CATEGORIES ||--o{ PRODUCTS : categorizes
    CATEGORIES ||--o{ CATEGORIES : parent_of
    
    ORDERS ||--|{ ORDER_ITEMS : includes
    ORDERS ||--|| PAYMENTS : settled_by
    ORDERS ||--o| SHIPMENTS : fulfilled_by
    
    PRODUCT_VARIANTS ||--o{ ORDER_ITEMS : referenced_in
    PRODUCTS ||--o{ REVIEWS : receives

    USERS {
        uuid id PK
        string full_name
        string email
        string mobile UK
        string password_hash
        enum role "CUSTOMER | ADMIN | SUB_ADMIN"
        boolean is_active
        datetime created_at
    }

    PET_PROFILES {
        uuid id PK
        uuid user_id FK
        string pet_name
        enum species "DOG | CAT | BIRD | FISH | RABBIT | OTHER"
        string breed
        date date_of_birth
        float weight_kg
        enum diet "VEG | NON_VEG | BOTH"
        string allergies
    }

    ADDRESSES {
        uuid id PK
        uuid user_id FK
        enum type "HOME | WORK | OTHER"
        string house_no
        string street
        string landmark
        string city
        string state
        string pincode
        boolean is_default
    }

    PRODUCTS {
        uuid id PK
        uuid category_id FK
        string name
        string slug UK
        string description
        boolean is_veg
        string hsn_code
        datetime best_before
        boolean is_active
    }

    PRODUCT_VARIANTS {
        uuid id PK
        uuid product_id FK
        string variant_name
        decimal price
        decimal mrp
        integer stock_qty
        string sku UK
    }

    ORDERS {
        uuid id PK
        uuid user_id FK
        string order_number UK
        enum status "PENDING | CONFIRMED | PACKED | SHIPPED | DELIVERED | CANCELLED | RTO"
        decimal total_amount
        decimal tax_amount
        decimal shipping_fee
        decimal discount_amount
        uuid shipping_address_id FK
        datetime created_at
    }

    ORDER_ITEMS {
        uuid id PK
        uuid order_id FK
        uuid variant_id FK
        integer quantity
        decimal unit_price
        decimal total_price
    }

    PAYMENTS {
        uuid id PK
        uuid order_id FK UK
        string razorpay_order_id UK
        string razorpay_payment_id UK
        string razorpay_signature
        enum status "PENDING | SUCCESS | FAILED | REFUNDED"
        enum payment_method "UPI | CARD | NETBANKING | WALLET | COD"
        decimal amount
    }

    SHIPMENTS {
        uuid id PK
        uuid order_id FK UK
        string awb_number UK
        string courier_name
        string tracking_url
        enum status "MANIFESTED | IN_TRANSIT | OUT_FOR_DELIVERY | DELIVERED | RETURNED"
    }

    REVIEWS {
        uuid id PK
        uuid product_id FK
        uuid user_id FK
        integer rating
        string title
        string comment
        boolean is_verified
        boolean is_approved
    }
```

## 9.3 Indexing & Query Optimizations
To maintain sub-50ms query response times under high concurrency, the following indexes are applied:

```sql
-- Full-Text Search GIN Index on Products
CREATE INDEX idx_products_search ON "PRODUCTS" USING GIN(to_tsvector('english', name || ' ' || description));

-- Compound Index for Order filtering by User & Status
CREATE INDEX idx_orders_user_status ON "ORDERS"(user_id, status, created_at DESC);

-- Unique index for SKUs and Slugs
CREATE UNIQUE INDEX idx_products_slug ON "PRODUCTS"(slug);
CREATE UNIQUE INDEX idx_variants_sku ON "PRODUCT_VARIANTS"(sku);

-- Category Hierarchy Index
CREATE INDEX idx_categories_parent ON "CATEGORIES"(parent_id);
```

---

# 🌐 10. API Structure

## 10.1 REST API Standards
The backend implements RESTful API principles using predictable URL structures, HTTP verbs, and standard status codes.

| Method | Usage | Description |
| :--- | :--- | :--- |
| `GET` | Read | Retrieve a resource or collection |
| `POST` | Create | Create a new entity or trigger an action |
| `PUT` | Replace | Completely update an existing resource |
| `PATCH` | Modify | Partially update fields of a resource |
| `DELETE` | Remove | Mark a resource as deleted or purge it |

## 10.2 API Versioning
All public and admin endpoints are explicitly versioned in the URI path:
`https://api.petfoodplatform.com/v1/...`

## 10.3 Standard JSON Response Format
All controller methods return standard, consistent JSON envelopes:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Resource retrieved successfully",
  "data": {
    "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "name": "Premium Adult Dog Kibble - Chicken & Rice",
    "price": 1499.00
  },
  "meta": {
    "timestamp": "2026-08-02T01:34:20.000Z",
    "version": "1.0.0"
  }
}
```

## 10.4 Standard Error Response Format
When an exception occurs, the global exception filter returns formatted error details:

```json
{
  "success": false,
  "statusCode": 400,
  "error": "Bad Request",
  "message": [
    "mobile must be a valid mobile phone number",
    "email must be an email address"
  ],
  "timestamp": "2026-08-02T01:34:20.000Z",
  "path": "/v1/auth/register"
}
```

---

# 🔐 11. Authentication & RBAC

## 11.1 Authentication Workflow
1. **SMS/Email OTP Flow**:
   - User inputs mobile number or email.
   - Backend triggers 6-digit cryptographically secure random OTP (stored in Redis with a 5-minute TTL).
   - MSG91 dispatches the SMS/WhatsApp message.
   - User enters OTP; backend verifies value and clears key from Redis upon success.
2. **Token Issuance**:
   - **Access Token**: Short-lived (15 minutes), containing `userId`, `role`, and `permissions` in its payload. Signed via `RS256` or `HS256`.
   - **Refresh Token**: Long-lived (7 days), hashed via Argon2 and stored in the database, delivered to the client inside an `HttpOnly`, `Secure`, `SameSite=Strict` cookie.

## 11.2 Role-Based Access Control (RBAC) Permission Matrix

| Module / Action | Guest User | Customer | Sub-Admin (View Only) | Sub-Admin (Operations) | Super Admin |
| :--- | :---: | :---: | :---: | :---: | :---: |
| Browse Products / Categories | ✅ | ✅ | ✅ | ✅ | ✅ |
| Add to Cart / Wishlist | ✅ | ✅ | ❌ | ❌ | ❌ |
| Place Order / Pay | ❌ | ✅ | ❌ | ❌ | ❌ |
| Manage Own Pet Profiles | ❌ | ✅ | ❌ | ❌ | ❌ |
| View Customer Orders | ❌ | Self Only | ✅ All | ✅ All | ✅ All |
| Update Order Status | ❌ | ❌ | ❌ | ✅ | ✅ |
| Add / Edit / Delete Products| ❌ | ❌ | ❌ | ✅ | ✅ |
| Initiate Refunds | ❌ | ❌ | ❌ | ✅ | ✅ |
| View Financial Reports | ❌ | ❌ | ❌ | ❌ | ✅ |
| Manage System Users & Roles | ❌ | ❌ | ❌ | ❌ | ✅ |

---

# 🚀 12. Installation & Quickstart

## 12.1 Prerequisites
Ensure you have the following installed on your developer machine:
- **Node.js**: `v20.x` or higher
- **npm**: `v10.x` or higher
- **Docker & Docker Compose**: (Optional, for running local PostgreSQL & Redis)
- **Git**: Latest version

## 12.2 Cloning the Repository
```bash
git clone https://github.com/sevenx-labs/pet-food-platform.git
cd pet-food-platform
```

## 12.3 Installing Dependencies
Install dependencies for both frontend and backend workspace apps:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## 12.4 Running Local Infrastructure via Docker
From the project root:

```bash
cd backend
docker-compose up -d
```
This launches:
- **PostgreSQL** on `localhost:5432`
- **Redis** on `localhost:6379`

## 12.5 Setting Up Database & Running Seeds
```bash
cd backend
npx prisma migrate dev --name init
npx prisma db seed
```

---

# 🔑 13. Environment Variables

Create `.env` files in both `frontend` and `backend` roots based on `.env.example`.

## 13.1 Backend `.env.example` Breakdown

```ini
# Application Configuration
PORT=4000
NODE_ENV=development
APP_NAME="Pet Food API"
API_PREFIX="/v1"
FRONTEND_URL="http://localhost:3000"

# Database Configuration (Supabase / Local Postgres)
DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/petfood_db?schema=public&connection_limit=20"
DIRECT_URL="postgresql://postgres:postgrespassword@localhost:5432/petfood_db?schema=public"

# Redis Configuration (Upstash or Local)
REDIS_HOST="localhost"
REDIS_PORT=6379
REDIS_PASSWORD=""
REDIS_TTL=3600

# Authentication & JWT Secrets
JWT_ACCESS_SECRET="super-secret-access-token-key-change-in-production-32chars"
JWT_REFRESH_SECRET="super-secret-refresh-token-key-change-in-production-32chars"
JWT_ACCESS_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"

# MSG91 Configuration (SMS & WhatsApp OTP)
MSG91_AUTH_KEY="3940294029482049"
MSG91_SENDER_ID="KICKAT"
MSG91_OTP_TEMPLATE_ID="64f1234abc567"
MSG91_WHATSAPP_NUMBER="919876543210"

# Resend Email Configuration
RESEND_API_KEY="re_123456789_abcdefg"
EMAIL_FROM="orders@petfoodplatform.com"

# Razorpay Credentials
RAZORPAY_KEY_ID="rzp_test_1234567890"
RAZORPAY_KEY_SECRET="abcdefghijklmnop12345678"
RAZORPAY_WEBHOOK_SECRET="webhook_secret_verification_key"

# Supabase Storage Integration
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_STORAGE_BUCKET="pet-food-assets"

# Google Maps API
GOOGLE_MAPS_API_KEY="AIzaSyA1234567890abcdefg"
```

---

# ⚡ 14. Database Management

## 14.1 Prisma Migration Commands
```bash
# Create and apply a new migration during development
npx prisma migrate dev --name <migration_name>

# Apply pending migrations in production environments
npx prisma migrate deploy

# Check status of applied migrations
npx prisma migrate status
```

## 14.2 Seeding Initial Data
The seed script populates default system roles, super-admin account, product categories, and mock products:
```bash
npm run seed
```

## 14.3 Database Backup & Restore Procedure
To take a full PostgreSQL binary dump from Supabase/PostgreSQL:

```bash
# Execute pg_dump for backup
pg_dump -h db.your-supabase-id.supabase.co -U postgres -d postgres -F c -b -v -f backup_$(date +%Y%m%d).dump

# Restore from dump file
pg_restore -h db.your-supabase-id.supabase.co -U postgres -d postgres -v backup_20260802.dump
```

---

# 🏃 15. Running the Project

## 15.1 Development Mode

```bash
# Start backend API (NestJS with hot-reload)
cd backend
npm run start:dev

# Start frontend application (Next.js 16 App Router)
cd frontend
npm run dev
```

- **Frontend Customer Storefront**: Access at `http://localhost:3000`
- **Admin Dashboard**: Access at `http://localhost:3000/admin`
- **Backend API**: Access at `http://localhost:4000/v1`
- **Swagger Documentation**: Access at `http://localhost:4000/api/docs`

## 15.2 Docker Production Mode
To launch the complete application stack locally using Docker:

```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

---

# ☁️ 16. Deployment Guide

## 16.1 Frontend Deployment (Vercel)
1. Import the `frontend` repository folder into your Vercel Dashboard.
2. Set the Framework Preset to **Next.js**.
3. Configure the required Environment Variables (`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_RAZORPAY_KEY_ID`).
4. Trigger manual deployment or enable automated deployments on commit to `main`.

## 16.2 Backend Deployment (Render)
1. Create a new **Web Service** on Render connected to the `backend` directory.
2. Select **Node** as the runtime environment.
3. Set Build Command: `npm install && npm run build`.
4. Set Start Command: `npm run start:prod`.
5. Populate all environment variables listed in Section 13.1.
6. Configure Render Health Check path: `/v1/health`.

---

# 📚 17. API Documentation (Swagger)

The backend automatically builds interactive OpenAPI 3.0 documentation via NestJS Swagger module.

> [!TIP]  
> View interactive endpoint payloads, try out request parameters, and copy cURL examples by opening **`http://localhost:4000/api/docs`** in your browser.

```typescript
// Sample Swagger Annotation in Controller
@ApiOperation({ summary: 'Create a new customer order' })
@ApiResponse({ status: 201, description: 'Order created successfully', type: OrderResponseDto })
@ApiResponse({ status: 400, description: 'Invalid item selection or stock shortage' })
@BearerAuth()
@Post()
async createOrder(@Body() dto: CreateOrderDto, @CurrentUser() user: UserEntity) {
  return this.ordersService.create(dto, user);
}
```

---

# 🛒 18. Customer Application Modules

```mermaid
graph TD
    AUTH[1. Authentication] --> ONB[2. 3-Step Onboarding]
    ONB --> HOME[3. Home Dashboard]
    HOME --> SEARCH[Search & Filters]
    HOME --> PDP[4. Product Details PDP]
    PDP --> CART[5. Cart]
    CART --> CHK[6. Checkout & Payment]
    CHK --> ORD[7. Order Tracking]
    ORD --> REV[8. Reviews & Ratings]
    ORD --> PROF[9. Profile & Settings]
```

## Screen-by-Screen Functional Specifications

1. **Authentication Screen**: Clean interface allowing phone entry (MSG91 OTP), email login, or One-Tap Google OAuth. Displays 6-digit OTP input with auto-read and 30-second cooldown timer.
2. **3-Step User Onboarding**:
   - *Step 1 (Basic Details)*: Captures full name, email address, gender, and date of birth (enforcing 13+ age requirement).
   - *Step 2 (Delivery Address)*: Street address, apartment number, landmark, and automatic pincode auto-fill via GPS or manual entry.
   - *Step 3 (Pet Profile)*: Registers pet species (Dog, Cat, Bird, etc.), breed dropdown, weight in kg, dietary classification (Veg/Non-Veg), and allergy warnings.
3. **Home Dashboard**: Dynamic hero banner carousel, fast category navigation, "Buy Again" quick reordering pills, and pet-customized product carousels.
4. **Product Details Page (PDP)**: Swipeable image gallery, inline video player, dietary badge indicators, rich ingredient listings, feeding guidelines, variant selection, "Add to Cart", and product comparison tool.
5. **Cart & Checkout**: Real-time line item price adjustments, coupon code input, GST fee breakdown, Razorpay modal activation, address confirmation, and instant confirmation screen.
6. **Order Management & Live Map Tracking**: Visual milestone progress bar, courier tracking link, PDF invoice generator, item cancellation, and self-serve return flow.

---

# 🛡️ 19. Admin Panel Modules

```mermaid
graph TD
    LOGIN[Admin Auth] --> DASH[Dashboard Overview]
    DASH --> PROD[Product & Variant Manager]
    DASH --> CAT[Category Manager]
    DASH --> ORD[Order Fulfillment Pipeline]
    DASH --> CUST[Customer CRM]
    DASH --> PAY[Payment Reconciliation]
    DASH --> SHIP[Shipping & Logistics]
    DASH --> CMS[CMS & Legal Pages]
    DASH --> SETT[Store Configuration]
```

## Detailed Administrative Modules

1. **Dashboard Overview**: Metrics overview cards showing total monthly revenue, net orders, new customer registrations, out-of-stock item flags, and pending return requests alongside live sales charts.
2. **Product Management Hub**: Comprehensive product listing grid with instant filters, stock management, rich text editor for marketing copy, image uploader with primary flag toggles, and HSN code configuration.
3. **Order Fulfillment Pipeline**: Kanban-style or tabular order processing view (`New` → `Processing` → `Packed` → `Shipped` → `Delivered`), invoice generation, packaging slip printing, and courier tracking assignment.
4. **Customer CRM**: Detailed view of registered customers, lifetime purchase value, total order count, connected pet profiles, default delivery addresses, and account block/unblock capabilities.
5. **Payment Reconciliation & Refunds**: Log of Razorpay transaction IDs, payment method breakdowns, failed transaction diagnostic notes, and automated refund trigger buttons.
6. **CMS & Settings Hub**: Controls for managing site banner images, editing Privacy & Return Policy texts, authoring blog posts, modifying tax percentage defaults, and assigning sub-admin access roles.

---

# 🔒 20. Security Architecture

- **Helmet Middleware**: Configures security headers including `X-DNS-Prefetch-Control`, `X-Frame-Options` (DENY), `Strict-Transport-Security`, and `X-Content-Type-Options`.
- **Argon2id Password Hashing**: Utilizes memory-hard hashing parameter settings (Memory: 64MB, Iterations: 3, Parallelism: 4) to defeat offline GPU cracking.
- **Cross-Site Request Forgery (CSRF)**: Anti-CSRF token verification required for state-changing HTTP requests (`POST`, `PUT`, `DELETE`).
- **SQL Injection Prevention**: All database interactions are executed via Prisma ORM parameterized queries, eliminating string interpolation risks.
- **Cross-Site Scripting (XSS)**: Inputs sanitized using DTO validator rules; HTML output rendered in Next.js automatically escapes un-sanitized tags.
- **Rate Limiting**: Protected endpoints enforce strict request caps using `nestjs/throttler` backed by Upstash Redis counters.

---

# 🚀 21. Performance & Caching Strategy

```mermaid
flowchart LR
    REQ[Incoming Client Request] --> REDIS_CHECK{Key in Upstash Redis?}
    REDIS_CHECK -- Yes --> FAST_RESP[Return Cached Response < 15ms]
    REDIS_CHECK -- No --> DB_EXEC[Execute Optimized SQL Query]
    DB_EXEC --> WRITE_CACHE[Write Payload to Redis with TTL]
    WRITE_CACHE --> RESP[Return Data to Client < 120ms]
```

- **Upstash Redis Caching**: Hot catalog items, category trees, and site configurations are cached with automated cache invalidation hooks triggered during admin update events.
- **Asynchronous Queue Offloading**: Heavy computational tasks (rendering PDF invoices, sending transactional messaging, computing analytical reports) are queued in BullMQ.
- **Next.js Image Optimization**: Automatically serves Next.js images in WebP/AVIF formats, resized dynamically based on client device screen metrics.
- **Database Connection Pooling**: Prisma configured with optimized database connection pools (`connection_limit=20`) to prevent connection starvation under surge loads.

---

# 📊 22. Monitoring & Health Checks

- **Application Health Check Endpoint**: Live status route located at `/v1/health` using `@nestjs/terminus` monitoring database, Redis, and disk memory health.
- **Pino Structured Logging**: Outputs JSON formatted logs containing request IDs, processing duration, HTTP status code, and stack traces.
- **Better Stack Integration**: Captures real-time uptime health metrics and sends immediate alerts to engineers upon service degradation.

```json
{
  "status": "ok",
  "info": {
    "database": { "status": "up" },
    "redis": { "status": "up" },
    "storage": { "status": "up" }
  },
  "error": {},
  "details": {
    "database": { "status": "up" },
    "redis": { "status": "up" },
    "storage": { "status": "up" }
  }
}
```

---

# 📝 23. Logging System

The platform standardizes on structured, contextual logging across all layers:

- **Log Levels**:
  - `FATAL`: System crashes or critical sub-system unavailability.
  - `ERROR`: Unhandled runtime exceptions and failed third-party API integrations.
  - `WARN`: Deprecated API calls, rate-limiting triggers, and low stock warnings.
  - `INFO`: Key operational events (order placement, user signup, payment verification).
  - `DEBUG`: Detailed variable state traces for local developer debugging.

---

# 📬 24. Queue & Background Worker System

The queue architecture powered by **BullMQ** handles heavy background operations cleanly without blocking the main Express request execution thread.

```mermaid
flowchart TD
    API[NestJS API Event] -->|Enqueue Job| QUEUE[BullMQ Redis Queue]
    QUEUE --> W1[Notification Worker]
    QUEUE --> W2[PDF Generation Worker]
    QUEUE --> W3[Inventory Sync Worker]
    
    W1 -->|Failure| RETRY{Attempts < 3?}
    RETRY -- Yes -->|Exponential Backoff| QUEUE
    RETRY -- No --> DLQ[Dead Letter Queue DLQ]
```

- **Notification Worker**: Sends transactional SMS, WhatsApp updates, and HTML emails.
- **PDF Invoice Worker**: Compiles raw order payloads into formatted HTML templates and renders downloadable PDF documents.
- **Dead Letter Queue (DLQ)**: Jobs failing after 3 retries are placed into a DLQ for administrator review and manual re-triggering.

---

# 🔔 25. Notification System

| Channel | Provider | Category / Type | Trigger Event |
| :--- | :--- | :--- | :--- |
| **SMS** | MSG91 OTP Plan | Transactional | Login OTP, Password Reset, Registration Verification |
| **WhatsApp**| MSG91 WhatsApp | Utility | Order Confirmation, Shipment Tracking updates |
| **WhatsApp**| MSG91 WhatsApp | Marketing | Abandoned cart reminders, promotional broadcasts |
| **Email** | Resend API | Transactional | Order Invoice PDF, Password Reset link, Account Welcome |
| **Push** | Web Push API | Promotional | Flash sales, restocking notifications for wishlisted items |

---

# 🔍 26. Full-Text Search Engine

The platform leverages PostgreSQL native Full-Text Search using weighted document attributes:

```sql
-- Search query matching name (Weight A) and description (Weight B)
SELECT id, name, slug, ts_rank(
    setweight(to_tsvector('english', name), 'A') || 
    setweight(to_tsvector('english', coalesce(description, '')), 'B'),
    to_tsquery('english', 'chicken & kibble')
) AS rank
FROM "PRODUCTS"
WHERE to_tsvector('english', name || ' ' || description) @@ to_tsquery('english', 'chicken & kibble')
ORDER BY rank DESC;
```

---

# 💳 27. Payment Integration & Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant App as Storefront App
    participant Backend as NestJS API
    participant RZP as Razorpay Gateway
    participant DB as Shared DB

    Customer->>App: Click "Place Order"
    App->>Backend: POST /v1/payments/create-order
    Backend->>RZP: Create Order (Amount, Currency, Receipt ID)
    RZP-->>Backend: Return Razorpay Order ID (`order_xyz123`)
    Backend->>DB: Save Payment Record (Status: PENDING)
    Backend-->>App: Return Order ID & Gateway Key
    App->>Customer: Launch Razorpay Checkout Modal
    Customer->>RZP: Complete Payment (UPI / Card / NetBanking)
    RZP-->>App: Pass Payment Signature Payload
    App->>Backend: POST /v1/payments/verify
    Backend->>Backend: Verify HMAC-SHA256 Signature
    alt Signature Valid
        Backend->>DB: Update Payment Status (SUCCESS) & Order Status (CONFIRMED)
        Backend-->>App: Verification Succeeded
    else Signature Invalid
        Backend->>DB: Update Payment Status (FAILED)
        Backend-->>App: Verification Failed
    end
    RZP->>Backend: Webhook Event (`payment.captured`) [Async Backup]
```

---

# 📦 28. Order Processing Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Pending: Customer Initiates Checkout
    Pending --> Confirmed: Payment Verified / COD Approved
    Pending --> Cancelled: Payment Timeout / Failed
    Confirmed --> Packed: Admin Accepts & Packs Order
    Confirmed --> Cancelled: Customer/Admin Cancels Order
    Packed --> Shipped: AWB Generated & Courier Handover
    Shipped --> OutForDelivery: Local Hub Dispatch
    OutForDelivery --> Delivered: Order Received by Customer
    OutForDelivery --> RTO: Delivery Failed / Rejected
    Delivered --> ReturnInitiated: Customer Requests Return (7 Days)
    ReturnInitiated --> RefundProcessed: Items Inspected & Refund Triggered
```

---

# 📁 29. Folder Naming Convention

- **Directories**: `kebab-case` (e.g., `product-catalog`, `user-onboarding`).
- **React Components**: `PascalCase` (e.g., `ProductCard.tsx`, `OrderStatusBadge.tsx`).
- **Services & Controllers**: `kebab-case` with dots (e.g., `orders.service.ts`, `auth.controller.ts`).
- **DTOs & Entities**: `kebab-case` with type suffix (e.g., `create-order.dto.ts`, `user.entity.ts`).
- **Interfaces & Types**: `kebab-case` with dot (e.g., `order.interface.ts`).

---

# 📏 30. Code Standards & Architecture Guidelines

- **Single Responsibility Principle (SRP)**: Controllers handle HTTP routing only; all business logic stays inside Service classes. Database access is isolated strictly to Repository/Prisma services.
- **DTO Validation**: Every incoming request payload must be typed via a DTO class with strict `class-validator` annotations.
- **Explicit Return Types**: All functions and API controllers must explicitly state their TypeScript return types.
- **Immutability**: Avoid mutating objects or arrays directly; use modern ES6 spread syntax or immutable data patterns.

---

# 🔀 31. Git Workflow

We enforce the **GitFlow** branching strategy across all development cycles:

- **`main`**: Production-ready code matching live deployment.
- **`develop`**: Integration branch for new features.
- **`feature/feature-name`**: Short-lived feature development branches off `develop`.
- **`bugfix/issue-name`**: Patch fixes off `develop`.
- **`hotfix/critical-issue`**: Urgent production bug fixes branched directly off `main`.

### Conventional Commit Standard Format
`type(scope): concise description`  
*Examples*:
- `feat(cart): implement instant quantity calculation update`
- `fix(payments): verify razorpay webhook hmac signature correctly`
- `docs(readme): add detailed installation instructions`

---

# 🧪 32. Testing Strategy

## 32.1 Unit Testing (Jest)
Test isolated business logic services, helper functions, and DTO validators:
```bash
cd backend
npm run test
```

## 32.2 Integration & E2E Testing (Supertest & Playwright)
Test controller routes, database operations, and complete browser user flows:
```bash
cd backend
npm run test:e2e
```

---

# 🔄 33. CI/CD Pipeline

Automated pipelines managed via **GitHub Actions**:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - name: Install Backend Dependencies
        run: cd backend && npm ci
      - name: Run Backend Linter & Tests
        run: cd backend && npm run lint && npm run test
      - name: Install Frontend Dependencies
        run: cd frontend && npm ci
      - name: Build Next.js Application
        run: cd frontend && npm run build
```

---

# 📈 34. Scalability Roadmap

| Traffic Level | Architecture Adjustments | Infrastructure Scale |
| :--- | :--- | :--- |
| **100 DAU** | Single Render container + Supabase Pro DB | Render Base Node + Supabase Pro |
| **1,000 DAU** | Add Upstash Redis caching for product catalog & sessions | Multi-instance Render containers |
| **10,000 DAU** | Separate BullMQ queue worker node; add Cloudflare Edge caching | Render Autoscaling (2-4 instances) |
| **100,000 DAU** | Database read-replicas, elastic Redis cluster, CDN asset offload | Read-Replicas + Multi-region Render |
| **1,000,000 DAU**| Microservices separation for Payments, Orders, and Search | Kubernetes cluster (EKS/GKE) |

---

# 🔮 35. Future Roadmap & Phase 2 Improvements

- [ ] **Subscription & Auto-Replenishment Engine**: Allow users to set weekly/monthly automatic re-ordering for pet food items.
- [ ] **Veterinary Tele-Consultation Module**: In-app booking for online vet appointments.
- [ ] **Loyalty Rewards & Gamification**: Earn "Paw Points" on purchases redeemable for instant discounts.
- [ ] **AI Dietary Nutrition Advisor**: LLM-powered chatbot offering custom diet advice based on pet health history.
- [ ] **Multi-Warehouse Inventory Tracking**: Location-aware warehouse allocation for faster local delivery times.

---

# 📄 36. License

Distributed under the **MIT License**. See `LICENSE` for more information.

```
MIT License

Copyright (c) 2026 SevenX Labs

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

# 🤝 37. Contributors & Core Team

- **Lead Software Architect**: SevenX Engineering Team (`architecture@sevenxlabs.com`)
- **Backend Staff Engineer**: NestJS & Database Systems Group (`backend@sevenxlabs.com`)
- **Frontend Technical Lead**: UI/UX & Web Performance Group (`frontend@sevenxlabs.com`)

---

# 🆘 38. Support & Community

For technical support, integration questions, or reporting bugs:
- **GitHub Issues**: [Open an issue](https://github.com/sevenx-labs/pet-food-platform/issues)
- **Developer Forum**: [Join Community Discussions](https://github.com/sevenx-labs/pet-food-platform/discussions)

---

# 📬 39. Contact & Communication

- **Company / Lab**: SevenX Labs
- **Official Website**: [https://sevenxlabs.com](https://sevenxlabs.com)
- **Engineering Email**: `engineering@sevenxlabs.com`

---

# 🙏 40. Acknowledgements & Credits

- [NestJS Framework](https://nestjs.com/)
- [Next.js App Router](https://nextjs.org/)
- [Supabase Platform](https://supabase.com/)
- [Upstash Redis](https://upstash.com/)
- [shadcn/ui Design System](https://ui.shadcn.com/)
- [Prisma ORM](https://www.prisma.io/)
- [Razorpay Payments](https://razorpay.com/)
- [MSG91 Messaging API](https://msg91.com/)
- [Resend Email Platform](https://resend.com/)

---
*Built with ❤️ by SevenX Labs Engineering Team.*
