# Quick Start: Student Information Feature

This guide will help you set up and use the Student Information feature for tracking student performance.

## Overview

The Student Information feature allows slot admins to track individual student performance across multiple performance indicators for each class. Each indicator is tracked as a checkbox (yes/no), with 1 mark for yes and 0 marks for no.

## Performance Indicators

For each student in each class, slot admins can track:

1. **Attendance** - Was the student present?
2. **Homework** - Did the student complete homework?
3. **Partner Recitation** - Did the student participate in partner recitation?
4. **Jali** - Mastery of Jali (clear/obvious) pronunciation
5. **Khafi** - Mastery of Khafi (hidden) pronunciation
6. **Akhfa** - Mastery of Akhfa (most hidden) pronunciation
7. **Tone** - Proper tone and melody
8. **Fluency** - Reading fluency
9. **Discipline** - Classroom discipline and behavior

Total possible marks per class: **9 marks**

## Setup Instructions

### Step 1: Run Database Migration

Execute the SQL migration in your Supabase SQL Editor:

```sql
-- Run: create-student-info-table.sql
```

This creates:
- `student_info` table to store performance data
- Proper indexes for fast queries
- RLS policies for security
- Default setting `allow_student_info_entry` set to `false`

### Step 2: Enable the Feature (Super Admin)

1. Login as **Super Admin**
2. Navigate to **Settings** tab
3. Find the toggle: **"Allow Entering of Student Information"**
4. Turn it **ON** (switch to green)
5. Click **Save Settings**

Once enabled, all slot admins will see the new "Students Info" tab.

## Using the Feature (Slot Admin)

### Accessing Student Information

1. Login as **Slot Admin**
2. You'll see a new tab: **"Students Info"** (only visible when enabled by super admin)
3. Click on the **Students Info** tab

### Entering Student Performance Data

1. **Select a Class** from the dropdown menu
   - Only classes created by the super admin will appear
   
2. **View Your Students**
   - All students registered in your slot will be displayed
   - Each student card shows:
     - Student name
     - Father's name (if provided)
     - Total marks (collapsed view)

3. **Expand a Student Card**
   - Click on any student card to expand it
   - You'll see all 9 performance indicators as checkboxes

4. **Mark Performance**
   - Check the box for each indicator the student achieved
   - Unchecked = 0 marks
   - Checked = 1 mark
   - Total marks update automatically

5. **Save the Data**
   - Click the **Save** button at the bottom of the expanded card
   - You'll see a success message: "✓ Saved information for [Student Name]"
   - Data is saved per student per class

### Viewing Student Progress

**Collapsed View:**
- Shows total marks out of 9 (e.g., "7/9")
- Quick overview of all students at a glance
- Click to expand for details

**Expanded View:**
- Shows all 9 performance indicators
- Current status of each checkbox
- Save button to update data

### Tips for Efficient Data Entry

1. **Select the class first** before starting to enter data
2. **Work through students one by one** - expand, mark, save, move to next
3. **Save frequently** - each student's data is saved independently
4. **Use the collapsed view** to quickly see which students need attention
5. **Switch between classes** using the dropdown to enter data for different classes

## Data Management

### Updating Existing Data

- Simply expand the student card
- Change any checkboxes as needed
- Click Save to update
- Previous data is overwritten with new data

### Data Persistence

- Data is stored per student per class
- Each student can have different marks for different classes
- Data persists across sessions
- Only the assigned slot admin can enter/edit data for their students

### Data Security

- Slot admins can only see students in their assigned slot
- Super admins can view all data (future feature)
- Row Level Security (RLS) ensures data isolation

## Disabling the Feature

If the super admin disables the feature:

1. Go to **Settings** tab
2. Turn **OFF** the "Allow Entering of Student Information" toggle
3. Click **Save Settings**

Result:
- The "Students Info" tab disappears for all slot admins
- Existing data is preserved in the database
- Data can be accessed again when feature is re-enabled

## Troubleshooting

**Tab not showing for slot admin:**
- Verify super admin has enabled the setting
- Refresh the page
- Check that you're logged in as a slot admin

**No students appearing:**
- Verify students are registered in your slot
- Check that you've selected a class from the dropdown

**Cannot save data:**
- Ensure you've selected a class
- Check your internet connection
- Verify you have permission to edit

**Changes not persisting:**
- Make sure to click the Save button
- Wait for the success message before moving to next student
- Check browser console for errors

## Database Schema

The `student_info` table structure:

```sql
- id: UUID (primary key)
- registration_id: UUID (references registrations)
- class_id: UUID (references classes)
- slot_id: UUID (references slots)
- admin_user_id: UUID (references users)
- attendance: 0 or 1
- homework: 0 or 1
- partner_recitation: 0 or 1
- jali: 0 or 1
- khafi: 0 or 1
- akhfa: 0 or 1
- tone: 0 or 1
- fluency: 0 or 1
- discipline: 0 or 1
- created_at: timestamp
- updated_at: timestamp
```

Unique constraint: One record per student per class

## Future Enhancements

Potential features for future development:

- Export student performance data to Excel
- View historical performance trends
- Super admin analytics dashboard
- Bulk entry mode for faster data input
- Comments/notes per student per class
- Performance reports and certificates

## Files Created

1. `create-student-info-table.sql` - Database migration
2. `src/components/StudentsInfo.jsx` - Main component
3. `src/components/StudentsInfo.css` - Styling
4. `QUICK_START_STUDENT_INFO.md` - This guide

## Files Modified

1. `src/components/Settings.jsx` - Added toggle switch
2. `src/components/Settings.css` - Added toggle styles
3. `src/components/AdminDashboard.jsx` - Added new tab and routing

## Support

For issues or questions:
1. Check this guide first
2. Verify database migration was run successfully
3. Check browser console for errors
4. Verify RLS policies are active in Supabase
