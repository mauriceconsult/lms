'use client';

import * as z from 'zod';
import axios, { type AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Pencil, PlusCircle, Video } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { MuxData } from '@prisma/client';
import MuxPlayer from '@mux/mux-player-react';
import { FileUpload } from '@/components/file-upload';

interface TutorVideoFormProps {
  initialData: {
    videoUrl: string | null;
    muxData: MuxData | null;
  };
  facultyId: string;
  courseId: string;
  tutorId: string;
}

const formSchema = z.object({
  videoUrl: z.string().min(1, {
    message: 'Video URL is required',
  }),
});

type FormValues = z.infer<typeof formSchema>;

export const TutorVideoForm = ({
  initialData,
  facultyId,
  courseId,
  tutorId,
}: TutorVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videoUrl: initialData.videoUrl || '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await axios.patch(
        `/api/create-faculties/${facultyId}/courses/${courseId}/tutors/${tutorId}`,
        values
      );
      toast.success('Topic video updated.');
      toggleEdit();
      router.refresh();
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      toast.error(axiosError.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Topic video*
        <Button onClick={toggleEdit} variant="ghost" disabled={form.formState.isSubmitting}>
          {isEditing ? (
            <>Cancel</>
          ) : !initialData.videoUrl ? (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a video
            </>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit video
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <MuxPlayer playbackId={initialData.muxData?.playbackId || ''} />
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Upload this Topic&apos;s video
          </div>
        </div>
      )}
      {initialData.videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Video can take a while to process. Refresh the page if necessary.
        </div>
      )}
    </div>
  );
};
