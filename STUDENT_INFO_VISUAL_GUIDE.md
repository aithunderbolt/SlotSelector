# Student Information Feature - Visual Guide

## Super Admin View

### Settings Tab - Feature Toggle

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Settings                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Registration Form Title                                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Tilawah Registration Form                              │ │
│  └────────────────────────────────────────────────────────┘ │
│  This title will be displayed at the top of the form        │
│                                                              │
│  Maximum Registrations Per Slot                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 15                                                     │ │
│  └────────────────────────────────────────────────────────┘ │
│  Maximum number of students per slot (1-100)                │
│                                                              │
│  Allow Entering of Student Information        ┌──────┐     │
│                                                │  ●───│ ON  │
│                                                └──────┘     │
│  When enabled, slot admins can access the "Students Info"   │
│  tab to enter performance data for each student             │
│                                                              │
│  ┌──────────────────┐                                       │
│  │  Save Settings   │                                       │
│  └──────────────────┘                                       │
│                                                              │
│  ✓ Settings saved successfully!                             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Slot Admin View

### Dashboard Tabs (When Feature Enabled)

```
┌─────────────────────────────────────────────────────────────┐
│  Admin Dashboard                                   [Logout]  │
│  Logged in as: ahmad_slot1 (Slot Admin - Morning Slot)      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌────────────┐  ┌──────────────────┐   │
│  │Registrations │  │ Attendance │  │  Students Info   │   │
│  └──────────────┘  └────────────┘  └──────────────────┘   │
│                                            ▲                 │
│                                            │                 │
│                                      NEW TAB APPEARS         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Students Info Tab - Initial View

```
┌─────────────────────────────────────────────────────────────┐
│  Students Information                                        │
│                                                              │
│  Select Class: ┌──────────────────────────────────────────┐ │
│                │ Quran Recitation                       ▼ │ │
│                └──────────────────────────────────────────┘ │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Ahmed Ali                                    7/9    ▼ │ │
│  │  Father: Ali Ahmed                                     │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Fatima Hassan                                9/9    ▶ │ │
│  │  Father: Hassan Ibrahim                                │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Omar Khalid                                  5/9    ▶ │ │
│  │  Father: Khalid Omar                                   │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Aisha Mohammed                               8/9    ▶ │ │
│  │  Father: Mohammed Ali                                  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Students Info Tab - Expanded Student Card

```
┌─────────────────────────────────────────────────────────────┐
│  Students Information                                        │
│                                                              │
│  Select Class: ┌──────────────────────────────────────────┐ │
│                │ Quran Recitation                       ▼ │ │
│                └──────────────────────────────────────────┘ │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Ahmed Ali                                    7/9    ▲ │ │
│  │  Father: Ali Ahmed                                     │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │                                                        │ │
│  │  ☑ Attendance          ☑ Jali              ☑ Tone     │ │
│  │                                                        │ │
│  │  ☑ Homework            ☐ Khafi             ☑ Fluency  │ │
│  │                                                        │ │
│  │  ☑ Partner Recitation  ☑ Akhfa             ☑ Discipline│ │
│  │                                                        │ │
│  │                                        ┌──────────┐    │ │
│  │                                        │   Save   │    │ │
│  │                                        └──────────┘    │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Fatima Hassan                                9/9    ▶ │ │
│  │  Father: Hassan Ibrahim                                │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### After Saving - Success Message

```
┌─────────────────────────────────────────────────────────────┐
│  Students Information                                        │
│                                                              │
│  Select Class: ┌──────────────────────────────────────────┐ │
│                │ Quran Recitation                       ▼ │ │
│                └──────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  ✓ Saved information for Ahmed Ali                     │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Ahmed Ali                                    7/9    ▼ │ │
│  │  Father: Ali Ahmed                                     │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │                                                        │ │
│  │  ☑ Attendance          ☑ Jali              ☑ Tone     │ │
│  │  ☑ Homework            ☐ Khafi             ☑ Fluency  │ │
│  │  ☑ Partner Recitation  ☑ Akhfa             ☑ Discipline│ │
│  │                                                        │ │
│  │                                        ┌──────────┐    │ │
│  │                                        │   Save   │    │ │
│  │                                        └──────────┘    │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Mobile View

### Collapsed Cards (Mobile)

```
┌──────────────────────────────┐
│  Students Information        │
│                              │
│  Select Class:               │
│  ┌─────────────────────────┐ │
│  │ Quran Recitation      ▼ │ │
│  └─────────────────────────┘ │
│                              │
├──────────────────────────────┤
│                              │
│  ┌─────────────────────────┐ │
│  │  Ahmed Ali              │ │
│  │  Father: Ali Ahmed      │ │
│  │                         │ │
│  │  7/9                 ▼  │ │
│  └─────────────────────────┘ │
│                              │
│  ┌─────────────────────────┐ │
│  │  Fatima Hassan          │ │
│  │  Father: Hassan Ibrahim │ │
│  │                         │ │
│  │  9/9                 ▶  │ │
│  └─────────────────────────┘ │
│                              │
└──────────────────────────────┘
```

### Expanded Card (Mobile)

