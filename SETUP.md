# Al-Resalah Club Platform - Setup Guide

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- Git (optional, for version control)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd "c:\Users\goodo\Downloads\ملف الهاكاثون\AL-RESALAH CLUB 2"
npm install
```

### 2. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in project details:
   - **Name**: Al-Resalah Club
   - **Database Password**: (create a strong password)
   - **Region**: Choose closest to your location
4. Wait for project to be created (~2 minutes)

### 3. Run Database Schema

1. In your Supabase project, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase-schema.sql`
4. Paste into the SQL Editor
5. Click "Run" to execute the schema
6. Verify all tables were created in the **Table Editor**

### 4. Create Storage Bucket

1. Go to **Storage** in Supabase dashboard
2. Click "Create a new bucket"
3. Name it `media`
4. Make it **public**
5. Click "Create bucket"

### 5. Create Admin User

1. Go to **Authentication** > **Users**
2. Click "Add user"
3. Choose "Create new user"
4. Enter:
   - **Email**: admin@alresalah.club (or your preferred email)
   - **Password**: (create a strong password)
   - **Auto Confirm User**: ✅ Yes
5. Click "Create user"

### 6. Get Supabase Credentials

1. Go to **Project Settings** > **API**
2. Copy the following values:
   - **Project URL** (looks like: https://xxxxx.supabase.co)
   - **anon public** key
   - **service_role** key (click "Reveal" to see it)

### 7. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   copy .env.local.example .env.local
   ```

2. Open `.env.local` and fill in your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ADMIN_EMAIL=admin@alresalah.club
   ```

### 8. Run Development Server

```bash
npm run dev
```

The application will start at [http://localhost:3000](http://localhost:3000)

### 9. Test Admin Login

1. Navigate to [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
2. Sign in with the admin credentials you created in Step 5
3. You should be redirected to the admin dashboard

## Verification Checklist

- [ ] Homepage loads successfully
- [ ] Admin login works
- [ ] Admin dashboard displays statistics
- [ ] Can create a new course
- [ ] Can view courses on public page
- [ ] Dark mode toggle works
- [ ] QR code generation works
- [ ] Share button displays modal with link and QR

## Common Issues

### "Cannot find module" errors

**Solution**: Run `npm install` again

### Database connection errors

**Solution**: 
1. Verify your `.env.local` has correct Supabase URL and keys
2. Check that the SQL schema was executed successfully
3. Ensure your Supabase project is active

### "No available seats" error when registering

**Solution**: 
1. Check that the course has `total_seats` > 0
2. Verify `available_seats` is not 0
3. Check the database trigger is working

### Admin login fails

**Solution**:
1. Verify the user exists in Supabase Auth
2. Check that the email and password are correct
3. Ensure the user is confirmed (Auto Confirm was enabled)

## Next Steps

1. **Customize Branding**: Update colors in `app/globals.css`
2. **Add Content**: Create courses, programs, and announcements
3. **Test Registration**: Create a registration form and test the flow
4. **Deploy**: Follow deployment instructions in README.md

## Production Deployment

### Environment Variables for Production

Add these to your hosting platform (Vercel, Netlify, etc.):

```
NEXT_PUBLIC_SUPABASE_URL=your-production-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key
ADMIN_EMAIL=admin@alresalah.club
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Security Checklist for Production

- [ ] Change default admin password
- [ ] Enable Row Level Security (already done in schema)
- [ ] Set up email templates in Supabase
- [ ] Configure custom domain
- [ ] Enable HTTPS (automatic on Vercel/Netlify)
- [ ] Set up backup strategy for database
- [ ] Monitor activity logs regularly

## Support

For issues or questions:
1. Check the README.md file
2. Review Supabase documentation: https://supabase.com/docs
3. Check Next.js documentation: https://nextjs.org/docs

---

© 2026 Al-Resalah Club
