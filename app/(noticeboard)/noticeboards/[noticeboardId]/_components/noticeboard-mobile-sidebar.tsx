import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import NoticeboardSidebar from "./noticeboard-sidebar";
import { Noticeboard } from "@prisma/client";

interface NoticeboardNavbarProps {
    noticeboard: Noticeboard[];
    }
export const NoticeboardMobileSidebar = ({
    noticeboard,
}: NoticeboardNavbarProps) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent side={"left"} className="p-0 bg-white w-72">
        <NoticeboardSidebar noticeboard={noticeboard} />
      </SheetContent>
    </Sheet>
  );
};
