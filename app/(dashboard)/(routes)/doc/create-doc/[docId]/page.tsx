import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { IconBadge } from "@/components/icon-badge";
import { ListChecks } from "lucide-react";
import { DocTitleForm } from "./_components/doc-title-form";
import { DocDescriptionForm } from "./_components/doc-description-form";
import { DocImageForm } from "./_components/doc-image-form";
import { DocFacultyForm } from "./_components/doc-faculty-form";
import { DocTutorForm } from "./_components/doc-tutor-form";
import { DocReceiptForm } from "./_components/doc-receipt-form";
import { DocPaymentForm } from "./_components/doc-payment-form";
import { DocAttachmentForm } from "./_components/doc-attachment-form";
import { DocTutorialForm } from "./_components/doc-tutorial-form";
import { DocLessonForm } from "./_components/doc-lesson-form";
import { DocSchoolForm } from "./_components/doc-school-form";
import { Actions } from "./_components/actions";

const DocIdPage = async ({
  params,
}: {
  params: {
    docId: string;
  };
}) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const doc = await db.doc.findUnique({
    where: {
      id: params.docId,
      userId,
    },
    include: {
      faculty: {
        orderBy: {
          position: "asc",
        },
      },
      courses: {
        orderBy: {
          position: "asc"
        }
      },
      tutors: {
        orderBy: {
          position: "asc"
        }
      },
      attachments: {
        orderBy: {
          createdAt: "desc"
        }
      },
      receipts: {
        orderBy: {
          createdAt: "desc"
        }
      },
      payments: {
        orderBy: {
          createdAt: "desc"
        }
      },
      // purchase: {
      //   orderBy: {
      //     createdAt: "desc"
      //   }
      // }
    }
  });
  const faculty = await db.faculty.findUnique({
    where: {
      id: params.docId,
      userId,
    },
  });
  const school = await db.school.findMany({
    orderBy: {
      name: "asc",
    },
  });
  console.log(school);
  if (!school) {
    return redirect("/");
  }
  if (!doc || !school || !faculty ) {
    return redirect("/");
  }
  const requiredFields = [
    doc.title,
    doc.school,
    doc.description,
    doc.imageUrl,
    doc.faculty.length > 0,
    doc.attachments.length > 0,
    doc.courses.length > 0,
    doc.payments.length > 0,
    doc.receipts.length > 0,
    doc.tutors.length > 0,
    // doc.purchase.length > 0,   
  ];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields} of ${totalFields})`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Doc setup</h1>
          <span className="text-sm text-slate-700">
            Complete all fields {completionText}
          </span>
        </div>
         <Actions
            disabled={!isComplete}
            docId={params.docId}
            isPublished={doc.isPublished}
          />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={ListChecks} />
            <h2 className="text-xl">Docs</h2>
          </div>
          <DocTitleForm initialData={doc} docId={doc.id} />
          <DocImageForm initialData={doc} docId={doc.id} />
          <DocSchoolForm
            initialData={doc}
            docId={doc.id}
            options={school.map((cat) => ({
              label: cat.name,
              value: cat.id,
            }))}
          />
          <DocDescriptionForm initialData={doc} docId={doc.id} />
        </div>
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={ListChecks} />
            <h2 className="text-xl">Doc docs</h2>
          </div>
          <DocFacultyForm initialData={doc} docId={doc.id} />
          <DocLessonForm initialData={doc} docId={doc.id} />
          <DocTutorForm initialData={doc} docId={doc.id} />
          <DocTutorialForm initialData={doc} docId={doc.id} />
          <DocReceiptForm initialData={doc} docId={doc.id} />
          <DocPaymentForm initialData={doc} docId={doc.id} />
          <DocAttachmentForm initialData={doc} docId={doc.id} />
        </div>
      </div>
    </div>
  );
}
export default DocIdPage;
