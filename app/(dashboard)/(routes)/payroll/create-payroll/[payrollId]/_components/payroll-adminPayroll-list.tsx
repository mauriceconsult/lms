"use client";

import { cn } from "@/lib/utils";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { Badge, Grip, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, Button } from "@mui/material";
import { AdminPayroll } from "@prisma/client";
import toast from "react-hot-toast";

type Item = AdminPayroll & {
  payroll?: { id: string; amount: number } | null;
};

export default function AdminPayrollList({
  items: adminPayrolls,
  onReorderAction,
  onEditAction,
}: {
  items: Item[];
  onReorderAction: (
    updateData: { id: string; position: number }[]
  ) => Promise<{ success: boolean; message: string }>;
  onEditAction: (id: string) => Promise<{ success: boolean; message: string }>;
}) {
  const [items, setItems] = useState<Item[]>(adminPayrolls);
  const [isMounted, setIsMounted] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setItems(adminPayrolls);
  }, [adminPayrolls]);

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setItems(newItems);

    const bulkUpdateData = newItems.map((item, index) => ({
      id: item.id,
      position: index,
    }));

    const { success, message } = await onReorderAction(bulkUpdateData);
    if (success) {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="adminPayrolls">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {items.map((adminPayroll, index) => (
                <Draggable
                  key={adminPayroll.id}
                  draggableId={adminPayroll.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      className={cn(
                        "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
                        adminPayroll.isPaid &&
                          "bg-sky-100 border-sky-200 text-sky-700"
                      )}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <div
                        className={cn(
                          "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                          adminPayroll.isPaid &&
                            "border-r-sky-200 hover:bg-sky-200"
                        )}
                        {...provided.dragHandleProps}
                      >
                        <Grip className="h-5 w-5" />
                      </div>
                      {adminPayroll.title}
                      <div className="ml-auto pr-2 flex items-center gap-x-2">
                        <Badge
                          className={cn(
                            "bg-slate-500",
                            adminPayroll.isPaid && "bg-sky-700"
                          )}
                        >
                          {adminPayroll.isPaid ? "Published" : "Draft"}
                        </Badge>
                        <Pencil
                          onClick={async () => {
                            setSelectedItem(adminPayroll);
                            setOpenDialog(true);
                          }}
                          className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                        />
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Payroll Item Details</DialogTitle>
        <DialogContent>
          <p>Title: {selectedItem?.title || "N/A"}</p>
          <p>
            Amount:{" "}
            {selectedItem?.payroll ? selectedItem.payroll.amount : "N/A"}
          </p>
          <Button
            onClick={async () => {
              if (selectedItem) {
                const { success, message } = await onEditAction(
                  selectedItem.id
                );
                if (success) {
                  toast.success(message);
                } else {
                  toast.error(message);
                }
              }
            }}
          >
            Edit
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
