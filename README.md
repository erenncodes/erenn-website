# Erenn Codes — Celebration & Digital Keepsake Store

A high-converting e-commerce web platform for bespoke, personalized digital celebration and milestone websites (Birthdays, Proposals, Anniversaries, Apologies, and Eid/Festive occasions).

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Start the local development server
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite (SWC)
- **Styling**: Tailwind CSS, Radix UI (shadcn/ui), Framer Motion, Lucide React
- **Backend & Database**: Supabase (PostgreSQL, Auth, Storage)
- **State Management**: TanStack React Query v5
- **Routing**: React Router v7

---

## 🗄️ Setting Up Your Supabase Database

1. Create a free account & project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Open `supabase/SETUP_NEW_PROJECT.sql` from this repository, copy its entire contents, paste it into the SQL Editor, and click **Run**.
   - This creates all required tables (`products`, `orders`, `contact_messages`, `reviews`, `user_roles`).
   - It sets up storage buckets (`product-images`, `payment-screenshots`) and security policies.
   - It automatically restores all 15 template products into your database!
4. Go to **Project Settings > API** in your Supabase dashboard.
5. Update your `.env` file with your new credentials:
   ```env
   VITE_SUPABASE_URL="https://YOUR_PROJECT_ID.supabase.co"
   VITE_SUPABASE_PUBLISHABLE_KEY="YOUR_SUPABASE_ANON_KEY"
   ```

---

## 👑 Accessing the Admin Dashboard (`/admin`)

1. Start the app and create an account at `/auth`.
2. In Supabase, go to the **SQL Editor** and promote your account to admin:
   ```sql
   UPDATE public.user_roles 
   SET role = 'admin' 
   WHERE user_id = (SELECT id FROM auth.users WHERE email = 'your-email@example.com');
   ```
3. Visit `/admin` to add/edit products, manage orders, and view incoming messages.

---

## ⚙️ Customizing Business Details & Pricing

Edit `src/data/siteConfig.ts` to update:
- **WhatsApp Phone Number** (`whatsappNumber`)
- **Bank & Mobile Wallet Details** (Bank Alfalah, EasyPaisa, JazzCash, Crypto/Binance)
- **Exchange Rates & Supported Currencies** (PKR, INR, USD, GBP)
- **Social Media Links** (Instagram, YouTube)
