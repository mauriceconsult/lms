import Link from "next/link";
import { Metadata } from "next";
import { InstaSkulLogo } from "@/components/instaskul-logo";

export const metadata: Metadata = {
  title: "InstaSkul User Guide and Terms of Use",
  description:
    "Documentation for InstaSkul, a transformative LMS for underpaid intellectuals in Engineering, Arts, Social Sciences, Natural Sciences, Business, Health, and Sports.",
  keywords: [
    "InstaSkul",
    "LMS",
    "documentation",
    "online courses",
    "knowledge sharing",
    "e-learning",
    "user guide",
    "terms of use",
    "copyright",
    "education",
  ],
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex justify-center mb-6">
          <InstaSkulLogo size="md" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-6 text-center">
          InstaSkul User Guide and Terms of Use
        </h1>
        <p className="text-slate-600 mb-8 text-center">
          Learning Management Platform. Version 1.0 | August 2025.
        </p>

        <h2 className="text-2xl font-semibold text-slate-800 mb-4">
          Introduction
        </h2>
        <p className="text-slate-600 mb-8">
          Welcome to InstaSkul, a platform designed to connect creators and
          learners through engaging online courses. This document provides a
          concise guide for using the platform and outlines the Terms of Use to
          protect our content and ensure a fair, professional experience for all
          users.
        </p>

        <h3 className="text-xl font-medium text-slate-800 mb-2">
          About InstaSkul
        </h3>
        <p className="text-slate-600 mb-8">
          InstaSkul enables creators to build and share educational courses,
          while learners can enroll, track progress, and complete tutorials. Our
          platform is accessible on web and mobile, with secure payments powered
          by MoMo API.
        </p>

        <h3 className="text-xl font-medium text-slate-800 mb-2">
          Purpose of This Document
        </h3>
        <p className="text-slate-600 mb-8">
          This guide helps creators and learners navigate InstaSkul’s features.
          The Terms of Use section ensures proper use and protects intellectual
          property. For updates, visit our{" "}
          <Link href="/docs" className="text-blue-600 hover:underline">
            docs page
          </Link>
          .
        </p>

        <h2 className="text-2xl font-semibold text-slate-800 mb-4">
          User Guide for Creators
        </h2>
        <p className="text-slate-600 mb-4">
          This section explains how creators can set up and manage courses on
          InstaSkul.
        </p>
        <h3 className="text-xl font-medium text-slate-800 mb-2">
          Creating a Course
        </h3>
        <ul className="list-disc list-inside text-slate-600 mb-4 space-y-2">
          <li>
            Log In: Sign in at{" "}
            <Link
              href="https://instaskul.com"
              className="text-blue-600 hover:underline"
            >
              instaskul.com
            </Link>{" "}
            using your credentials.
          </li>
          <li>
            Access Dashboard: Navigate to the Creator Dashboard from the
            sidebar.
          </li>
          <li>
            Add Course: Click &quot;Create Course,&quot; enter a title, description, and
            price (as a string, e.g., &quot;1000&quot;).
          </li>
          <li>
            Add Tutorials: In the course page, add tutorials with titles,
            content, and set &quot;isPublished&quot; to true for visibility.
          </li>
          <li>
            Publish: Save and publish the course to make it available to
            learners.
          </li>
        </ul>

        <h3 className="text-xl font-medium text-slate-800 mb-2">
          Managing Tutorials
        </h3>
        <ul className="list-disc list-inside text-slate-600 mb-4 space-y-2">
          <li>
            Edit Content: From the course page, edit tutorial titles, content,
            or order (via &quot;position&quot; field).
          </li>
          <li>
            Track Progress: Monitor learner enrollment and progress via the
            dashboard analytics.
          </li>
          <li>
            Set Free/Locked: Mark tutorials as free or locked (requires
            enrollment) in the tutorial settings.
          </li>
        </ul>

        <h3 className="text-xl font-medium text-slate-800 mb-2">
          Best Practices
        </h3>
        <ul className="list-disc list-inside text-slate-600 mb-8 space-y-2">
          <li>Use clear, concise titles and descriptions.</li>
          <li>Ensure content is original to avoid copyright issues.</li>
          <li>Test tutorials for accessibility on mobile and web.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-slate-800 mb-4">
          User Guide for Learners
        </h2>
        <p className="text-slate-600 mb-4">
          This section guides learners on enrolling in and navigating courses.
        </p>
        <h3 className="text-xl font-medium text-slate-800 mb-2">
          Enrolling in a Course
        </h3>
        <ul className="list-disc list-inside text-slate-600 mb-4 space-y-2">
          <li>
            Browse Courses: Visit{" "}
            <Link
              href="https://instaskul.com/courses"
              className="text-blue-600 hover:underline"
            >
              instaskul.com/courses
            </Link>{" "}
            and use the search bar to find courses.
          </li>
          <li>
            Enroll: Click a course, then select &quot;Enroll&quot; and complete payment
            via MoMo API (enter a 12-digit MSISDN, e.g., 256123456789).
          </li>
          <li>
            Confirm Enrollment: After payment, the course appears in your
            dashboard.
          </li>
        </ul>

        <h3 className="text-xl font-medium text-slate-800 mb-2">
          Navigating Courses
        </h3>
        <ul className="list-disc list-inside text-slate-600 mb-4 space-y-2">
          <li>
            Access Sidebar: On desktop, view the sidebar at{" "}
            {/* <Link
              href="https://instaskul.com/courses/[courseId]"
              className="text-blue-600 hover:underline"
            > */}
              instaskul.com/courses/[courseId]
            {/* </Link> */}
            . On mobile, tap the menu icon to open it.
          </li>
          <li>
            View Tutorials: Click tutorial titles to access content. Locked
            tutorials require enrollment.
          </li>
          <li>
            Track Progress: Check completion status (checkmark for completed,
            play icon for in-progress) and overall progress percentage in the
            sidebar.
          </li>
        </ul>

        <h3 className="text-xl font-medium text-slate-800 mb-2">
          Payment Instructions
        </h3>
        <ul className="list-disc list-inside text-slate-600 mb-8 space-y-2">
          <li>Use a valid 12-digit MSISDN for MoMo payments.</li>
          <li>
            Ensure the course amount is valid (contact support if errors occur).
          </li>
          <li>After payment, tutorials unlock automatically.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-slate-800 mb-4">
          Terms of Use
        </h2>
        <p className="text-slate-600 mb-4">
          By using InstaSkul, you agree to these Terms of Use, which protect our
          intellectual property and ensure a fair platform experience.
        </p>
        <h3 className="text-xl font-medium text-slate-800 mb-2">
          Copyright and Intellectual Property
        </h3>
        <ul className="list-disc list-inside text-slate-600 mb-4 space-y-2">
          <li>
            All content on InstaSkul, including courses, tutorials, and the
            InstaSkul logo, is owned by InstaSkul or its creators and protected
            by copyright law.
          </li>
          <li>
            Users may not reproduce, distribute, or modify content without
            written permission from InstaSkul.
          </li>
          <li>
            Creators retain ownership of their course content but grant
            InstaSkul a non-exclusive license to host and display it.
          </li>
        </ul>

        <h3 className="text-xl font-medium text-slate-800 mb-2">
          User Responsibilities
        </h3>
        <ul className="list-disc list-inside text-slate-600 mb-4 space-y-2">
          <li>
            Creators: Must upload original content and comply with copyright
            laws. InstaSkul is not liable for user-generated content violations.
          </li>
          <li>
            Learners: Must use content for personal learning only. Sharing login
            credentials or course materials is prohibited.
          </li>
          <li>
            Report copyright concerns to{" "}
            <Link
              href="mailto:support@instaskul.com"
              className="text-blue-600 hover:underline"
            >
              support@instaskul.com
            </Link>
            .
          </li>
        </ul>

        <h3 className="text-xl font-medium text-slate-800 mb-2">
          Limitations of Liability
        </h3>
        <p className="text-slate-600 mb-8">
          InstaSkul is not responsible for payment issues due to invalid MSISDN
          or course data errors. Contact support for assistance.
        </p>

        <h2 className="text-2xl font-semibold text-slate-800 mb-4">
          Contact and Support
        </h2>
        <p className="text-slate-600 mb-8">
          Join our community on{" "}
          <Link
            href="https://x.com/instaskul"
            className="text-blue-600 hover:underline"
          >
            X
          </Link>
          ,{" "}
          <Link
            href="https://linkedin.com/company/instaskul"
            className="text-blue-600 hover:underline"
          >
            LinkedIn
          </Link>
          ,{" "}
          <Link
            href="https://discord.gg/instaskul"
            className="text-blue-600 hover:underline"
          >
            Discord
          </Link>
          ,{" "}
          <Link
            href="https://whatsapp.com/channel/instaskul"
            className="text-blue-600 hover:underline"
          >
            WhatsApp
          </Link>
          , or{" "}
          <Link
            href="https://facebook.com/instaskul"
            className="text-blue-600 hover:underline"
          >
            Facebook
          </Link>
          . Contact us at{" "}
          <Link
            href="mailto:support@instaskul.com"
            className="text-blue-600 hover:underline"
          >
            support@instaskul.com
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
