# SevenX Labs — Freelance Tech Studio Toolkit

SevenX Labs is a production-ready, premium SaaS toolkit designed for tech freelancers and creative studios to generate professional **Invoices**, **Agreements**, and **NDAs** with live A4 previews, automated local storage persistence, high-res PDF downloads, and Prisma ORM + PostgreSQL integration.

![SevenX Labs](/logo.svg)

---

## 🌟 Key Features

- ⚡ **Direct Access Dashboard (`/`)**: Real-time analytics overview (Total Invoiced, Paid Invoices, Signed Contracts, Active NDAs), quick action triggers, and interactive recent documents history table.
- 🧾 **Invoice Generator (`/invoice`)**: Split layout with dynamic form inputs, auto-incrementing `SXL-INV-001` counter, dynamic line items math, tax/discount calculation, non-GST disclaimer, and instant A4 PDF export.
- 📄 **Agreement Generator (`/agreement`)**: Project scope, deliverables, timeline (start date & deadline), financial milestone splits (advance & final %), revision caps, IP transfer clauses, and typed signatures.
- 🔒 **NDA Generator (`/nda`)**: Project context, confidentiality definitions, duration selector (1, 2, 3, 5 years), return/destroy policies, breach penalties, and typed signatures.
- 📂 **Document History (`/history`)**: Centralized document manager with search, status filters (Draft, Sent, Paid, Signed), view details modal, and delete options.
- ⚙️ **Studio Settings (`/settings`)**: Persistent freelancer profile (Name, Company, Address, Contact, UPI ID, Bank Details, PayPal) that auto-populates all generators.
- 🎨 **Premium Tech Aesthetic**: Dark theme (`#0A0A0A` base, `#171717` cards, glassmorphic accents, `#8B5CF6 → #3B82F6` purple-to-blue gradient highlights) inspired by Linear, Vercel, and Raycast.
- 🔒 **Client-Side Privacy & Storage**: All default profiles and created document drafts persist in `localStorage` without requiring mandatory login.
- 🗄️ **Prisma ORM & PostgreSQL Ready**: Scalable Prisma database schema with models for `Profile`, `Invoice`, `InvoiceItem`, `Agreement`, and `NDA`.

---

## 🚀 Tech Stack

- **Framework**: [Next.js 16 App Router](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.react.dev/)
- **ORM & Database**: [Prisma ORM v6](https://www.prisma.io/) + Supabase PostgreSQL
- **PDF Generation**: [html2canvas](https://html2canvas.hertzen.com/) + [jsPDF](https://github.com/parallax/jsPDF)
- **State & Theme**: `localStorage` + `next-themes` + `sonner` toasts

---

## 🛠️ Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Configure your PostgreSQL / Supabase connection in `.env`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/sevenx_labs?schema=public"
DIRECT_URL="postgresql://postgres:password@localhost:5432/postgres"
```

### 3. Prisma Client Setup

```bash
npm run prisma:validate
npm run prisma:generate
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Build & Production

```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```
contractkit/
├── src/
│   ├── app/
│   │   ├── page.tsx            # Dashboard Overview
│   │   ├── invoice/page.tsx    # Invoice Generator (Form + Live A4 Preview)
│   │   ├── agreement/page.tsx  # Agreement Generator (Form + Live A4 Preview)
│   │   ├── nda/page.tsx        # NDA Generator (Form + Live A4 Preview)
│   │   ├── history/page.tsx    # Document History Manager
│   │   ├── settings/page.tsx   # Studio Profile & Payment Defaults
│   │   ├── layout.tsx          # App Shell & ThemeProvider
│   │   └── globals.css         # Tailwind v4 glassmorphism & gradients
│   ├── components/
│   │   ├── logo/SevenXLogo.tsx # Stylized SevenX Labs Gradient Logo
│   │   ├── layout/             # Sidebar, TopBar, AppShell
│   │   └── providers/          # ThemeProvider & Sonner Toaster
│   ├── hooks/
│   │   └── usePDFExport.ts     # Client-side html2canvas + jsPDF engine
│   ├── lib/
│   │   ├── prisma.ts           # Next.js 16 Global Singleton Prisma Instance
│   │   ├── storage.ts          # LocalStorage persistence & auto-increment
│   │   ├── constants.ts        # Boilerplate clauses & default profiles
│   │   └── utils.ts            # Currency & date formatters, math utilities
│   └── types/
│       └── index.ts            # Full TypeScript interfaces
├── prisma/
│   └── schema.prisma           # Database models & enums
└── public/
    └── logo.svg                # Brand SVG Asset
```

---

## 📝 License

Distributed under the MIT License. Built for **SevenX Labs**.
