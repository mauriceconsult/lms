// app/(eduplat)/about/page.tsx
import { auth } from "@clerk/nextjs/server";
import axios from "axios";
import { AboutContent } from "@/app/(eduplat)/_components/about-content";

async function fetchAboutContent() {
  try {
    const response = await axios.get("/api/about");
    return response.data.content || "";
  } catch (error) {
    console.error(
      `[${new Date().toISOString()} fetchAboutContent] Error:`,
      error
    );
    return "";
  }
}

export default async function AboutPage() {
  const { userId } = await auth();
  const isAdmin = userId ? true : false; // Replace with actual admin check
  const initialContent = await fetchAboutContent();

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">About eduPlat</h1>
      <AboutContent initialContent={initialContent} isAdmin={isAdmin} />
    </div>
  );
}
