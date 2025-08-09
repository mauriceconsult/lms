"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// Define Student interface based on your schema or API response
interface Student {
  id: string;
  name: string; // Adjust fields based on your data (e.g., email, courseworkId, etc.)
  // Add other fields as needed, e.g., email: string; courseworkId: string;
}

export default function StudentsPage() {
  const params = useParams();
  const { facultyId } = params;
  const [students, setStudents] = useState<Student[]>([]); // Use the Student type
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(
          `/api/faculties/${facultyId}/courseworks/students`,
          {
            cache: "no-store", // Prevent caching for real-time data
          }
        );
        if (!res.ok) throw new Error("Failed to fetch students");
        const data = await res.json();
        setStudents(data); // Assumes API returns an array of Student objects
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [facultyId]);

  if (loading) return <p>Loading students...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4">
      <h1>Students for Faculty {facultyId}</h1>
      {students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <ul>
          {students.map((student, index) => (
            <li key={student.id}>{student.name || `Student ${index + 1}`}</li> // Use id as key
          ))}
        </ul>
      )}
      <a
        href={`/faculties/${facultyId}/courseworks`}
        className="text-blue-500 underline"
      >
        Back to Courseworks
      </a>
    </div>
  );
}
