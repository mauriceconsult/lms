import { db } from "@/lib/db";
import { Course, Tuition } from "@prisma/client";

type TuitionWithCourse = Tuition & {
  course: Course | null;
};

export const groupByCourse = (
  tuitions: TuitionWithCourse[]
): { [courseTitle: string]: number } => {
  const grouped: { [courseTitle: string]: number } = {};

  tuitions.forEach((tuition) => {
    if (!tuition.course) {
      return; // Skip if course is null
    }
    const courseTitle = tuition.course.title;
    const amount = parseFloat(tuition.course.amount ?? "0") || 0;

    if (!grouped[courseTitle]) {
      grouped[courseTitle] = 0;
    }
    grouped[courseTitle] += amount;
  });

  return grouped;
};
export const getAnalytics = async (userId: string) => {
  try {
    const tuitions = await db.tuition.findMany({
      where: {
        course: {
          userId,
        },
      },
      include: {
        course: true,
      },
    });

    const groupedEarnings = groupByCourse(tuitions);
    const data = Object.entries(groupedEarnings).map(([name, total]) => ({
      name,
      total,
    }));

    const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0);
    const totalSales = tuitions.length;

    return {
      data,
      totalRevenue,
      totalSales,
    };
  } catch (error) {
    console.error(`[${new Date().toISOString()} GET_ANALYTICS]`, error);
    return {
      data: [],
      totalRevenue: 0,
      totalSales: 0,
    };
  }
};
