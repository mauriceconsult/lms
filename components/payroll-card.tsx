import Image from "next/image";
import Link from "next/link";
import { IconBadge } from "./icon-badge";
import { BookOpen } from "lucide-react";

interface PayrollCardProps {
  id: string;
  title: string;  
  facultyPayrollsLength: number; 
  school: string;
}

export const PayrollCard = ({
  id,
  title,
  facultyPayrollsLength,
  school,
}: PayrollCardProps) => {
  return (
    <Link href={`/payrolls/${id}`}>
      <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <Image
            fill
            className="object-cover"
            alt="title"
            src={"/instaskul_logo.svg"}
          />
        </div>
        <div className="flex flex-col pt-2">
          <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
            {title}
          </div>
          <p className="text-xs text-muted-foreground">{school}</p>
          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-slate-500">
              <IconBadge size={"sm"} icon={BookOpen} />
              <span>
                {facultyPayrollsLength}{" "}
                {facultyPayrollsLength === 1 ? "Payroll" : "Payrolls"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
