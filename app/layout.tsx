import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastProvider } from "@/components/providers/toaster-provider";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "InstaSkul",
  description: "IT Consulting & Training Agency",
  keywords: [
    "IT",
    "Consulting",
    "Agency",
    "digital courses",
    "online courses",
    "education",
    "Training",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="min-h-full">
        <body className="flex flex-col min-h-full bg-gray-50">
          <ToastProvider />
          <main className="flex-grow">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
