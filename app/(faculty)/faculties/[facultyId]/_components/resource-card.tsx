import Image from "next/image";
import Link from "next/link";

interface ResourceCardProps {
  id: string;
  title: string | null;
  type: "course" | "courseNoticeboard" | "coursework" | "tutor" | "noticeboard";
  createdAt: Date;
  imageUrl?: string;
  description?: string | null | undefined;
  role: "admin" | "student";
  facultyId: string;
  courseId?: string;
}

export const ResourceCard = ({
  id,
  title,
  type,
  createdAt,
  imageUrl,
  description,
  role,
  facultyId,
  courseId,
}: ResourceCardProps) => {
  const stripHtml = (html: string) => {
    return html
      .replace(/<[^>]*>/g, "")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&nbsp;/g, " ")
      .trim();
  };

  const getHref = () => {
    const basePath = `/faculties/${facultyId}`;
    switch (type) {
      case "course":
        return `${basePath}/courses/${id}?role=${role}`;
      case "coursework":
        return `${basePath}/courseworks/${id}?role=${role}`;
      case "tutor":
        return `${basePath}/courses/${courseId}/tutors/${id}?role=${role}`;
      case "courseNoticeboard":
        return `${basePath}/courses/${courseId}/noticeboards/${id}?role=${role}`;
      case "noticeboard":
        return `${basePath}/courses/${courseId}/noticeboards/${id}?role=${role}`;
    }
  };

  return (
    <Link href={getHref()}>
      <div className="bg-white shadow-sm rounded-lg p-4 hover:bg-gray-100 transition">
        {imageUrl && (
          <div className="relative h-32 w-full mb-4">
            <Image
              src={imageUrl}
              alt={title || `Untitled ${type}`}
              fill
              className="object-cover rounded-md"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        )}
        <h3 className="text-lg font-medium text-gray-900">
          {title || `Untitled ${type}`}
        </h3>
        {description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {stripHtml(description)}
          </p>
        )}
        <p className="text-sm text-gray-500 mt-2">
          Created: {new Date(createdAt).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-600 capitalize">Type: {type}</p>
      </div>
    </Link>
  );
};
