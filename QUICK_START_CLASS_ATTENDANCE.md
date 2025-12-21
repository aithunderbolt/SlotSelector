# Quick Start: Class and Attendance Management

## Database Setup (One-time)

Execute these SQL files in Supabase SQL Editor in order:

1. `create-classes-table.sql`
2. `create-attendance-table.sql`

## Super Admin: Managing Classes

1. Login to admin dashboard
2. Click "Class Management" tab
3. Click "Add New Class" button
4. Fill in:
   - Class Name (e.g., "Quran Recitation")
   - Description (e.g., "Basic Quran reading and tajweed")
   - Duration (e.g., 60 for 60 minutes)
5. Click "Create Class"

**To Edit**: Click "Edit" on any class card, modify fields, click "Update Class"

**To Delete**: Click "Delete" on any class card, confirm deletion

## Slot Admin: Recording Attendance

1. Login to admin dashboard
2. Click "Attendance" tab
3. Click "Add Attendance Record" button
4. Fill in:
   - Select Class from dropdown
   - Select Date
   - Enter Total Students
   - Enter Students Present
   - Enter Students Absent
   - Enter Students on Leave
   - Add Notes (optional)
5. Click "Save Record"

**Important**: Present + Absent + On Leave must equal Total Students

**To Edit**: Click "Edit" on any record row, modify fields, click "Update Record"

**To Delete**: Click "Delete" on any record row, confirm deletion

## Tips

- Classes must be created by super admin before slot admins can record attendance
- Each slot admin can only see and manage attendance for their assigned slot
- You cannot create duplicate attendance records for the same class, slot, and date
- All changes are saved in real-time to Supabase
