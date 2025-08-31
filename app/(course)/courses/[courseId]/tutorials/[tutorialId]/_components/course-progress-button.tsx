"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseProgressButtonProps {
  tutorialId: string;
  courseId: string;
  isCompleted?: boolean;
  nextTutorialId?: string;
}

export const CourseProgressButton = ({
  tutorialId,
  courseId,
  nextTutorialId,
  isCompleted,
}: CourseProgressButtonProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const onClick = async () => {
    try {
      setIsLoading(true);
     const response = await axios.put(`/api/courses/${courseId}/tutorials/${tutorialId}/progress`, {
        isCompleted: !isCompleted
      });
      if (!isCompleted && !nextTutorialId) {
        if (!response) {
        throw new Error("Failed to update progress");
      }

      toast.success(
        isCompleted
          ? "Tutorial marked as not completed."
          : "Tutorial marked as completed."
        )
      };
      if (!isCompleted && nextTutorialId) {
        router.push(`/courses/${courseId}/tutorials/${nextTutorialId}`)
      }
      toast.success("Progress updated.");
      router.refresh();
    } catch {
      toast.error("Something went wrong.")
    } finally {
      setIsLoading(false);
    }
  }
  const Icon = isCompleted ? XCircle : CheckCircle;
  return (
    <Button
      disabled={isLoading}
      onClick={onClick}
      type="button"
      variant={isCompleted ? "outline" : "success"}
      className="w-full md:w-auto"
    >
      {isCompleted ? "Not completed" : "Mark as complete"}
      <Icon className="h-4 w-4 ml-2" />
    </Button>
  );
};

// "use client";

// import { Button } from "@/components/ui/button";
// import { CheckCircle, XCircle } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import toast from "react-hot-toast";
// // import { toast } from "sonner";

// interface CourseProgressButtonProps {
//   tutorialId: string;
//   courseId: string;
//   isCompleted: boolean;
//   nextTutorialId: string;
// }

// export const CourseProgressButton = ({
//   tutorialId,
//   courseId,
//   isCompleted,
//   nextTutorialId,
// }: CourseProgressButtonProps) => {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);

//   const onClick = async () => {
//     try {
//       setIsLoading(true);
//       const response = await fetch(
//         `/api/courses/${courseId}/tutorials/${tutorialId}/progress`,
//         {
//           method: "POST",
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to update progress");
//       }

//       toast.success(
//         isCompleted
//           ? "Tutorial marked as not completed."
//           : "Tutorial marked as completed."
//       );

//       // Navigate to the next tutorial if available
//       if (!isCompleted && nextTutorialId) {
//         router.push(`/courses/${courseId}/tutorials/${nextTutorialId}`);
//       } else {
//         // Refresh the current page to update the UI
//         router.refresh();
//       }
//     } catch (error) {
//       toast.error("Something went wrong");
//       console.error("[CourseProgressButton]", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const Icon = isCompleted ? XCircle : CheckCircle;
//   return (
//     <Button
//       type="button"
//       variant={isCompleted ? "outline" : "success"}
//       onClick={onClick}
//       disabled={isLoading}
//     >
//       {isCompleted ? "Not completed" : "Mark as complete"}
//       <Icon className="h-4 w-4 ml-2" />
//     </Button>
//   );
// };