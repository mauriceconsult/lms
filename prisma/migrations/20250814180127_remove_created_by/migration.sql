/*
  Warnings:

  - You are about to drop the column `courseId` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Attachment` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `Coursework` table. All the data in the column will be lost.
  - You are about to drop the column `facultyId` on the `Coursework` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `Faculty` table. All the data in the column will be lost.
  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StudentCourseworkSubmission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AdminToCoursework` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CourseToUserProgress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FacultyToUserProgress` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[playbackId]` on the table `Tutor` will be added. If there are existing duplicate values, this will fail.
  - Made the column `userId` on table `Faculty` required. This step will fail if there are existing NULL values in that column.
  - Made the column `title` on table `Tutor` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `courseId` to the `UserProgress` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Assignment" DROP CONSTRAINT "Assignment_courseId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Coursework" DROP CONSTRAINT "Coursework_facultyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."StudentCourseworkSubmission" DROP CONSTRAINT "StudentCourseworkSubmission_courseworkId_fkey";

-- DropForeignKey
ALTER TABLE "public"."_AdminToCoursework" DROP CONSTRAINT "_AdminToCoursework_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_AdminToCoursework" DROP CONSTRAINT "_AdminToCoursework_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_CourseToUserProgress" DROP CONSTRAINT "_CourseToUserProgress_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_CourseToUserProgress" DROP CONSTRAINT "_CourseToUserProgress_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_FacultyToUserProgress" DROP CONSTRAINT "_FacultyToUserProgress_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_FacultyToUserProgress" DROP CONSTRAINT "_FacultyToUserProgress_B_fkey";

-- DropIndex
DROP INDEX "public"."Assignment_courseId_idx";

-- DropIndex
DROP INDEX "public"."Coursework_isPublished_facultyId_createdBy_idx";

-- DropIndex
DROP INDEX "public"."Student_facultyId_idx";

-- DropIndex
DROP INDEX "public"."Submission_courseworkId_studentId_idx";

-- DropIndex
DROP INDEX "public"."Tutor_courseId_idx";

-- AlterTable
ALTER TABLE "public"."Assignment" DROP COLUMN "courseId",
ADD COLUMN     "tutorId" TEXT;

-- AlterTable
ALTER TABLE "public"."Attachment" DROP COLUMN "name";

-- AlterTable
ALTER TABLE "public"."Course" ADD COLUMN     "publishDate" TIMESTAMP(3),
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Coursework" DROP COLUMN "createdBy",
DROP COLUMN "facultyId",
ADD COLUMN     "courseId" TEXT,
ADD COLUMN     "publishDate" TIMESTAMP(3),
ALTER COLUMN "position" DROP NOT NULL,
ALTER COLUMN "position" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."Faculty" DROP COLUMN "createdBy",
ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "position" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."Noticeboard" ADD COLUMN     "publishDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."Student" ADD COLUMN     "courseId" TEXT;

-- AlterTable
ALTER TABLE "public"."Submission" ADD COLUMN     "assignmentId" TEXT,
ADD COLUMN     "courseId" TEXT;

-- AlterTable
ALTER TABLE "public"."Tuition" ALTER COLUMN "partyId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Tutor" ADD COLUMN     "playbackId" TEXT,
ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "title" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."UserProgress" ADD COLUMN     "courseId" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."Admin";

-- DropTable
DROP TABLE "public"."StudentCourseworkSubmission";

-- DropTable
DROP TABLE "public"."_AdminToCoursework";

-- DropTable
DROP TABLE "public"."_CourseToUserProgress";

-- DropTable
DROP TABLE "public"."_FacultyToUserProgress";

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "role" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Enrollment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "facultyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "studentId" TEXT,

    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Comment" (
    "id" TEXT NOT NULL,
    "noticeboardId" TEXT NOT NULL,
    "courseNoticeboardId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Enrollment_courseId_idx" ON "public"."Enrollment"("courseId");

-- CreateIndex
CREATE INDEX "Assignment_tutorId_idx" ON "public"."Assignment"("tutorId");

-- CreateIndex
CREATE INDEX "Coursework_courseId_idx" ON "public"."Coursework"("courseId");

-- CreateIndex
CREATE INDEX "Student_courseId_idx" ON "public"."Student"("courseId");

-- CreateIndex
CREATE INDEX "Submission_courseId_courseworkId_assignmentId_studentId_idx" ON "public"."Submission"("courseId", "courseworkId", "assignmentId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Tutor_playbackId_key" ON "public"."Tutor"("playbackId");

-- CreateIndex
CREATE INDEX "Tutor_facultyId_courseId_idx" ON "public"."Tutor"("facultyId", "courseId");

-- AddForeignKey
ALTER TABLE "public"."Enrollment" ADD CONSTRAINT "Enrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Enrollment" ADD CONSTRAINT "Enrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Enrollment" ADD CONSTRAINT "Enrollment_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "public"."Faculty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Enrollment" ADD CONSTRAINT "Enrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Tuition" ADD CONSTRAINT "Tuition_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Assignment" ADD CONSTRAINT "Assignment_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "public"."Tutor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Coursework" ADD CONSTRAINT "Coursework_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Submission" ADD CONSTRAINT "Submission_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Submission" ADD CONSTRAINT "Submission_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "public"."Assignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Student" ADD CONSTRAINT "Student_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserProgress" ADD CONSTRAINT "UserProgress_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserProgress" ADD CONSTRAINT "UserProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_noticeboardId_fkey" FOREIGN KEY ("noticeboardId") REFERENCES "public"."Noticeboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_courseNoticeboardId_fkey" FOREIGN KEY ("courseNoticeboardId") REFERENCES "public"."CourseNoticeboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
