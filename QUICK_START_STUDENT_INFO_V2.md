# Quick Start: Student Information Feature (Version 2.0)

This guide covers the updated Student Information feature with configurable marks and attendance options.

## What's New in Version 2.0

### Configurable Marks
- Super admins can now set custom marks for each performance indicator
- Default marks can be changed from Settings tab
- Supports decimal values (e.g., 0.5, 1.5, 2.0)

### Attendance Options
- Changed from checkbox to three options:
  - **Present** (default: 1 mark)
  - **Absent** (default: 0 marks)
  - **On Leave** (default: 0.5 marks)
- Each option has configurable marks

### Default Mark Values

**Performance Indicators** (default: 1 mark each):
- Homework
- Partner Recitation
- Jali
- Khafi
- Akhfa
- Tone
- Fluency
- Discipline

**Attendance** (configurable):
- Present: 1 mark
- Absent: 0 marks
- On Leave: 0.5 marks

## Setup Instructions

### Step 1: Run Database Migration

Execute the SQL migration in your Supabase SQL Editor:

```sql
-- Run: update-student-info-marks.sql
```

This migration:
- Changes attendance field from checkbox to three options
- Adds 11 new settings for configurable marks
- Creates a view for easier querying
- Migrates existing data (if any)

### Step 2: Enable and Configure (Super Admin)

1. Login as **Super Admin**
2. Navigate to **Settings** tab
3. Find: **"Allow Entering of Student Information"**
4. Turn it **ON** (switch to green)
5. **Configure Marks** (optional):
   - Scroll down to see "Student Information Marks Configuration"
   - Adjust marks for each indicator as needed
   - Set attendance marks for Present/Absent/On Leave
6. Click **Save Settings**

## Using the Feature

### For Super Admins

#### Configuring Marks

1. Go to **Settings** tab
2. Enable "Allow Entering of Student Information"
3. Scroll to **"Student Information Marks Configuration"**
4. You'll see two sections:

**Performance Indicators:**
- Homework (default: 1)
- Partner Recitation (default: 1)
- Jali (default: 1)
- Khafi (default: 1)
- Akhfa (default: 1)
- Tone (default: 1)
- Fluency (default: 1)
- Discipline (default: 1)

**Attendance Marks:**
- Present (default: 1)
- Absent (default: 0)
- On Leave (default: 0.5)

5. Enter custom values (0-100, supports decimals)
6. Click **Save Settings**

#### Example Configurations

**Equal Weighting (Default):**
- All indicators: 1 mark
- Total possible: 9 marks

**Weighted System:**
- Attendance Present: 2 marks
- Homework: 2 marks
- Partner Recitation: 1 mark
- Jali/Khafi/Akhfa: 1 mark each
- Tone/Fluency: 1.5 marks each
- Discipline: 1 mark
- Total possible: 12.5 marks

**Custom System:**
- Set any values that work for your grading system
- Supports decimals (0.5, 1.5, 2.5, etc.)
- Maximum value per indicator: 100

### For Slot Admins

#### Entering Student Information

1. Login as **Slot Admin**
2. Click **"Students Info"** tab
3. Select a **Class** from dropdown
4. View list of students with current totals

#### Expanding a Student Card

Click on any student card to expand and see:

**Attendance Section:**
- Three radio button options:
  - ○ Present (1 mark)
  - ○ Absent (0 marks)
  - ○ On Leave (0.5 marks)
- Select one option
- Marks shown in parentheses

**Performance Indicators Section:**
- 8 checkboxes with marks shown:
  - ☐ Homework (1)
  - ☐ Partner Recitation (1)
  - ☐ Jali (1)
  - ☐ Khafi (1)
  - ☐ Akhfa (1)
  - ☐ Tone (1)
  - ☐ Fluency (1)
  - ☐ Discipline (1)
- Check boxes for achieved indicators

**Total Marks:**
- Automatically calculated
- Shows as "7.5/9" (example)
- Updates in real-time as you check/uncheck

