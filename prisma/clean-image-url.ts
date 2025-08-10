import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const defaultImageUrl = "/placeholder.png"; // Use local placeholder

  console.log(
    `[${new Date().toISOString()} clean-imageUrl] Starting imageUrl cleanup for all courses`
  );

  const courses = await prisma.course.findMany({
    select: { id: true, imageUrl: true, isPublished: true },
  });

  console.log(
    `[${new Date().toISOString()} clean-imageUrl] Found ${
      courses.length
    } courses`
  );

  let updatedCount = 0;
  for (const course of courses) {
    if (
      !course.imageUrl ||
      (!course.imageUrl.startsWith("http") &&
        !course.imageUrl.startsWith("/")) ||
      course.imageUrl.includes("via.placeholder.com") ||
      !course.imageUrl.startsWith("https://utfs.io/")
    ) {
      console.log(
        `[${new Date().toISOString()} clean-imageUrl] Updating imageUrl for course:`,
        {
          id: course.id,
          isPublished: course.isPublished,
          oldImageUrl: course.imageUrl,
          newImageUrl: defaultImageUrl,
        }
      );
      await prisma.course.update({
        where: { id: course.id },
        data: { imageUrl: defaultImageUrl },
      });
      updatedCount++;
    } else {
      console.log(
        `[${new Date().toISOString()} clean-imageUrl] Skipping course:`,
        {
          id: course.id,
          isPublished: course.isPublished,
          imageUrl: course.imageUrl,
        }
      );
    }
  }

  console.log(
    `[${new Date().toISOString()} clean-imageUrl] Completed cleanup: Updated ${updatedCount} courses to use ${defaultImageUrl}`
  );
}

main()
  .catch((e) =>
    console.error(`[${new Date().toISOString()} clean-imageUrl] Error:`, e)
  )
  .finally(async () => {
    console.log(
      `[${new Date().toISOString()} clean-imageUrl] Disconnecting Prisma client`
    );
    await prisma.$disconnect();
  });
