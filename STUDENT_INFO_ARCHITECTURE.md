# Student Information Feature - Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         SUPER ADMIN                              │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Settings Tab                           │  │
│  │                                                            │  │
│  │  ┌──────────────────────────────────────────────────┐   │  │
│  │  │  Allow Entering of Student Information           │   │  │
│  │  │  [Toggle Switch: OFF/ON]                         │   │  │
│  │  │  [Save Settings]                                 │   │  │
│  │  └──────────────────────────────────────────────────┘   │  │
│  │                                                            │  │
│  │  Saves to: settings.allow_student_info_entry = 'true'    │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Enables/Disables
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         SLOT ADMIN                               │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Tabs: [Registrations] [Attendance] [Students Info]      │  │
│  │                                         ▲                  │  │
│  │                                         │                  │  │
│  │                          Only visible if enabled          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Students Info Component                      │  │
│  │                                                            │  │
│  │  Select Class: [Dropdown: Quran Recitation ▼]            │  │
│  │                                                            │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │  Ahmed Ali                          Total: 7/9  ▼  │ │  │
│  │  │  Father: Ali Ahmed                                 │ │  │
│  │  ├────────────────────────────────────────────────────┤ │  │
│  │  │  ☑ Attendance        ☑ Jali         ☑ Tone        │ │  │
│  │  │  ☑ Homework          ☐ Khafi        ☑ Fluency      │ │  │
│  │  │  ☑ Partner Recit.    ☑ Akhfa        ☑ Discipline   │ │  │
│  │  │                                                     │ │  │
│  │  │                              [Save]                │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │                                                            │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │  Fatima Hassan                      Total: 9/9  ▶  │ │  │
│  │  │  Father: Hassan Ibrahim                            │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │                                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Database Schema Relationships

```
┌─────────────────┐
│     users       │
│─────────────────│
│ id (PK)         │◄──────────┐
│ username        │           │
│ role            │           │
│ assigned_slot_id│           │
└─────────────────┘           │
                              │
┌─────────────────┐           │
│     slots       │           │
│─────────────────│           │
│ id (PK)         │◄──────┐   │
│ display_name    │       │   │
│ slot_order      │       │   │
└─────────────────┘       │   │
                          │   │
┌─────────────────┐       │   │
│    classes      │       │   │
│─────────────────│       │   │
│ id (PK)         │◄──┐   │   │
│ name            │   │   │   │
│ description     │   │   │   │
│ duration        │   │   │   │
└─────────────────┘   │   │   │
                      │   │   │
┌─────────────────┐   │   │   │
│ registrations   │   │   │   │
│─────────────────│   │   │   │
│ id (PK)         │◄┐ │   │   │
│ name            │ │ │   │   │
│ fathers_name    │ │ │   │   │
│ email           │ │ │   │   │
│ slot_id (FK)    │─┘ │   │   │
└─────────────────┘   │   │   │
                      │   │   │
┌──────────────────────────────────────┐
│         student_info                 │
│──────────────────────────────────────│
│ id (PK)                              │
│ registration_id (FK) ────────────────┘
│ class_id (FK) ───────────────────────┘
│ slot_id (FK) ────────────────────────┘
│ admin_user_id (FK) ──────────────────┘
│                                      │
│ attendance (0 or 1)                  │
│ homework (0 or 1)                    │
│ partner_recitation (0 or 1)          │
│ jali (0 or 1)                        │
│ khafi (0 or 1)                       │
│ akhfa (0 or 1)                       │
│ tone (0 or 1)                        │
│ fluency (0 or 1)                     │
│ discipline (0 or 1)                  │
│                                      │
│ created_at                           │
│ updated_at                           │
│                                      │
│ UNIQUE(registration_id, class_id)    │
└──────────────────────────────────────┘
```

## Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                    SUPER ADMIN FLOW                               │
└──────────────────────────────────────────────────────────────────┘

1. Login as Super Admin
         │
         ▼
