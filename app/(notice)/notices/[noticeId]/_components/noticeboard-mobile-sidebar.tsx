import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Course } from "@prisma/client";
import { Menu } from "lucide-react";
import NoticeboardSidebar from "./noticeboard-sidebar";
import { Noticeboard } from "@prisma/client";

interface NoticeboardNavbarProps {
    noticeBoard: Noticeboard & {
        courses: (Course)[];
    }
}
export const NoticeboardMobileSidebar = ({
    noticeBoard,
}: NoticeboardNavbarProps) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent side={"left"} className="p-0 bg-white w-72">
        <NoticeboardSidebar noticeBoard={noticeBoard} />
      </SheetContent>
    </Sheet>
  );
};
