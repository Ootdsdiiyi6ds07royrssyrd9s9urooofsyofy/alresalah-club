# 🎓 Al-Resalah Club Educational Platform

## 📋 Project Summary

A **production-ready** educational platform built with modern web technologies. This system includes everything needed for managing courses, registrations, surveys, announcements, and media - all with real-time updates and advanced features.

## ✨ Key Features

### 🔐 Admin Dashboard
- Secure authentication with Supabase
- Real-time statistics and analytics
- Complete course management
- Applicant tracking and Excel export
- Activity logging for audit trails
- Dark mode support

### 📚 Course Management
- Dynamic course creation
- Real-time seat availability
- Automatic seat management via database triggers
- QR code generation for sharing
- Public shareable links

### 📝 Registration System
- No user accounts required
- Dynamic form builder
- Custom field types
- Duplicate prevention
- Real-time seat checking
- Input validation and sanitization

### 📊 Advanced Features
- **QR Codes**: Generate and download for courses, surveys, announcements
- **Shareable Links**: Unique URLs with view tracking
- **Excel Export**: Professional formatting with brand colors
- **Real-time Updates**: Live seat availability via Supabase Realtime
- **Activity Logging**: Complete audit trail of admin actions
- **Dark Mode**: Professional light/dark theme toggle

### 🎨 Professional Design
- Brand colors: Beige, Navy Blue, Gold
- Modern typography (Inter font)
- Responsive layouts
- Smooth animations
- Accessible UI components

### 🔒 Security
- Row Level Security (RLS) on all tables
- Input validation with Zod
- XSS prevention
- SQL injection protection
- Admin-only access control
- Secure session management

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure Supabase (see SETUP.md)
# - Create project
# - Run supabase-schema.sql
# - Create admin user
# - Get credentials

# 3. Set environment variables
cp .env.local.example .env.local
# Fill in your Supabase credentials

# 4. Run development server
npm run dev

# 5. Access admin dashboard
# Navigate to http://localhost:3000/admin/login
```

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── courses/           # Public course pages
│   └── register/          # Registration forms
├── components/            # Reusable React components
├── lib/                   # Utility libraries
│   ├── supabase/         # Database client
│   ├── validation/       # Input validation
│   ├── security/         # Sanitization
│   ├── qr/               # QR generation
│   ├── export/           # Excel export
│   └── logging/          # Activity logs
├── hooks/                 # Custom React hooks
├── supabase-schema.sql   # Database schema
└── SETUP.md              # Detailed setup guide
```

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Styling**: Vanilla CSS with CSS Variables
- **Validation**: Zod
- **QR Codes**: qrcode
- **Excel**: exceljs

## 📖 Documentation

- **README.md** - Overview and features
- **SETUP.md** - Step-by-step setup instructions
- **walkthrough.md** - Complete implementation details

## 🎯 What's Included

✅ Complete database schema (12 tables)
✅ Row Level Security policies
✅ Admin authentication system
✅ Course CRUD operations
✅ Dynamic registration forms
✅ Real-time seat availability
✅ QR code generation
✅ Shareable links
✅ Excel export
✅ Activity logging
✅ Dark mode
✅ Input validation
✅ Error handling
✅ Responsive design

## 🌐 Deployment

Ready to deploy to:
- **Vercel** (recommended)
- Netlify
- AWS Amplify
- Railway
- Any Next.js 14 compatible platform

## 📝 License

© 2026 Al-Resalah Club. All rights reserved.

---

**Status**: ✅ Production Ready

Built with ❤️ for Al-Resalah Club
