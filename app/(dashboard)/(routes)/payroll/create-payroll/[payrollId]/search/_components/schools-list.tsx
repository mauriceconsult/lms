import { PayrollCard } from "@/components/payroll-card";
import {
  Payroll,
  School
} from "@prisma/client";

type PayrollsWithSchool = Payroll & {
  school: School | null;
  payrolls: { id: string }[];  
};
interface SchoolsListProps {
  item: PayrollsWithSchool[];
}

export const SchoolsList = ({ item }: SchoolsListProps) => {
  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {item.map((faculty) => (
          <PayrollCard
            key={faculty.id}
            id={faculty.id}
            title={faculty.title}
            school={faculty.school?.name ?? ""}
            facultyPayrollsLength={0}
          />
        ))}
      </div>
      {item.length === 0 && <div>No Schools found.</div>}
    </div>
  );
};
