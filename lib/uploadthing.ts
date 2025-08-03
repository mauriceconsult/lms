import { type FileRouter } from "uploadthing/next";

export type OurFileRouter = FileRouter & {
  courseworkAttachment: {
    middleware: (args: { req: Request }) => Promise<{ userId: string }>;
    onUploadComplete: (args: {
      metadata: { userId: string };
      file: { name: string; url: string; key: string };
    }) => Promise<{ uploadedBy: string; file: { name: string; url: string; key: string } }>;
  };
};