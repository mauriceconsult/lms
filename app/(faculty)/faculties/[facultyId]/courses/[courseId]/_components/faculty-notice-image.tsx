"use client";


interface FacultyNoticeImageProps {
  title: string;
  courseId: string;
  facultyId: string;
}
export const FacultyNoticeImage = ({
  title,
  courseId,
  facultyId,
}: FacultyNoticeImageProps) => {
  return (
    <div className="relative aspect-video">      
      <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 p-2 rounded">
        {title}
      </div>
      <div className="absolute top-4 right-4 text-white bg-black bg-opacity-50 p-2 rounded">
        Course ID: {courseId} | Faculty ID: {facultyId}
      </div>
    </div>
  );
};
export default FacultyNoticeImage;
