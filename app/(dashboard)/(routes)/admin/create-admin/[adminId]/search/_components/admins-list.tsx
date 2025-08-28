import { AdminCard } from "@/components/admin-card";
import {
  Admin
} from "@prisma/client";

type AdminsWithSchool = Admin & {
  admin: Admin | null;
  courses: { id: string }[];  
};
interface AdminsListProps {
  item: AdminsWithSchool[];
}

export const AdminsList = ({ item }: AdminsListProps) => {
  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {item.map((admin) => (
          <AdminCard
            key={admin.id}
            id={admin.id}
            title={admin.title}
            imageUrl={admin.imageUrl!}
            description={admin.description ?? ""}
            admin={admin.admin?.id ?? ""}
          />
        ))}
      </div>
      {item.length === 0 && <div>No Admins found.</div>}
    </div>
  );
};
