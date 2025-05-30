interface CourseCardProps {
  id: string;
  title: string;
  imageUrl: string;
  topicsLength: number;
  amount: number;
  progress: number | null;
  faculty: string;
}

export const CourseCard = ({
  // id,
  // title,
  // imageUrl,
  // topicsLength,
  // amount,
  // progress,
  // faculty,
}: CourseCardProps) => {
  return <div>Course Card</div>;
};
