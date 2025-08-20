import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About InstaSkul - Empowering Knowledge Sharing",
  description:
    "Learn about InstaSkul, a community-driven LMS for IT consulting and training, fostering social and economic transformation through online courses.",
  keywords: [
    "InstaSkul",
    "LMS",
    "IT consulting",
    "online courses",
    "education",
    "training",
  ],
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          About InstaSkul
        </h1>
        <p className="text-gray-600 mb-8">
          InstaSkul is open-source under the MIT License, inviting developers to
          contribute to our mission. Join us at{" "}
          <Link
            href="https://github.com/your-org/instaskul"
            className="text-blue-600 hover:underline"
          >
            GitHub
          </Link>
          .
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Why InstaSkul?
        </h2>
        <ul className="list-disc list-inside text-gray-600 mb-8 space-y-2">
          <li>
            Engaging digital courses with videos, assignments, and interactive
            content.
          </li>
          <li>
            Secure and user-friendly access powered by Clerk authentication.
          </li>
          <li>Flexible learning on any device, from phones to desktops.</li>
          <li>
            Opportunities for educators to earn by sharing their expertise.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Our Vision
        </h2>
        <p className="text-gray-600 mb-8">
          We believe education can transform lives. InstaSkul aims to
          democratize IT training and consulting by making learning accessible,
          affordable, and rewarding, fostering global knowledge-sharing and
          economic empowerment.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Join Our Beta Program
        </h2>
        <p className="text-gray-600 mb-6">
          We’re in our closed beta phase! Join us as a beta tester to explore
          InstaSkul’s features, provide feedback, and shape the future of online
          learning.
        </p>
        <p className="text-gray-600 mb-8">
          Interested? Email us at{" "}
          <Link
            href="mailto:beta@instaskul.com"
            className="text-blue-600 hover:underline"
          >
            beta@instaskul.com
          </Link>{" "}
          with your name, role (e.g., educator, learner), and why you’re excited
          about InstaSkul. Beta access is by invitation only.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Get in Touch
        </h2>
        <p className="text-gray-600 mb-8">
          Have questions or need support? Reach out at{" "}
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