#### Saving Data

1. Make your selections
2. Click **Save** button
3. See success message
4. Total updates in collapsed view
5. Move to next student

## Visual Guide

### Settings Tab - Marks Configuration

```
┌─────────────────────────────────────────────────────────┐
│  Student Information Marks Configuration                │
│  Configure the marks for each performance indicator     │
│                                                          │
│  ┌─────────────────────┐  ┌─────────────────────────┐ │
│  │ Performance Indic.  │  │ Attendance Marks        │ │
│  │                     │  │                         │ │
│  │ Homework        [1] │  │ Present         [1]     │ │
│  │ Partner Recit.  [1] │  │ Absent          [0]     │ │
│  │ Jali            [1] │  │ On Leave      [0.5]     │ │
│  │ Khafi           [1] │  │                         │ │
│  │ Akhfa           [1] │  │                         │ │
│  │ Tone            [1] │  │                         │ │
│  │ Fluency         [1] │  │                         │ │
│  │ Discipline      [1] │  │                         │ │
│  └─────────────────────┘  └─────────────────────────┘ │
│                                                          │
│  [Save Settings]                                         │
└─────────────────────────────────────────────────────────┘
```

### Slot Admin - Expanded Student Card

```
┌─────────────────────────────────────────────────────────┐
│  Ahmed Ali                                    7.5/9  ▲  │
│  Father: Ali Ahmed                                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Attendance (1 / 0 / 0.5 marks)                         │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐   │
│  │ ● Present(1) │ │ ○ Absent(0)  │ │ ○ On Leave(.5)│   │
│  └──────────────┘ └──────────────┘ └──────────────┘   │
│                                                          │
│  Performance Indicators                                 │
│  ☑ Homework (1)           ☑ Jali (1)        ☑ Tone (1) │
│  ☑ Partner Recit. (1)     ☐ Khafi (1)       ☑ Fluency(1)│
│  ☑ Akhfa (1)              ☑ Discipline (1)              │
│                                                          │
│                                          [Save]          │
└─────────────────────────────────────────────────────────┘
```

## Migration from Version 1.0

If you already have the Student Information feature installed:

### Step 1: Backup Data
```sql
-- Backup existing student_info data
CREATE TABLE student_info_backup AS 
SELECT * FROM student_info;
```

### Step 2: Run Migration
```sql
-- Execute: update-student-info-marks.sql
```

### Step 3: Verify Migration
- Check that attendance field now accepts 'present', 'absent', 'on_leave'
- Verify 11 new settings exist in settings table
- Check that existing data was migrated correctly

### Step 4: Configure Marks
- Login as super admin
- Go to Settings
- Configure marks as desired
- Save settings

### Step 5: Test
- Login as slot admin
- Verify attendance shows as radio buttons
- Verify marks are displayed correctly
- Test saving data
- Verify totals calculate correctly

## Calculating Totals

### Formula

```
Total = Attendance Mark + Sum of Checked Indicators

Where:
- Attendance Mark = marks for selected option (present/absent/on_leave)
- Each checked indicator adds its configured mark value
```

### Examples

**Example 1: Default Configuration**
- Attendance: Present (1)
- Homework: Checked (1)
- Partner Recitation: Checked (1)
- Jali: Checked (1)
- Khafi: Not checked (0)
- Akhfa: Checked (1)
- Tone: Checked (1)
- Fluency: Checked (1)
- Discipline: Checked (1)

**Total: 8/9**

**Example 2: Custom Configuration**
- Attendance: On Leave (0.5)
- Homework: Checked (2)
- Partner Recitation: Checked (1)
- Jali: Checked (1)
- Khafi: Not checked (0)
- Akhfa: Checked (1)
- Tone: Checked (1.5)
- Fluency: Checked (1.5)
- Discipline: Checked (1)

**Total: 9.5/12.5**

## Troubleshooting

### Marks Configuration Not Showing

**Issue:** Can't see marks configuration section in Settings

