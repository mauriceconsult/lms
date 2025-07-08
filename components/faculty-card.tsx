import Link from "next/link";
import Image from "next/image";

interface FacultyCardProps {
  id: string;
  title: string;
  imageUrl?: string;
  description: string;
  school: string;
}

export const FacultyCard = ({ 
  id,
  title,
  imageUrl, 
  description,
  school,
}: FacultyCardProps) => {
  return (
    <Link href={`/faculties/${id}`}>
      <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <Image fill className="object-cover" alt="title" src={imageUrl || "/faculty.jpg"} />
        </div>
        <div className="flex flex-col pt-2">
          <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
            {title}
          </div>
          <p className="text-xs text-muted-foreground">{school}</p>
          <span className="text-slate-950 text-muted-foreground font-normal line-clamp-3">
            {description}
          </span>
        </div>
      </div>
    </Link>
  );
};
