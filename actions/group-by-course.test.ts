import { groupByCourse, TuitionWithCourse } from "./group-by-course";
import { Course, Tuition } from "@prisma/client";


describe("groupByCourse", () => {
  it("groups tuitions by course title and sums amounts", () => {
    const tuitions: TuitionWithCourse[] = [
      {
        id: "1",
        userId: "user_1",
        courseId: "course_1",
        amount: "66.66",
        transactionId: "txn_1",
        status: "completed",
        course: {
          id: "course_1",
          title: "Engineering 101",
          amount: "66.66",
          userId: "user_1",
          createdAt: new Date(),
          updatedAt: new Date(),
          description: null,
          imageUrl: null,
          adminId: null,
          position: null,
          isPublished: true,
          publishDate: null,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        transId: null,
        partyId: null,
        username: null,
        isActive: true,
        isPaid: true,
      },
      {
        id: "2",
        userId: "user_1",
        courseId: "course_2",
        amount: "99.99",
        transactionId: "txn_2",
        status: "completed",
        course: {
          id: "course_2",
          title: "Health 101",
          amount: "99.99",
          userId: "user_1",
          createdAt: new Date(),
          updatedAt: new Date(),
          description: null,
          imageUrl: null,
          adminId: null,
          position: null,
          isPublished: true,
          publishDate: null,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        transId: null,
        partyId: null,
        username: null,
        isActive: true,
        isPaid: true,
      },
    ];
    const result = groupByCourse(tuitions);
    expect(result).toEqual({
      "Engineering 101": 66.66,
      "Health 101": 99.99,
    });
  });

  it("handles null course or invalid amounts", () => {
    const tuitions: (Tuition & { course: Course | null })[] = [
      {
        id: "3",
        userId: "user_1",
        courseId: "course_3",
        amount: null,
        transactionId: "txn_3",
        status: "completed",
        course: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        transId: null,
        partyId: null,
        username: null,
        isActive: true,
        isPaid: true,
      },
    ];
    const result = groupByCourse(tuitions as TuitionWithCourse[]);
    expect(result).toEqual({});
  });
});
