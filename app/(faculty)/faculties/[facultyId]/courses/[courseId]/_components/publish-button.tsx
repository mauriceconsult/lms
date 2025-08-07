"use client";

import { Button } from "@/components/ui/button";

interface PublishButtonProps {
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export function PublishButton({
  disabled,
  onClick,
  children,
}: PublishButtonProps) {
  return (
    <Button onClick={onClick} disabled={disabled} variant="default">
      {children}
    </Button>
  );
}