2. Navigate to Settings Tab
         │
         ▼
3. Toggle "Allow Entering of Student Information" → ON
         │
         ▼
4. Click "Save Settings"
         │
         ▼
5. Upsert to settings table:
   { key: 'allow_student_info_entry', value: 'true' }
         │
         ▼
6. Feature enabled for all Slot Admins


┌──────────────────────────────────────────────────────────────────┐
│                    SLOT ADMIN FLOW                                │
└──────────────────────────────────────────────────────────────────┘

1. Login as Slot Admin
         │
         ▼
2. AdminDashboard fetches setting:
   SELECT value FROM settings WHERE key = 'allow_student_info_entry'
         │
         ▼
3. If value = 'true' → Show "Students Info" tab
         │
         ▼
4. Click "Students Info" tab
         │
         ▼
5. StudentsInfo component loads:
   ├─ Fetch students: SELECT * FROM registrations WHERE slot_id = ?
   └─ Fetch classes: SELECT * FROM classes
         │
         ▼
6. Select a class from dropdown
         │
         ▼
7. Fetch existing data:
   SELECT * FROM student_info 
   WHERE class_id = ? AND slot_id = ?
         │
         ▼
8. Display students with current marks
         │
         ▼
9. Click student card to expand
         │
         ▼
10. Check/uncheck performance indicators
         │
         ▼
11. Click "Save" button
         │
         ▼
12. Upsert to student_info table:
    INSERT INTO student_info (...)
    ON CONFLICT (registration_id, class_id)
    DO UPDATE SET ...
         │
         ▼
13. Show success message
         │
         ▼
14. Data persisted and can be edited later
```

## Component Hierarchy

```
App
 │
 └─ AdminDashboard
     │
     ├─ [Super Admin Only]
     │   ├─ UserManagement
     │   ├─ SlotManagement
     │   ├─ ClassManagement
     │   ├─ AttendanceAnalytics
     │   └─ Settings ◄─── Toggle for Student Info feature
     │
     └─ [Slot Admin Only]
         ├─ Registrations (default view)
         ├─ AttendanceTracking
         └─ StudentsInfo ◄─── NEW (conditional on setting)
             │
             ├─ Class Selector (dropdown)
             │
             └─ Student Cards (list)
                 ├─ Collapsed View
                 │   ├─ Student Name
                 │   ├─ Father's Name
                 │   └─ Total Marks Badge
                 │
                 └─ Expanded View
                     ├─ Performance Grid (9 checkboxes)
                     └─ Save Button
```

## State Management Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  AdminDashboard State                        │
│─────────────────────────────────────────────────────────────│
│  allowStudentInfo: boolean                                   │
│  ├─ Fetched from settings table on mount                    │
│  ├─ Determines if "Students Info" tab is visible            │
│  └─ Passed to conditional rendering logic                   │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ Props
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  StudentsInfo State                          │
│─────────────────────────────────────────────────────────────│
│  students: Array<Student>                                    │
│  ├─ Fetched from registrations table                        │
│  └─ Filtered by user.assigned_slot_id                       │
│                                                              │
│  classes: Array<Class>                                       │
│  └─ Fetched from classes table                              │
│                                                              │
│  selectedClass: string (UUID)                                │
│  ├─ Controlled by dropdown                                  │
│  └─ Triggers fetch of student_info                          │
│                                                              │
│  studentInfo: Object<studentId, PerformanceData>             │
│  ├─ Fetched from student_info table                         │
│  ├─ Keyed by registration_id                                │
│  └─ Updated on checkbox changes                             │
│                                                              │
│  expandedStudents: Object<studentId, boolean>                │
│  ├─ Tracks which cards are expanded                         │
│  └─ Toggled on card header click                            │
│                                                              │
│  loading, saving, error: UI state                           │
└─────────────────────────────────────────────────────────────┘
```

## Security Model

