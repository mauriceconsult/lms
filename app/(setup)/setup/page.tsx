import { createAdmin } from "@/app/actions/admin";
import { auth } from "@clerk/nextjs/server";

export default async function SetupPage() {
  const { userId } = await auth();
  if (!userId) return <div>Unauthorized. Please log in.</div>;

  const facultyId = "cmdsostg20000u5hklpxygy16"; // Replace with dynamic value if needed
  let message = "Initializing setup...";

  try {
    const admin = await createAdmin(facultyId, userId);
    message = `Admin record created/verified for user ${userId} and faculty ${facultyId}. ID: ${admin.id}`;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    message = `Error creating admin: ${errorMessage}`;
    console.error("[CREATE_ADMIN_ERROR]", error);
  }

  return (
    <div>
      <h1>Admin Setup</h1>
      <p>{message}</p>
      <a href={`/faculties/${facultyId}/courseworks/create`}>
        Go to Create Coursework
      </a>
    </div>
  );
}
