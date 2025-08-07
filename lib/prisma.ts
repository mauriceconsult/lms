import { PrismaClient, Prisma } from "@prisma/client";

export const prisma = new PrismaClient();

// Define Noticeboard type with comments included
export type NoticeboardWithComments = Prisma.NoticeboardGetPayload<{
  include: { comments: true };
}>;

// Define Comment type with all fields
export type Comment = Prisma.CommentGetPayload<true>;
