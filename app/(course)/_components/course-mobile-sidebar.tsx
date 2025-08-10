"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CourseSidebar } from "./course-sidebar";

interface CourseMobileSidebarProps { 
  courseId: string;
}

export function CourseMobileSidebar({
  courseId,
}: CourseMobileSidebarProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-56">
        <CourseSidebar courseId={courseId} />
      </SheetContent>
    </Sheet>
  );
}
