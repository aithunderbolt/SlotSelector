# Students Performance Analytics

## Overview
A comprehensive analytics dashboard for super admins to view and analyze student performance data across all classes and slots.

## Features

### 1. Three View Modes

#### Summary View
- **Overview Cards**: Total records, unique students, average performance, classes covered
- **Attendance Overview**: Visual bars showing present/absent/on-leave percentages
- **Performance Indicators**: Grid showing completion rates for all 8 performance metrics
- **Class-wise Summary**: Cards displaying key stats for each class

#### Detailed View
- In-depth breakdown per class
- Overview statistics (records, students, average scores)
- Attendance distribution with percentages
- Complete performance breakdown for all indicators

#### Student Rankings View
- Sortable table ranking students by total marks
- Top 3 students highlighted with medals (🥇🥈🥉)
- Shows: rank, name, slot, classes attended, total marks, average score, percentage, attendance rate
- Color-coded badges for performance levels:
  - Excellent (≥80%): Green
  - Good (≥60%): Blue
  - Average (≥40%): Yellow
  - Poor (<40%): Red

### 2. Filtering Options
- **All Classes**: Cumulative analytics across all classes
- **Individual Class**: Filter to view specific class performance

### 3. Metrics Tracked
- **Attendance**: Present, Absent, On Leave
- **Performance Indicators**: Homework, Partner Recitation, Jali, Khafi, Akhfa, Tone, Fluency, Discipline
- **Scoring**: Automatically calculated based on marks configuration from Settings

## Access
- **Available to**: Super Admin only
- **Location**: Admin Dashboard → "Students Performance" tab

## Data Source
- Pulls from `student_info` table with joins to:
  - `registrations` (student details)
  - `classes` (class information)
  - `slots` (slot information)
  - `settings` (marks configuration)

## Implementation Files
- **Component**: `src/components/StudentsPerformance.jsx`
- **Styles**: `src/components/StudentsPerformance.css`
- **Integration**: Updated `src/components/AdminDashboard.jsx`

## Key Calculations
- **Total Marks**: Sum of all performance indicators + attendance marks
- **Average Marks**: Total marks / number of records
- **Percentage**: (Total marks / Max possible marks) × 100
- **Attendance Rate**: (Present count / Total classes) × 100

## Responsive Design
- Mobile-friendly layout
- Adaptive grids and tables
- Touch-friendly controls

## Usage
1. Login as Super Admin
2. Navigate to "Students Performance" tab
3. Select view mode (Summary/Detailed/Student Rankings)
4. Optionally filter by specific class
5. View comprehensive analytics and insights

## Technical Details
- **Real-time Data**: Fetches latest data on tab switch or filter change
- **Performance**: Efficient data aggregation and processing
- **Scalability**: Handles large datasets with optimized queries
- **Visual Design**: Modern gradient cards, progress bars, and color-coded badges

## Benefits
- Quick overview of overall student performance
- Identify top performers and students needing attention
- Track attendance patterns across classes
- Monitor effectiveness of different performance indicators
- Make data-driven decisions for class improvements