**Solution:**
1. Verify you're logged in as super admin
2. Ensure "Allow Entering of Student Information" is enabled
3. Scroll down in Settings tab
4. Refresh page if needed

### Attendance Shows as Checkbox

**Issue:** Attendance still appears as checkbox instead of radio buttons

**Solution:**
1. Verify migration script was run successfully
2. Check database: `SELECT * FROM student_info LIMIT 1;`
3. Attendance column should be VARCHAR, not SMALLINT
4. Re-run migration if needed
5. Clear browser cache

### Totals Not Calculating Correctly

**Issue:** Total marks don't match expected value

**Solution:**
1. Verify marks configuration in Settings
2. Check that settings were saved
3. Refresh the Students Info page
4. Check browser console for errors
5. Verify marks are fetched from database

### Can't Save Decimal Values

**Issue:** Decimal marks (0.5, 1.5) not saving

**Solution:**
1. Use dot (.) not comma (,) for decimals
2. Ensure value is between 0 and 100
3. Check browser console for validation errors
4. Try whole numbers first to verify functionality

## Database Schema Changes

### Updated student_info Table

```sql
-- Attendance field changed from SMALLINT to VARCHAR
attendance VARCHAR(20) CHECK (attendance IN ('present', 'absent', 'on_leave'))

-- Other fields remain as SMALLINT (0 or 1)
homework SMALLINT CHECK (homework IN (0, 1))
partner_recitation SMALLINT CHECK (partner_recitation IN (0, 1))
-- ... etc
```

### New Settings

```sql
-- 11 new settings added
student_info_marks_homework
student_info_marks_partner_recitation
student_info_marks_jali
student_info_marks_khafi
student_info_marks_akhfa
student_info_marks_tone
student_info_marks_fluency
student_info_marks_discipline
student_info_marks_attendance_present
student_info_marks_attendance_absent
student_info_marks_attendance_on_leave
```

## Best Practices

### For Super Admins

1. **Set marks before enabling feature** - Configure marks first, then enable
2. **Communicate changes** - Inform slot admins of mark values
3. **Keep it simple** - Start with default values, adjust if needed
4. **Document your system** - Keep record of mark configuration
5. **Test before rollout** - Test with one slot admin first

### For Slot Admins

1. **Check mark values** - Look at marks shown in parentheses
2. **Save frequently** - Save each student individually
3. **Verify totals** - Check that totals make sense
4. **Use attendance correctly** - Select appropriate attendance option
5. **Report issues** - Contact admin if marks seem wrong

## Support

### Common Questions

**Q: Can I change marks after data is entered?**
A: Yes, but existing totals won't update automatically. Slot admins need to re-save student data.

**Q: Can different classes have different marks?**
A: No, marks are global across all classes. This is a potential future enhancement.

**Q: What's the maximum mark value?**
A: 100 per indicator, but practically you'll want lower values.

**Q: Can I use negative marks?**
A: No, minimum value is 0.

**Q: How many decimal places are supported?**
A: One decimal place (e.g., 0.5, 1.5, 2.5).

### Getting Help

1. Check this guide first
2. Review `STUDENT_INFO_IMPLEMENTATION.md` for technical details
3. Run `verify-student-info-setup.sql` to check setup
4. Check browser console for errors
5. Contact support with specific error messages

## Files

### New Files
- `update-student-info-marks.sql` - Migration script
- `QUICK_START_STUDENT_INFO_V2.md` - This guide

### Modified Files
- `src/components/Settings.jsx` - Added marks configuration UI
- `src/components/Settings.css` - Added marks configuration styles
- `src/components/StudentsInfo.jsx` - Updated for attendance options and marks
- `src/components/StudentsInfo.css` - Added attendance radio button styles

## Next Steps

1. Run the migration script
2. Configure marks in Settings
3. Test with one slot admin
4. Roll out to all slot admins
5. Gather feedback and adjust marks if needed

---

**Version**: 2.0  
**Last Updated**: December 22, 2025  
**Status**: ✅ Ready for Deployment
