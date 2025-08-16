"use server";

import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

interface GetAssignmentsParams {
  title?: string;
  tutorId?: string;
}

export async function getAssignments(params: GetAssignmentsParams) {
  try {
    const { title, tutorId } = params;

    const query: Prisma.AssignmentWhereInput = {};

    if (tutorId) {
      query.tutorId = tutorId;
    }

    if (title) {
      query.title = {
        contains: title,
        mode: "insensitive",
      };
    }

    const assignments = await db.assignment.findMany({
      where: query,
      orderBy: {
        position: "asc",
      },
      select: {
        id: true,
        userId: true,
        tutorId: true,
        title: true,
        description: true,
        objective: true,
        position: true,
        isPublished: true,
        isCompleted: true,
        // isFree: true,
        // videoUrl: true,
        // muxDataId: true,
        createdAt: true,
        updatedAt: true,
        tutor: {
          select: {
            id: true,
            userId: true,
            courseId: true,
            title: true,
            description: true,
            objective: true,
            position: true,
            isPublished: true,
            isCompleted: true,
            isFree: true,
            videoUrl: true,
            muxDataId: true,
            createdAt: true,
            updatedAt: true,
            // tutorId: true,
          },
        },
        // submissions: {
        //   select: {
        //     id: true,
        //     userId: true,
        //     assignmentId: true,
        //     createdAt: true,
        //     updatedAt: true,
        //   },
        // },
      },
    });

    return assignments;
  } catch (error) {
    console.error("Get assignments error:", error);
    return [];
  }
}
