// import { db } from "@/lib/db";
// import { auth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     const { userId } = await auth();
//     const customerSecret = process.env.MOMOUSER_SECRET;
//     const momoPrimaryKey = process.env.MOMO_PRIMARY_KEY;
//     const { momoPass, username } = await req.json();
//     if (!userId) {
//       return new NextResponse("Unauthorized!", { status: 401 });
//     }
//     const momoPassword = await db.customer.create({
//       data: {
//         customerSecret,
//         momoPrimaryKey,
//         momoPass,
//         userId,
//         username,
//       },
//     });

//     return NextResponse.json(momoPassword);
//   } catch (error) {
//     console.log("[MOMO_USER]", error);
//     return new NextResponse("Internal error", { status: 500 });
//   }
// }
