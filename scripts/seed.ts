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

    // Update existing Faculty records with createdBy
    const faculties = await database.faculty.findMany(); // Fetch all faculties
    for (const faculty of faculties) {
      if (!faculty.createdBy) {
        await database.faculty.create({
          data: {
            id: "cmdsostg20000u5hklpxygy16",
            title: "New day edited",
            createdBy: "user_2pOqv2tzOq6guQnvrQ8POLYPQ4q",
            imageUrl:
              "https://utfs.io/f/4Bacjf8iZEOenbu5l4BoiqpAPdZVlYywI0sR1zgLMB45Hcbe",
          },
        });
        console.log(`Updated createdBy for faculty ${faculty.id}`);
      }
    }
    console.log("Successfully updated faculty createdBy fields");
  } catch (error) {
    console.log("Error seeding the database", error);
  } finally {
    await database.$disconnect();
  }
}

main();
