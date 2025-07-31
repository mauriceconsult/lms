// import { db } from "@/lib/db";
// import { NextRequest, NextResponse } from "next/server";

// // Define the Student type (optional, move to types.ts if shared)
// interface student {
//   id: string;
//   name: string;
//   // Add other fields as needed
// }

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { facultyId: string } }
// ) {
//   const { facultyId } = params;

//   try {
//     const students = await db.student.findMany({
//       where: {
//         facultyId: facultyId, // Adjust based on your schema
//         coursework: {
//           some: {}, // Filter by coursework if applicable
//         },
//       },
//       select: {
//         id: true,
//         name: true, // Match the Student interface
//         // Add other fields as needed
//       },
//     });

//     return NextResponse.json(students);
//   } catch (error) {
//     console.error("Error fetching students:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch students" },
//       { status: 500 }
//     );
//   }
// }
