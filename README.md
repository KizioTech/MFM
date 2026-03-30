# Mlimi Anyamuke Fashion Magazine (MFM)

Welcome to the Mlimi Anyamuke Fashion Magazine source code repository! MFM is a modern, responsive, visually striking web application built to showcase High Fashion, Streetwear, Heritage Textiles (Chitenje), and Couture from Malawi.

This platform operates as both a reader-facing digital magazine and an admin-facing content management system (CMS) fully powered by **React**, **Vite**, **TypeScript**, **TailwindCSS**, and **Supabase**.

---

## 🚀 Key Features

### For Readers
- **Article Discovery:** Read curated fashion articles broken down into specific "Altitudes" (The Peak, The Plateau, The Foothills, Heritage Lab).
- **Authentication:** Sign up/Sign in seamlessly using Email & Password or **Google OAuth** (using native Supabase Auth). Profiles are automatically generated upon first login.
- **Engagement:** Registered users can "Like" articles or save their favorite looks to a private **Mood Board**.
- **Newsletter:** Public landing pages to seamlessly capture subscriber emails directly to the database.

### For Administrators
- **Role-Based Access Control:** Secure Admin Dashboards accessible only to users assigned the `admin` role in the `user_roles` database table via PostgreSQL Row Level Security (RLS).
- **Full CMS Editor:** A dedicated `/admin/posts/new` interface to draft, edit, and publish new fashion articles.
- **Image Uploads:** Admins can effortlessly upload high-resolution Cover Images directly from their local computer. Images are securely hosted in a dedicated Supabase `post_images` storage bucket.
- **Mock Data Migration:** A built-in "Seed Mock Data" tool specifically designed to instantly migrate localized mock assets (`src/data/articles.ts`) to the live PostgreSQL Database and Storage buckets.

---

## 🛠️ Technology Stack

- **Frontend Framework:** React 18 & React Router DOM
- **Build Tool:** Vite
- **Styling:** TailwindCSS + `tailwindcss-animate`
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) (Radix UI + Lucide Icons)
- **Data Fetching:** React Query (`@tanstack/react-query`)
- **Backend & Database:** [Supabase](https://supabase.com/) (PostgreSQL, GoTrue Auth, Storage)

---

## 📦 Local Setup Instructions

### 1. Install Dependencies
Ensure you have Node.js (v18+) installed, then run:

```bash
npm install
```

### 2. Connect to Supabase
You will need a Supabase project and the Supabase CLI installed locally. Connect the project by running:

```bash
npx supabase login
npx supabase link --project-ref <your-project-id>
```

Update your `.env` file with the connection keys found in your Supabase Dashboard under **Project Settings > API**:

```env
VITE_SUPABASE_URL=https://<your-project-id>.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5c...
```

### 3. Database Migrations
Push the database schema (Tables, RLS Policies, Postgres Triggers, and Storage Buckets) directly to your remote database using the SQL migrations located in `supabase/migrations`:

```bash
npx supabase db push
```

### 4. Enable OAuth (Optional)
If utilizing Google Sign In, remember to visit **Authentication > Providers** in the Supabase Dashboard. Enable Google and input your Google Cloud Console `Client ID` and `Client Secret`. Ensure your Authorized Redirect URIs match your project's Callback URL.

### 5. Start Development Server
Spin up the local Vite server:

```bash
npm run dev
```
Navigate to `http://localhost:5173` in your browser.

---

## 🔑 Admin Operations

### Promoting a User to Admin
Because of RLS, you must run this raw SQL command in the **Supabase Dashboard "SQL Editor"** to grant specific user accounts Admin privileges (replace `UID_HERE` with their Auth User ID):

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('UID_HERE', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

### Seeding the Initial Articles
Upon first launching the project as an Admin, navigate to **`/admin/posts`**. Click the **"Seed Mock Data"** button to automatically upload the default layout images (e.g. `hero-fashion-1.jpg`) to your remote Supabase storage and populate the `articles` database table for rendering across the entire application.
