# DermaAI - Next Steps & Setup Guide

Welcome to **DermaAI**, an elite Next.js (App Router) web application built with Tailwind CSS, Supabase (Auth + PostgreSQL), and the Gemini API for personalized skincare ingredient safety analysis.

Follow these step-by-step instructions to connect your live Supabase database, Gemini API key, custom brand assets, and run the development server.

---

## 1. Environment Variable Setup (`.env.local`)

Duplicate the template file `.env.local.example` to create your local environment file:

```bash
cp .env.local.example .env.local
```

Open `.env.local` and populate your API credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here

# Gemini API Configuration (Server-Side Only)
GEMINI_API_KEY=your-gemini-api-key-here
```

### Where to obtain these keys:
- **Supabase Credentials**: Go to your [Supabase Dashboard](https://supabase.com/dashboard) -> Select Project -> **Project Settings** -> **API**. Copy the Project URL and `anon` public API key.
- **Gemini API Key**: Visit [Google AI Studio](https://aistudio.google.com/app/apikey) to generate a free Gemini API key.

---

## 2. Execute Database Schema in Supabase

1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Navigate to the **SQL Editor** tab in the left sidebar.
3. Click **New Query**.
4. Copy the complete SQL script from `supabase/schema.sql` (located at `c:/Users/victus/OneDrive/Desktop/DermaAI (new)/supabase/schema.sql`).
5. Paste the SQL script into the query editor and click **Run**.

### What `schema.sql` creates:
- `users_profiles` table: Stores `id` (references `auth.users`), `name`, `skin_type`, `skin_shade`, and `allergies` (text array).
- `scans` table: Stores `id`, `user_id`, `product_name`, `compatibility_status`, `reasoning`, and `scanned_at`.
- **Strict Row Level Security (RLS)**: Enforces policies so authenticated users can strictly SELECT, INSERT, and UPDATE only their own data (`auth.uid() = id`).

---

## 3. Brand Asset & Custom Font Placement

To finalize the DermaAI design aesthetic:

### Logo Asset:
1. Locate the logo file `image_0.png`.
2. Copy `image_0.png` into the `/public` directory as `logo.png`:
   ```text
   public/logo.png
   ```

### Custom Font Asset ("Silver Editorial"):
1. Place your WOFF2 font files into the `/public/fonts` directory:
   ```text
   public/fonts/SilverEditorial-Regular.woff2
   public/fonts/SilverEditorial-Italic.woff2
   ```
2. Open `app/layout.tsx` and uncomment the `localFont` configuration block to load the WOFF2 files directly. *(Note: A high-elegance serif fallback is currently active so the app compiles cleanly).*

---

## 4. Running the Local Development Server

1. Open your terminal in the project directory:
   ```bash
   cd "c:\Users\victus\OneDrive\Desktop\DermaAI (new)"
   ```

2. Run the Next.js development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to:
   [http://localhost:3000](http://localhost:3000)

---

## 5. Summary of Built Pages & Routes

- `/` : Public Landing Page matching the DermaAI Creamy Off-White & Deep Espresso Brown theme.
- `/login` : Sign In page with Sandy Beige Accent action buttons.
- `/signup` : Sign Up page redirecting immediately to the Skin Wizard.
- `/wizard` : Interactive multi-step Skin Profile Wizard (collecting skin type, shade, sensitivities).
- `/home` : Main Scan Engine UI supporting **Type Manually**, **Upload Image**, and **Take Photo (WebCam access)** modes with server-side Gemini AI analysis and skeletal loading.
- `/history` : Scan History page listing past product evaluations and status.
- `/profile` : Read-Only Skin Details profile view.
- `/about`, `/privacy`, `/terms` : Static informational and legal disclaimers.

---

*DermaAI Security Standard • Server-Side Gemini API Engine & Supabase RLS*
