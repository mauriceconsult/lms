// CourseMobileSidebar.tsx
"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CourseSidebar } from "./course-sidebar";

interface CourseMobileSidebarProps {
  courseId: string;
  facultyId: string;
  tutors: { id: string; title: string }[];
  activeTutorId: string | null;
}

export function CourseMobileSidebar({
  courseId,
  facultyId,
  tutors,
  activeTutorId,
}: CourseMobileSidebarProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-56">
        <CourseSidebar
          courseId={courseId}
          facultyId={facultyId}
          tutors={tutors}
          activeTutorId={activeTutorId}
        />
      </SheetContent>
    </Sheet>
  );
}