```
┌──────────────────────────────┐
│  Students Information        │
│                              │
│  Select Class:               │
│  ┌─────────────────────────┐ │
│  │ Quran Recitation      ▼ │ │
│  └─────────────────────────┘ │
│                              │
├──────────────────────────────┤
│                              │
│  ┌─────────────────────────┐ │
│  │  Ahmed Ali              │ │
│  │  Father: Ali Ahmed      │ │
│  │                         │ │
│  │  7/9                 ▲  │ │
│  ├─────────────────────────┤ │
│  │                         │ │
│  │  ☑ Attendance           │ │
│  │  ☑ Homework             │ │
│  │  ☑ Partner Recitation   │ │
│  │  ☑ Jali                 │ │
│  │  ☐ Khafi                │ │
│  │  ☑ Akhfa                │ │
│  │  ☑ Tone                 │ │
│  │  ☑ Fluency              │ │
│  │  ☑ Discipline           │ │
│  │                         │ │
│  │       ┌──────────┐      │ │
│  │       │   Save   │      │ │
│  │       └──────────┘      │ │
│  └─────────────────────────┘ │
│                              │
└──────────────────────────────┘
```

## Color Coding

### Total Marks Badge

```
┌─────────────────────────────────────────┐
│  High Performance (7-9 marks)           │
│  ┌────┐                                 │
│  │7/9 │  Green badge with green border │
│  └────┘                                 │
│                                         │
│  Medium Performance (4-6 marks)         │
│  ┌────┐                                 │
│  │5/9 │  Green badge (same styling)    │
│  └────┘                                 │
│                                         │
│  Low Performance (0-3 marks)            │
│  ┌────┐                                 │
│  │2/9 │  Green badge (same styling)    │
│  └────┘                                 │
└─────────────────────────────────────────┘
```

### Checkboxes

```
┌─────────────────────────────────────────┐
│  Checked (1 mark)                       │
│  ☑ Attendance    (Green checkmark)      │
│                                         │
│  Unchecked (0 marks)                    │
│  ☐ Khafi         (Empty box)            │
└─────────────────────────────────────────┘
```

### Messages

```
┌─────────────────────────────────────────┐
│  Success Message                        │
│  ┌─────────────────────────────────────┐│
│  │ ✓ Saved information for Ahmed Ali   ││
│  └─────────────────────────────────────┘│
│  Light green background, dark green text│
│                                         │
│  Error Message                          │
│  ┌─────────────────────────────────────┐│
│  │ ✗ Please select a class first       ││
│  └─────────────────────────────────────┘│
│  Light red background, dark red text    │
└─────────────────────────────────────────┘
```

## Interactive Elements

### Toggle Switch (Settings)

```
OFF State:
┌──────────────────────────────────────────┐
│  Allow Entering of Student Information   │
│                                          │
│  ┌──────┐                                │
│  │○     │  Gray background               │
│  └──────┘                                │
└──────────────────────────────────────────┘

ON State:
┌──────────────────────────────────────────┐
│  Allow Entering of Student Information   │
│                                          │
│  ┌──────┐                                │
│  │    ○─│  Green background              │
│  └──────┘                                │
└──────────────────────────────────────────┘
```

### Expand/Collapse Arrow

```
Collapsed:
┌─────────────────────────────────────┐
│  Ahmed Ali                  7/9  ▼  │
└─────────────────────────────────────┘

Expanded:
┌─────────────────────────────────────┐
│  Ahmed Ali                  7/9  ▲  │
├─────────────────────────────────────┤
│  [Performance indicators...]        │
└─────────────────────────────────────┘
```

### Save Button States

```
Normal:
┌──────────┐
│   Save   │  Green background, white text
└──────────┘

Hover:
┌──────────┐
│   Save   │  Darker green background
└──────────┘

Disabled (Saving):
┌──────────┐
│ Saving...│  Gray background, cursor not-allowed
└──────────┘
```

## Empty States

### No Class Selected

```
┌─────────────────────────────────────────────────────────────┐
│  Students Information                                        │
│                                                              │
│  Select Class: ┌──────────────────────────────────────────┐ │
│                │ -- Select a Class --                    ▼ │ │
│                └──────────────────────────────────────────┘ │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│                                                              │
│         Please select a class to view and enter             │
│              student information.                            │
│                                                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### No Students in Slot

```
┌─────────────────────────────────────────────────────────────┐
│  Students Information                                        │
│                                                              │
│  Select Class: ┌──────────────────────────────────────────┐ │
│                │ Quran Recitation                       ▼ │ │
│                └──────────────────────────────────────────┘ │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│                                                              │
│              No students found in your slot.                 │
│                                                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Workflow Animation

### Step-by-Step User Flow

```
Step 1: Select Class
┌────────────────────┐
│ Select Class: [▼]  │
└────────────────────┘
         │
         ▼
Step 2: View Students
┌────────────────────┐
│ Ahmed Ali    7/9 ▶ │
│ Fatima H.    9/9 ▶ │
│ Omar K.      5/9 ▶ │
└────────────────────┘
         │
         ▼
Step 3: Expand Student
┌────────────────────┐
│ Ahmed Ali    7/9 ▲ │
├────────────────────┤
│ ☑ Attendance       │
│ ☑ Homework         │
│ ☑ Partner Recit.   │
│ ☑ Jali             │
│ ☐ Khafi            │
│ ☑ Akhfa            │
│ ☑ Tone             │
│ ☑ Fluency          │
│ ☑ Discipline       │
│    [Save]          │
└────────────────────┘
         │
         ▼
Step 4: Check/Uncheck
┌────────────────────┐
│ ☐ Khafi → ☑ Khafi  │
│ Total: 7/9 → 8/9   │
└────────────────────┘
         │
         ▼
Step 5: Save
┌────────────────────┐
│ ✓ Saved!           │
│ Ahmed Ali    8/9 ▲ │
└────────────────────┘
```

This visual guide provides a clear understanding of how the Student Information feature looks and works across different devices and states.
