"use client";

import { useState } from "react";

type Item = { id: string; title: string };

export default function ReorderableList({
  items: facultyPayrolls,
}: {
  items: Item[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
}) {
  const [items, setItems] = useState(facultyPayrolls);

  const onReorder = async (newItems: Item[]) => {
    setItems(newItems);
    // Example: Send new order to server
    await fetch("/api/save-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: newItems }),
    });
  };

  return (
    <div>
      {items.map((item) => (
        <div key={item.id}>{item.title}</div>
      ))}
      <button onClick={() => onReorder([...items].reverse())}>Reorder</button>
    </div>
  );
}
