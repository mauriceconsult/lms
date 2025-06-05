import { NoticeboardCard } from "@/components/noticeboard-card copy";
import { Faculty, Noticeboard } from "@prisma/client";

type NoticesWithFaculty = Noticeboard & {
  faculty: Faculty | null;
  courses: { id: string }[];
 
};
interface NoticesListProps {
  items: NoticesWithFaculty[];
}
export const NoticesList = ({ items }: NoticesListProps) => {
  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <NoticeboardCard
            key={item.id}
            id={item.id}
            title={item.title}
            imageUrl={item.imageUrl ?? ""}                  
            faculty={item?.faculty?.title ?? ""}
          />
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          No Notices found.
        </div>
      )}
    </div>
  );
};
