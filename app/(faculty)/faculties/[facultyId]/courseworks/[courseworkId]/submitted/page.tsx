"use client";

import { useParams } from "next/navigation";

export default function SubmittedPage() {
  const params = useParams();
  const { facultyId, courseworkId } = params;

  return (
    <div className="p-4">
      <h1>Submission Confirmed</h1>
      <p>
        Your coursework for faculty {facultyId} and coursework {courseworkId}{" "}
        has been successfully submitted.
      </p>
      <a
        href={`/faculties/${facultyId}/courseworks/${courseworkId}`}
        className="text-blue-500 underline"
      >
        Return to Coursework
      </a>
    </div>
  );
}
