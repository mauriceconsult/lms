// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require("@prisma/client");
const database = new PrismaClient();

async function main() {
  try {
    // Seed School data (existing logic)
    await database.school.createMany({
      data: [
        { name: "Engineering & Technology" },
        { name: "Arts & Humanities" },
        { name: "Social Sciences" },
        { name: "Natural Sciences" },
        { name: "Business & Management" },
        { name: "Health Sciences" },
        { name: "Sports & Fitness" },
      ],
    });
    console.log("Successfully seeded schools");
  } catch (error) {
    console.log("Error seeding the database", error);
  } finally {
    await database.$disconnect();
  }
}

main();
