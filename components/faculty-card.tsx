import Image from "next/image";
import Link from "next/link";

interface FacultyCardProps {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  facultyTitle: string;
}

export const FacultyCard = ({
  id,
  title,
  imageUrl,
  description,
  facultyTitle,
}: FacultyCardProps) => {
  // Function to strip HTML tags
  const stripHtml = (html: string) => {
    return html
      .replace(/<[^>]*>/g, "") // Remove all tags
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&nbsp;/g, " ")
      .trim();
  };

  return (
    <Link href={`/courses/${id}`}>
      <div className="bg-white shadow-sm rounded-lg p-4 hover:bg-gray-100 transition">
        {imageUrl && (
          <div className="relative h-32 w-full mb-4">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover rounded-md"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        )}
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">
          {stripHtml(description)}
        </p>
        <p className="text-sm text-gray-500 mt-2">Faculty: {facultyTitle}</p>
      </div>
    </Link>
  );
};
