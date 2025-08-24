// docs/eduPlat_Frontend_Documentation.md
# eduPlat Frontend Documentation

## Overview
eduPlat is a Next.js-based frontend application for managing courses, admins, and user progress. It integrates with the **instaskul** backend, uses Clerk for authentication, Prisma for database interactions, and Tailwind CSS for styling. The term "Faculty" is used in placeholders (e.g., `CreateAdmin`) to guide users in naming admin accounts after academic units.

## Project Structure
- **`app/`**:
  - **`app/(dashboard)/(routes)/(root)/page.tsx`**: Dashboard for courses.
  - **`app/(eduplat)/admins/[adminId]/courses/page.tsx`**: Admin-specific courses.
  - **`app/(eduplat)/admins/[adminId]/courses/[courseId]/courseNoticeboards/page.tsx`**: Course noticeboards list.
  - **`app/(eduplat)/search/page.tsx`**: Search page with courses and noticeboards.
  - **`app/(dashboard)/(routes)/create-admin/page.tsx`**: Admin creation form.
  - **`app/(eduplat)/about/page.tsx`**: Editable About page.
  - **`app/(eduplat)/_components/`**: Components (e.g., `CourseCard`, `EduplatNavbar`, `AboutContent`, `CourseNoticeboardList`, `CourseNoticeboardCard`, `CourseNoticeboardSearchInput`).
  - **`app/(eduplat)/types/`**: Types (e.g., `course.ts`, `course-noticeboard.ts`).
- **`actions/`**: Server actions (e.g., `get-dashboard-courses.ts`, `get-courseNoticeboards.ts`).
- **`components/`**: UI components (e.g., `navbar-routes.tsx`, `icon-badge.tsx`).
- **`lib/`**: Utilities (e.g., `db.ts`).
- **`docs/`**: Documentation.
- **Removed**:
  - `Faculty`-related files (e.g., `create-faculty`, `Faculty*.tsx`).
  - `app/about/page.tsx` to resolve `/about` routing conflict.
  - `app/(eduplat)/adm` (assumed remnant).
  - `app/(eduplat)/_components/course-coursenoticeboard-search-input.tsx` (replaced with `course-noticeboard-search-input.tsx`).

## Key Components
### CourseCard
- **Path**: `app/(eduplat)/_components/course-card.tsx`
- **Purpose**: Displays course details.

### CoursesList
- **Path**: `app/(eduplat)/_components/courses-list.tsx`
- **Purpose**: Renders a grid of courses.

### EduplatNavbar
- **Path**: `app/(eduplat)/_components/eduplat-navbar.tsx`
- **Purpose**: Navigation with links to Admins, Courses, Tutors, and About.

### EduplatSidebar
- **Path**: `app/(eduplat)/_components/eduplat-sidebar.tsx`
- **Purpose**: Sidebar with course links.

### CourseNoticeboardSearchInput
- **Path**: `app/(eduplat)/_components/course-noticeboard-search-input.tsx`
- **Purpose**: Search input for noticeboards.

### AboutContent
- **Path**: `app/(eduplat)/_components/about-content.tsx`
- **Purpose**: Client-side component for About page form and content display.

### CourseNoticeboardList
- **Path**: `app/(eduplat)/_components/course-coursenoticeboard-list.tsx`
- **Purpose**: Renders a grid of course noticeboards.
- **Props**: `items: CourseNoticeboardWithCourse[]`

### CourseNoticeboardCard
- **Path**: `app/(eduplat)/_components/courseNoticeboard-card.tsx`
- **Purpose**: Displays a single course noticeboard with title, course, and description.
- **Props**: Includes `adminId` and `courseId` for `/admins` routing.

## Key Pages
### Dashboard Page
- **Path**: `app/(dashboard)/(routes)/(root)/page.tsx`
- **Purpose**: Displays in-progress and completed courses.

### Admin Courses Page
- **Path**: `app/(eduplat)/admins/[adminId]/courses/page.tsx`
- **Purpose**: Lists courses for an admin.

### Course Noticeboards Page
- **Path**: `app/(eduplat)/admins/[adminId]/courses/[courseId]/courseNoticeboards/page.tsx`
- **Purpose**: Lists noticeboards for a course.

### Search Page
- **Path**: `app/(eduplat)/search/page.tsx`
- **Purpose**: Displays courses and noticeboards with search functionality.

### Create Admin Page
- **Path**: `app/(dashboard)/(routes)/create-admin/page.tsx`
- **Purpose**: Form to create admin accounts with "Faculty" placeholder.

### About Page
- **Path**: `app/(eduplat)/about/page.tsx`
- **Purpose**: Provides admin setup guidance; editable by admins.

## Server Actions
### getDashboardCourses
- **Path**: `actions/get-dashboard-courses.ts`
- **Purpose**: Fetches courses with progress and admin data.

### getCourseNoticeboards
- **Path**: `actions/get-courseNoticeboards.ts`
- **Purpose**: Fetches course noticeboards with course data, including `courseNoticeboards`.

## API Routes
- **`app/api/about/route.ts`**: GET/POST for About content.
- **`app/api/admins/route.ts`**: Creates admins.

## Types
### CourseWithProgressWithAdmin
- **Path**: `app/(eduplat)/types/course.ts`
- **Definition**: Includes `admin: Admin` and `progress: number`.

### CourseNoticeboardWithCourse
- **Path**: `app/(eduplat)/types/course-noticeboard.ts`
- **Definition**: `CourseNoticeboard & { course: Course & { courseNoticeboards: CourseNoticeboard[] } | null }`

### CourseWithCourseNoticeboards
- **Path**: `app/(eduplat)/types/course-noticeboard.ts`
- **Definition**: `Course & { courseNoticeboards: CourseNoticeboard[] }`

## Setup Instructions
1. **Install Dependencies**:
   ```bash
   npm install