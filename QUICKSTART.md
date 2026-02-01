# Quick Start Guide - Al-Resalah Club Platform

## ⚠️ IMPORTANT: Before Running

You **MUST** complete these steps before running `npm run dev`:

### Step 1: Install Dependencies ✅
```bash
npm install
```

### Step 2: Set Up Supabase Database 🗄️

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Click "New Project"
   - Name: "Al-Resalah Club"
   - Set a strong database password
   - Choose your region
   - Wait ~2 minutes for creation

2. **Run Database Schema**
   - Open your Supabase project
   - Go to **SQL Editor** (left sidebar)
   - Click "New Query"
   - Open the file `supabase-schema.sql` in this project
   - Copy ALL contents and paste into SQL Editor
   - Click **"Run"** button
   - Wait for success message

3. **Create Storage Bucket**
   - Go to **Storage** (left sidebar)
   - Click "Create a new bucket"
   - Name: `media`
   - Make it **Public** ✅
   - Click "Create bucket"

4. **Create Admin User**
   - Go to *u*Athentication** > **Users**
   - Click "Add user" > "Create new user"
   - Email: `admin@alresalah.club` (or your email)
   - Password: (create a strong password - SAVE THIS!)
   - **Auto Confirm User**: ✅ YES
   - Click "Create user"

### Step 3: Get Supabase Credentials 🔑

1. Go to **Project Settings** > **API**
2. Copy these values:
   - **Project URL** (e.g., https://xxxxx.supabase.co)
   - **anon public** key (long string)
   - **service_role** key (click "Reveal" to see it)

### Step 4: Create Environment File 📝

1. Create a new file named `.env.local` in the project root
2. Add this content (replace with YOUR values):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
ADMIN_EMAIL=admin@alresalah.club
```

### Step 5: Run the Project 🚀

```bash
npm run dev
```

The app will start at: http://localhost:3000

### Step 6: Login to Admin Dashboard 🔐

1. Open browser: http://localhost:3000/admin/login
2. Enter your admin email and password (from Step 2.4)
3. Click "Sign In"
4. You should see the admin dashboard!

---

## ❌ Common Issues

**"Cannot find module" errors**
- Solution: Run `npm install` again

**"Invalid login credentials"**
- Solution: Make sure you created the admin user in Supabase Auth
- Check that "Auto Confirm User" was enabled
- Try the exact email/password you set

**Database errors**
- Solution: Make sure you ran the ENTIRE `supabase-schema.sql` file
- Check Supabase SQL Editor for any error messages
- Verify all tables were created (go to Table Editor)

**Environment variable errors**
- Solution: Make sure `.env.local` exists in project root
- Check that all values are filled in (no "your-xxx-here" placeholders)
- Restart the dev server after changing `.env.local`

---

## 📋 Checklist

Before running `npm run dev`, make sure:

- [ ] Supabase project created
- [ ] `supabase-schema.sql` executed successfully
- [ ] `media` storage bucket created
- [ ] Admin user created in Supabase Auth
- [ ] `.env.local` file created with real credentials
- [ ] Dependencies installed (`npm install`)

Once all checked, run: `npm run dev`

---

**Need help?** Check `SETUP.md` for detailed instructions.
