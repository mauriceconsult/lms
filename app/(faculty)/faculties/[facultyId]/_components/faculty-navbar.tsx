import { NavbarRoutes } from "@/components/navbar-routes";
import { Course, Faculty } from "@prisma/client"

interface FacultyNavbarProps {
    faculty: Faculty & {
        courses: (Course)[];
    }
}

export const FacultyNavbar = ({
    // faculty,
}: FacultyNavbarProps) => {
    return (
        <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
            <NavbarRoutes/>
        </div>
    )
}