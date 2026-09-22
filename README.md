# ResellBoost Pro - Admin Analytics & User Dashboard

A modern, high-performance web dashboard built with **React**, **Vite**, **Tailwind CSS**, and **Supabase** for monitoring active Chrome Extension users, subscription tiers (Free vs Pro vs 7-Day Trial), and automation statistics.

---

## Features

- 📊 **Real-time KPI Metrics**: Total Installs, Active Today (DAU), 7-Day Active (WAU), Pro Subscribers, Trial Users, Free Users.
- 📈 **Tier & Health Visualizers**: Segmented progress charts, conversion ratios, and engagement breakdown.
- 📋 **User Directory & Filtering**:
  - Search by User UUID, Email, or License Key.
  - Filter by Plan Tier (`All`, `Pro Only`, `7-Day Trial`, `Free Tier`, `Active Today`).
  - View individual platform activity, lifetime shares, follows, offers, and install dates.
  - 1-click **Grant Pro** or **Revoke Pro** remote control.
- 🔑 **VIP / Pro License Key Generator**: Generate official keys (`RB-PRO-XXXXX`, `VIP-XXXXX`) directly recognized by the extension offline & online.
- ⚡ **Instant Demo Mode**: Pre-loaded with realistic sample seller data so you can test all features immediately without configuring a database first.
- ☁️ **Supabase Cloud Ready**: Seamlessly connect to your free Supabase database with live SQL migration included.

---

## Quick Start

### 1. Run the Dashboard Locally

```bash
cd e:\extensions\admin-dashboard
npm run dev
```

Open `http://localhost:5173` in your browser.

### 2. Connect Live Supabase Database (Optional)

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in your Supabase dashboard.
3. Open `e:\extensions\supabase_schema.sql`, copy all contents, paste into the SQL editor, and click **Run**.
4. In the Admin Dashboard web app, click the **Settings** icon (top right) or **Demo Mode** button.
5. Paste your Supabase **Project URL** and **Anon Public Key**.
6. Toggle Demo Mode OFF and click **Save Configuration**.
7. To connect your Chrome extension as well, copy the same Project URL and Anon Key into `e:\extensions\src\lib\supabase-config.ts` and run `npm run build`.

---

## Build for Production / Free Hosting

To host this dashboard for free on Vercel, Netlify, or Cloudflare Pages:

```bash
npm run build
```

Upload the generated `dist/` directory or connect your Git repository.
