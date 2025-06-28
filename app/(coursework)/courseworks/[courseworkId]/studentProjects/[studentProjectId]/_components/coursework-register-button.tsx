"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseworkRegisterButtonProps {
    courseworkId: string;
    userId: string;
}

export const CourseworkRegisterButton = ({
    courseworkId,    
}: CourseworkRegisterButtonProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const onClick = async () => {
        try {
            setIsLoading(true);
            const response = await axios.post(`/api/courseworks/${courseworkId}/submit`)
            window.location.assign(response.data.url);
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }
    return (
      <Button onClick={onClick} disabled={isLoading} size={"sm"} className="w-full md:w-auto">
        Register your Project
      </Button>
    );
}