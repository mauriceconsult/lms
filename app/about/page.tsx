import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About InstaSkul - Empowering Underpaid Intellectuals",
  description:
    "InstaSkul is a transformative LMS empowering intellectuals in Engineering & Technology, Arts & Humanities, Social Sciences, Natural Sciences, Business & Management, Health Sciences, Sports & Fitness",
  keywords: [
    "InstaSkul",
    "LMS",
    "knowledge sharing",
    "online courses",
    "law education",
    "medical training",
    "traditional skills",
    "green revolution",   
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
          InstaSkul is an open-source platform under the MIT License, inviting
          developers and educators to join our mission. Contribute at{" "}
          <Link
            href="https://github.com/your-org/instaskul"
            className="text-blue-600 hover:underline"
          >
            GitHub
          </Link>{" "}
          or connect with us on{" "}
          <Link
            href="https://x.com/instaskul"
            className="text-blue-600 hover:underline"
          >
            X
          </Link>{" "}
          and{" "}
          <Link
            href="https://linkedin.com/company/instaskul"
            className="text-blue-600 hover:underline"
          >
            LinkedIn
          </Link>
          .
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Why InstaSkul?
        </h2>
        <ul className="list-disc list-inside text-gray-600 mb-8 space-y-2">
          <li>
            Engaging courses in Engineering & Technology, Arts & Humanities,
            Social Sciences, Natural Sciences, Business & Management, Health
            Sciences, Sports & Fitness, with videos and interactive content.
          </li>
          <li>
            Secure access powered by Clerk, ensuring a safe learning
            environment.
          </li>
          <li>Learn anywhere, anytime, on any device—phones to desktops.</li>
          <li>
            Empower underpaid intellectuals to earn by sharing expertise with
            global learners.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Our Vision
        </h2>
        <p className="text-gray-600 mb-8">
          InstaSkul is a transformative knowledge-sharing ecosystem designed for
          street-level intellectuals professionals in
          Engineering & Technology, Arts & Humanities, Social Sciences, Natural
          Sciences, Business & Management, Health Sciences, Sports & Fitness. We
          empower these passionate experts to share their knowledge with average
          internet seekers worldwide, creating accessible, affordable education
          that drives social and economic change. Join us to democratize
          learning and uplift communities through expertise.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Community Spotlight
        </h2>
        <p className="text-gray-600 mb-8">
          Meet our contributors, like Sarah, a traditional healer sharing herbal
          medicine courses, or Dr. Okello, a medical professional offering free
          health tutorials. Their stories inspire us. Share your journey on{" "}
          <Link
            href="https://x.com/instaskul"
            className="text-blue-600 hover:underline"
          >
            X
          </Link>{" "}
          with #InstaSkulStories or join our{" "}
          <Link
            href="https://discord.gg/instaskul"
            className="text-blue-600 hover:underline"
          >
            Discord
          </Link>{" "}
          to connect with educators and learners.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Join Our Beta Program
        </h2>
        <p className="text-gray-600 mb-6">
          We’re in closed beta, seeking passionate educators in Engineering &
          Technology, Arts & Humanities, Social Sciences, Natural Sciences,
          Business & Management, Health Sciences, Sports & Fitness to share
          their expertise. Test InstaSkul’s features, provide feedback, and
          shape our ecosystem.
        </p>
        <p className="text-gray-600 mb-8">
          Interested? Email{" "}
          <Link
            href="mailto:beta@instaskul.com"
            className="text-blue-600 hover:underline"
          >
            beta@instaskul.com
          </Link>{" "}
          with your name, field (e.g., law, green revolution), and why you’re
          excited. Follow us on{" "}
          <Link
            href="https://whatsapp.com/channel/instaskul"
            className="text-blue-600 hover:underline"
          >
            WhatsApp
          </Link>{" "}
          for updates. Beta access is invitation-only.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Get in Touch
        </h2>
        <p className="text-gray-600 mb-8">
          Questions or support? Contact us at{" "}
          <Link
            href="mailto:support@instaskul.com"
            className="text-blue-600 hover:underline"
          >
            support@instaskul.com
          </Link>{" "}
          or join our{" "}
          <Link
            href="https://facebook.com/instaskul"
            className="text-blue-600 hover:underline"
          >
            Facebook
          </Link>{" "}
          community.
        </p>
      </div>
    </div>
  );
}
