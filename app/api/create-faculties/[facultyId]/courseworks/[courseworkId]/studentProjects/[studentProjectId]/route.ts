import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: {
      facultyId: string;
      courseworkId: string;
      studentProjectId: string;
    };
  }
) {
  const body = await request.json();
  const { isFree } = body;
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (!isFree || isFree.length === 0) {
    return new Response("No data provided", { status: 400 });
  }
  const ownCoursework = await db.coursework.findUnique({
    where: {
      id: params.courseworkId,
      facultyId: params.facultyId,
      userId,
    },
  });
  if (!ownCoursework) {
    return new Response("Coursework not found", { status: 404 });
  }
  const studentProject = await db.studentProject.findUnique({
    where: {
      id: params.studentProjectId,
      courseworkId: params.courseworkId,
      userId,
    },
  });
  if (!studentProject) {
    return new Response("Student Project not found", { status: 404 });
  }

  return new Response("Success", { status: 200 });
}

export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: {
      facultyId: string;
      courseworkId: string;
      studentProjectId: string;
    };
  }
) {
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  const studentProject = await db.studentProject.findUnique({
    where: {
      id: params.studentProjectId,
      courseworkId: params.courseworkId,
      userId,
    },
  });
  if (!studentProject) {
    return new Response("Topic not found", { status: 404 });
  }

  await db.studentProject.delete({
    where: {
      id: studentProject.id,
    },
  });
  const publishedStudentProjects = await db.studentProject.findMany({
    where: {
      id: params.studentProjectId,
      isPublished: true,
    },
  });
  if (publishedStudentProjects.length === 0) {
    await db.coursework.update({
      where: {
        id: params.studentProjectId,
      },
      data: {
        isPublished: false,
      },
    });
  }
  return new Response("Success", { status: 200 });
}
