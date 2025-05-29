import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastProvider } from "@/components/providers/toaster-provider";

export const metadata: Metadata = {
  title: "InstaSkul",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  description: "IT Consulting & Training Agency",
  keywords: ["IT", "Consulting", "Agency", "digital courses", "online courses", "education", "Training"],
  authors: [{ name: "Maurice Consulting Agency" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <ToastProvider/>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
