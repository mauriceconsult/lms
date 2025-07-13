import { db } from "@/lib/db";
import { Attachment, Payroll } from "@prisma/client";

interface GetPayrollProps {
  userId: string;
  schoolId: string;
  payrollId: string;
}
export const getPayroll = async ({
  userId,
  schoolId,
  payrollId,
}: GetPayrollProps) => {
  try {   
    const school = await db.school.findUnique({
      where: {        
        id: schoolId,        
      },   
    });
    const payroll = await db.payroll.findUnique({
      where: {
        id: payrollId,
        isPublished: true,
      },
    });
    if (!school || !payroll) {
      throw new Error("School or Payroll not found");
    }
    let attachments: Attachment[] = [];
    let nextPayroll: Payroll | null = null;
    if (userId) {
      attachments = await db.attachment.findMany({
        where: {
          id: school.id,
        },
      });
    }
    if (payroll.userId || userId) {    
      nextPayroll = await db.payroll.findFirst({
        where: {
          schoolId: school.id,
          isPublished: true,
          position: {
            gt: payroll?.position ?? 0,
          },
        },
        orderBy: {
          position: "asc",
        },
      });
    }
    // const userProgress = await db.userProgress.findUnique({
    //   where: {
    //     userId_payrollId: {
    //       userId,
    //       payrollId,
    //     },
    //   },
    // });
    return {
      payroll,
      school,      
      attachments,
      nextPayroll,
      // userProgress,    
    };
  } catch (error) {
    console.log("[GET_PAYROLL_ERROR]", error);
    return {
      payroll: null,
      school: null,      
      attachments: [],
      nextPayroll: null,
      // userProgress: null,      
    };
  }
};