```
┌─────────────────────────────────────────────────────────────┐
│                    Row Level Security                        │
└─────────────────────────────────────────────────────────────┘

student_info table:
├─ RLS Enabled: YES
├─ Policies:
│   ├─ SELECT: Allow all authenticated users
│   ├─ INSERT: Allow all authenticated users
│   ├─ UPDATE: Allow all authenticated users
│   └─ DELETE: Allow all authenticated users
│
└─ Application-Level Filtering:
    ├─ Slot admins query with WHERE slot_id = user.assigned_slot_id
    ├─ Slot ID set from user object (server-side)
    ├─ Admin user ID set from user object (server-side)
    └─ No way to manipulate these values from client


┌─────────────────────────────────────────────────────────────┐
│                  Authorization Flow                          │
└─────────────────────────────────────────────────────────────┘

User Login
    │
    ▼
Supabase Auth
    │
    ▼
User Object with:
├─ id
├─ role (super_admin or slot_admin)
└─ assigned_slot_id (for slot admins)
    │
    ▼
AdminDashboard receives user prop
    │
    ├─ If super_admin → Show all admin features
    │   └─ Can enable/disable student info feature
    │
    └─ If slot_admin → Show slot-specific features
        └─ If allowStudentInfo = true → Show Students Info tab
            └─ Can only see/edit students in assigned_slot_id
```

## Performance Considerations

```
┌─────────────────────────────────────────────────────────────┐
│                    Database Indexes                          │
└─────────────────────────────────────────────────────────────┘

student_info table:
├─ idx_student_info_registration (registration_id)
│   └─ Fast lookup by student
│
├─ idx_student_info_class (class_id)
│   └─ Fast lookup by class
│
├─ idx_student_info_slot (slot_id)
│   └─ Fast filtering by slot
│
└─ idx_student_info_admin (admin_user_id)
    └─ Fast lookup by admin (for audit)


┌─────────────────────────────────────────────────────────────┐
│                    Query Optimization                        │
└─────────────────────────────────────────────────────────────┘

Fetch Students:
SELECT * FROM registrations 
WHERE slot_id = ? 
ORDER BY name
└─ Uses index on slot_id
└─ Returns ~10-50 rows typically

Fetch Student Info:
SELECT * FROM student_info 
WHERE class_id = ? AND slot_id = ?
└─ Uses composite scan on both indexes
└─ Returns ~10-50 rows typically

Upsert Student Info:
INSERT INTO student_info (...) 
ON CONFLICT (registration_id, class_id) 
DO UPDATE SET ...
└─ Uses unique constraint index
└─ Single row operation
```

## Error Handling Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                    Error Boundaries                          │
└─────────────────────────────────────────────────────────────┘

Component Level:
├─ Try-Catch blocks around all async operations
├─ Error state variable for user feedback
├─ Console logging for debugging
└─ Graceful degradation (show empty state)

Database Level:
├─ CHECK constraints prevent invalid data
├─ UNIQUE constraints prevent duplicates
├─ Foreign key constraints ensure referential integrity
└─ NOT NULL constraints ensure required fields

User Feedback:
├─ Red error messages for failures
├─ Green success messages for saves
├─ Loading states during operations
└─ Disabled buttons during saves
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Production Setup                          │
└─────────────────────────────────────────────────────────────┘

1. Database Migration
   ├─ Run create-student-info-table.sql
   ├─ Verify with verify-student-info-setup.sql
   └─ Backup database before migration

2. Frontend Deployment
   ├─ Build React app
   ├─ Deploy to hosting (Vercel/Netlify)
   └─ Clear CDN cache

3. Feature Enablement
   ├─ Super admin logs in
   ├─ Enables feature via Settings
   └─ Slot admins can now access

4. Monitoring
   ├─ Check browser console for errors
   ├─ Monitor database query performance
   ├─ Track user feedback
   └─ Monitor error logs
```

This architecture provides a clear, secure, and scalable implementation of the Student Information feature.
