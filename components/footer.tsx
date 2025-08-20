import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t py-6 text-center text-gray-500 text-sm">
      <p className="mb-2">
        InstaSkul empowers communities through IT consulting and online
        training.{" "}
        <Link href="/about" className="text-blue-600 hover:underline">
          Learn more
        </Link>{" "}
        or{" "}
        <Link
          href="mailto:beta@instaskul.com"
          className="text-blue-600 hover:underline"
        >
          join our beta
        </Link>
        .
      </p>
      <p>© 2025 InstaSkul. All rights reserved.</p>
    </footer>
  );
}
