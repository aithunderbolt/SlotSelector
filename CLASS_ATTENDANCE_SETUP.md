# Class and Attendance Management Setup Guide

This guide will help you set up the new class management and attendance tracking features.

## Overview

Two new features have been added:

1. **Class Management (Super Admin)**: Create, edit, and delete classes with name, description, and duration
2. **Attendance Tracking (Slot Admin)**: Record attendance for each class session including date, total students, present, absent, and on leave

## Database Setup

### Step 1: Create Classes Table

Run the following SQL in your Supabase SQL Editor:

```sql
-- Execute: create-classes-table.sql
```

This creates:
- `classes` table with columns: id, name, description, duration, created_at, updated_at
- RLS policies allowing super admins to manage classes and slot admins to view them

### Step 2: Create Attendance Table

Run the following SQL in your Supabase SQL Editor:

```sql
-- Execute: create-attendance-table.sql
```

This creates:
- `attendance` table with columns: id, class_id, slot_id, admin_user_id, attendance_date, total_students, students_present, students_absent, students_on_leave, notes, created_at, updated_at
- Constraint ensuring present + absent + on leave = total students
- Unique constraint preventing duplicate entries for same class, slot, and date
- RLS policies allowing super admins to view all records and slot admins to manage their own slot's records

## Features

### For Super Admin

**Class Management Tab**:
- View all classes in a grid layout
- Create new classes with:
  - Class Name (required)
  - Description (optional)
  - Duration in minutes (required)
- Edit existing classes
- Delete classes (will also delete associated attendance records)

### For Slot Admin

**Attendance Tab**:
- View all attendance records for their assigned slot
- Add new attendance records with:
  - Class selection (dropdown)
  - Date (date picker)
  - Total Students (number)
  - Students Present (number)
  - Students Absent (number)
  - Students on Leave (number)
  - Notes (optional text)
- Edit existing attendance records
- Delete attendance records
- Validation ensures Present + Absent + On Leave = Total Students

## User Interface

### Super Admin Dashboard
- New "Class Management" tab added between "Slot Management" and "Settings"
- Classes displayed in a responsive grid with cards showing name, duration, and description
- Edit and Delete buttons on each class card

### Slot Admin Dashboard
- New "Attendance" tab added next to "Registrations"
- Attendance records displayed in a table format
- Color-coded columns: Present (green), Absent (red), On Leave (orange)
- Date formatted as DD/MM/YYYY

## Data Validation

1. **Class Creation**:
   - Name is required
   - Duration must be a positive number

2. **Attendance Entry**:
   - All numeric fields are required
   - Present + Absent + On Leave must equal Total Students
   - Cannot create duplicate records for same class, slot, and date

## Real-time Updates

Both components use Supabase real-time subscriptions:
- Changes made by one admin are immediately visible to others
- No page refresh needed

## Security

- Row Level Security (RLS) ensures:
  - Super admins can manage all classes and view all attendance
  - Slot admins can only view classes and manage attendance for their assigned slot
  - Data is automatically filtered based on user role and assigned slot

## Files Created

1. `create-classes-table.sql` - Database migration for classes table
2. `create-attendance-table.sql` - Database migration for attendance table
3. `src/components/ClassManagement.jsx` - Super admin class management component
4. `src/components/ClassManagement.css` - Styles for class management
5. `src/components/AttendanceTracking.jsx` - Slot admin attendance tracking component
6. `src/components/AttendanceTracking.css` - Styles for attendance tracking

## Files Modified

1. `src/components/AdminDashboard.jsx` - Added new tabs and imported new components

## Next Steps

1. Run both SQL migration files in Supabase SQL Editor
2. Test the features:
   - Login as super admin and create some classes
   - Login as slot admin and add attendance records
3. Verify RLS policies are working correctly
4. Customize styling if needed

## Notes

- The implementation follows a minimal invasive approach
- No existing functionality has been modified
- All new features are isolated in separate components
- The database schema includes proper constraints and indexes for performance
