import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "InstaSkul Documentation",
  description:
    "Documentation for InstaSkul, a transformative LMS for underpaid intellectuals in Engineering, Arts, Social Sciences, Natural Sciences, Business, Health, and Sports.",
  keywords: [
    "InstaSkul",
    "LMS",
    "documentation",
    "online courses",
    "knowledge sharing",
  ],
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          InstaSkul Documentation
        </h1>
        <p className="text-gray-600 mb-8">
          Welcome to the official documentation for InstaSkul, empowering
          underpaid intellectuals to share knowledge globally. Explore our
          guides below.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Getting Started
        </h2>
        <ul className="list-disc list-inside text-gray-600 mb-8 space-y-2">
          <li>
            <Link
              href="/docs/getting-started/installation"
              className="text-blue-600 hover:underline"
            >
              Installation
            </Link>
          </li>
          <li>
            <Link
              href="/docs/getting-started/developer-setup"
              className="text-blue-600 hover:underline"
            >
              Developer Setup
            </Link>
          </li>
          <li>
            <Link
              href="/docs/getting-started/educator-guide"
              className="text-blue-600 hover:underline"
            >
              Educator Guide
            </Link>
          </li>
          <li>
            <Link
              href="/docs/getting-started/learner-guide"
              className="text-blue-600 hover:underline"
            >
              Learner Guide
            </Link>
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          API Reference
        </h2>
        <ul className="list-disc list-inside text-gray-600 mb-8 space-y-2">
          <li>
            <Link
              href="/docs/api/course-creation"
              className="text-blue-600 hover:underline"
            >
              Course Creation
            </Link>
          </li>
          <li>
            <Link
              href="/docs/api/checkout"
              className="text-blue-600 hover:underline"
            >
              Checkout
            </Link>
          </li>
          <li>
            <Link
              href="/docs/api/enrollment"
              className="text-blue-600 hover:underline"
            >
              Enrollment
            </Link>
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Contributing
        </h2>
        <ul className="list-disc list-inside text-gray-600 mb-8 space-y-2">
          <li>
            <Link
              href="/docs/contributing/guidelines"
              className="text-blue-600 hover:underline"
            >
              Contribution Guidelines
            </Link>
          </li>
          <li>
            <Link
              href="/docs/contributing/code-of-conduct"
              className="text-blue-600 hover:underline"
            >
              Code of Conduct
            </Link>
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Community</h2>
        <p className="text-gray-600 mb-8">
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
