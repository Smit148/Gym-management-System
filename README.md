# GymOS — Modern Gym Management System

**GymOS** is a calm, high-performance, and mobile-responsive gym management platform. It is engineered to streamline business operations, simplify CRM workflows, track attendance footprints, maintain payment ledgers, log expenses, and deliver real-time financial insights for gym owners, receptionists, and accountants.

---

## 🚀 Key Modules & Features

### 📊 1. Analytics Dashboard
- **Live Business Snapshot**: Displays real-time KPIs (Active Members, Today's Footfall, Current Month Collections, and Budgeted Expenses).
- **7-Day Attendance Trend**: Interactive bar chart displaying active member check-in trends over the last 7 calendar days.
- **Activity Log Feed**: Real-time transactional event log showing checked-in members, new payments recorded, and updated leads.
- **Quick Action Triggers**: Instant shortcut links for recording payments, check-ins, adding members, and registering leads.

### 🎯 2. Leads CRM Pipeline
- **Funnel Stage Tracking**: Manages prospects through a clean workflow pipeline (`New` ➔ `Contacted` ➔ `Trial` ➔ `Follow-up` ➔ `Converted` ➔ `Lost`).
- **Follow-up Calendar Scheduler**: Records interaction details (call, visit, WhatsApp, etc.), schedules follow-up calls, and flags overdue targets in red.
- **Convert-to-Member Flow**: Instant pre-filled wizard that translates a lead into an active member profile.

### 👥 3. Members Ledger
- **Profiles & Memberships**: Tracks duration, start/end dates, membership plans, and status (`Active`, `Inactive`, `Expired`, `Frozen`).
- **Health Indicators**: Dynamically calculates and displays health badges (`Healthy`, `Attention`, `At Risk`) based on member check-in frequencies.
- **Timeline & Audits**: Displays a complete member activity history (check-in/out stamps, conversions, payments, follow-ups).
- **Flexible Tagging**: Allows adding descriptive status tags (e.g., `VIP`, `Morning`, `Trainer Required`) for advanced categorization.

### ⏱️ 4. Daily Attendance Desk
- **Reception Desk Desk**: Allows receptionist manual check-ins using member search, featuring check-in logs and custom remarks (e.g. `Late Entry`, `Guest Pass`).
- **Active Sessions Monitor**: Tracks who is currently inside the gym facility. Clicking the checkout action records checkout times instantly.
- **Historic Attendance Log**: Audits all check-ins, dates, methods (`manual`, `qr`, `receptionist`), and checkout durations.

### 💳 5. Payments Ledger
- **Financial Receipts Tracking**: Stores payment records with automatic receipts formatting (`GYM-2026-XXXX`) based on a sequential sequence builder.
- **Multiple Payment Modes**: Supports tracking transactions paid via UPI, Cash, Card, or Bank Wires.
- **Billing Details**: Highlights member IDs, receipt numbers, paid dates, and plan categories.

### 📤 6. Expenses Module
- **Outflow Categories**: Manages operating expenses (Rent, Staff Salaries, Electricity, supplements, Maintenance, internet, etc.).
- **Recurring Profiles**: Flags ongoing monthly subscription or premise liabilities with frequency options.
- **Planned vs. Paid**: Tracks scheduled/budgeted payments alongside completed outflows.

### 📊 7. Reports & Financial Insights
- **Cashflow Aggregations**: Automatically computes total revenues, outflows, and net profit margins based on the ledger databases.
- **Expense Distribution**: Displays a breakdown of business operational costs by category percentages.
- **Member Status Growth**: Tracks trends of active, expired, and frozen memberships month-by-month.
- **Funnel Analytics**: Displays conversion statistics across the CRM sales funnel.

---

## 🛠️ Architecture & Tech Stack

GymOS is built using modern frontend engineering patterns:
- **Core Framework**: React 19 & TypeScript (Vite HMR).
- **Global UI & Auth State**: Zustand (encapsulated store engines).
- **Server Cache & Sync**: React Query (declarative data fetching, caching, mutations, and automatic invalidations).
- **Design System**: Vanilla CSS Variables layout engine featuring multi-theme support (**Blue**, **Green**, **Orange**, **Purple**) and dynamic light/dark mode markers.
- **Icons**: Lucide React.
- **Data Schemas**: Zod validation.

---

## ⚡ Performance & Security Engineering

### 📦 Dynamic Code-Splitting (Lazy Loading)
To keep the application initial load speed extremely fast, large third-party libraries (`jspdf` and `jspdf-autotable`) are code-split. They are loaded dynamically *only* when the user clicks the "Export PDF" button. This dynamically reduces the main JavaScript bundle from **1.08 MB** to **655 KB**, ensuring a fast initial bundle load.

```ts
// Example: Dynamic Promise.all dynamic imports
const [{ jsPDF }, { default: autoTable }] = await Promise.all([
  import('jspdf'),
  import('jspdf-autotable'),
])
```

### 📱 Mobile-First Fluid Responsiveness
- **Layout Restructuring**: Employs structural width guards (`min-width: 0` and `overflow-x: hidden` on layout containers) to prevent horizontal viewport stretching and eliminate the need for manual browser zooming.
- **Flex-Wrap & Auto-fit Grids**: Stats cards, headers, and quick-actions automatically wrap to column structures on smaller viewports.
- **Scrollable Tabs & Tables**: Navigation filter tabs scroll horizontally within custom bounds on display sizes less than `375px`, keeping the page structure clean.

### 🔒 Privacy-Focused Export Design
Both PDF and CSV exporters explicitly map only user-facing values. System internal DB keys, UUID identifiers, tenant indicators, or sensitive background attributes are filtered out.

---

## ⚙️ Setup and Installation

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Hrishikeshchauhan09/Gym-management-System.git
   cd Gym-management-System
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

4. Build for production:
   ```bash
   npm run build
   ```
   This will output optimized, minified bundle files inside the `dist/` directory.
