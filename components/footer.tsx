import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t py-6 text-center text-gray-500 text-sm">
      <p className="mb-2">
        Courses in Engineering, Arts, Social
        Sciences, Natural Sciences, Business, Health, and Sports to share
        knowledge globally.{" "}
        <Link href="/about" className="text-blue-600 hover:underline">
          Learn more
        </Link>
        .
      </p>
      <p>© 2025 InstaSkul. All rights reserved.</p>
    </footer>
  );
}
