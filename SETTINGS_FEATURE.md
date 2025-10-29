# Settings Management Feature

## Overview
Added a new Settings management feature that allows super admins to customize the registration form title from the admin dashboard.

## What's New

### 1. Database Setup
- **File:** `create-settings-table.sql`
- Creates a new `settings` table to store application configuration
- Includes RLS policies for secure access
- Pre-populates with default form title: "Tilawah Registration Form"

### 2. Settings Component
- **Files:** `src/components/Settings.jsx` and `src/components/Settings.css`
- New admin interface for managing application settings
- Currently supports editing the registration form title
- Real-time validation and feedback

### 3. Admin Dashboard Integration
- **File:** `src/components/AdminDashboard.jsx`
- Added new "Settings" tab (super admin only)
- Seamlessly integrated with existing tabs

### 4. Dynamic Form Title
- **File:** `src/components/RegistrationForm.jsx`
- Registration form now fetches title from database
- Real-time updates when title changes
- Falls back to default if settings not found

## Installation Steps

1. **Run the SQL migration:**
   ```bash
   # Open Supabase SQL Editor and run:
   create-settings-table.sql
   ```

2. **The feature is ready to use!**
   - No additional npm packages required
   - All dependencies already included

## How to Use

1. Login as super admin at `/admin`
2. Click on the "Settings" tab
3. Update the "Registration Form Title" field
4. Click "Save Settings"
5. The new title appears immediately on the registration form

## Features

- ✅ Real-time updates across all users
- ✅ Input validation (non-empty title)
- ✅ Success/error feedback messages
- ✅ Clean, intuitive interface
- ✅ Responsive design
- ✅ Super admin only access

## Technical Details

- Uses Supabase realtime subscriptions for instant updates
- Implements proper error handling
- Follows existing code patterns and styling
- No breaking changes to existing functionality
