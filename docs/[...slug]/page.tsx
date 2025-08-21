import { readFileSync } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "docs", slug.join("/")) + ".md";
  try {
    const content = readFileSync(filePath, "utf8");
    const title = content.split("\n")[0].replace("# ", "");
    return {
      title: `${title} - InstaSkul Docs`,
      description: `Documentation for ${title} on InstaSkul, empowering underpaid intellectuals.`,
    };
  } catch {
    return {
      title: "InstaSkul Documentation",
      description: "Documentation for InstaSkul LMS.",
    };
  }
}

export default async function DocsSlugPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "docs", slug.join("/")) + ".md";

  try {
    const content = readFileSync(filePath, "utf8");
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="prose prose-gray max-w-none">
            <ReactMarkdown
              components={{
                a: ({ href, children }) => (
                  <Link
                    href={href || "#"}
                    className="text-blue-600 hover:underline"
                  >
                    {children}
                  </Link>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}
