import { db } from "@/lib/db";
import { Payroll, School } from "@prisma/client";

type PayrollWithSchool = Payroll & {
  school: School | null;
  payrolls: { id: string }[];
};

type GetPayrolls = {
  userId: string;
  title?: string;
  schoolId?: string;
};
export const getPayrolls = async ({
  userId,
  title,
  schoolId,
}: GetPayrolls): Promise<PayrollWithSchool[]> => {
  try {
    const payrolls = await db.payroll.findMany({
      where: {
        isPublished: true,
        title: title ? { contains: title } : undefined,
        schoolId,
        userId,
      },
      include: {
        school: true,
        attachments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    const payrollsWithSchool: PayrollWithSchool[] = await Promise.all(
      payrolls.map(async (payroll) => {
        return {
          ...payroll,
          payrolls: payroll.attachments
            ? payroll.attachments.map((a: { id: string }) => ({ id: a.id }))
            : [],
        };
      })
    );
    return payrollsWithSchool;
  } catch (error) {
    console.log("[GET_PAYROLLS]", error);
    return [];
  }
};
