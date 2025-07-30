import React from "react";
import { useDroppable } from "@dnd-kit/core";
import type { Task } from "../types/types";
import TaskCard from "./TaskCard";

interface ColumnProps {
  column: Task["column"];
  tasks: Task[];
  onTaskDrop: (id: string, newColumn: Task["column"]) => void;
}

export default function Column({ column, tasks, onTaskDrop }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column,
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[500px] p-4 transition-colors ${
        isOver ? "bg-blue-50" : "bg-gray-50"
      }`}
    >
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">📋</div>
            <p className="text-sm">No tasks in this column</p>
            {column === "todo" && (
              <p className="text-xs mt-1">Add a new task to get started</p>
            )}
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} onTaskDrop={onTaskDrop} />
          ))
        )}
      </div>
    </div>
  );
}