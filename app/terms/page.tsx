import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - InstaSkul",
  description:
    "Terms of Service for InstaSkul, outlining usage and content licensing.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Terms of Service
        </h1>
        <p className="text-gray-600 mb-4">
          © 2025 InstaSkul. All rights reserved.
        </p>
        <p className="text-gray-600 mb-4">
          InstaSkul’s codebase is licensed under the MIT License (see{" "}
          <Link href="/LICENSE" className="text-blue-600 hover:underline">
            LICENSE
          </Link>
          ). Users retain copyright over their content but grant InstaSkul a
          worldwide, non-exclusive, royalty-free license to host and distribute
          it.
        </p>
        <p className="text-gray-600 mb-4">
          To report copyright infringement, contact{" "}
          <Link
            href="mailto:dmca@instaskul.com"
            className="text-blue-600 hover:underline"
          >
            dmca@instaskul.com
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
