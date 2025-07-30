import React, { useState } from "react";
import Column from "./Column";
import AddTaskModal from "./AddTaskModal";
import type { Task } from "../types/types";
import type { DragEndEvent } from "@dnd-kit/core";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { useQuery, useMutation } from "@apollo/client";
import { GET_TASKS } from "../graphql/queries";
import { UPDATE_TASK_COLUMN } from "../graphql/mutations";
import TaskCard from "./TaskCard";

const columns = ["todo", "doing", "done"] as const;

export default function TaskBoard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Fetch tasks from backend
  const { data, loading, error, refetch } = useQuery(GET_TASKS);
  const [updateTaskColumn] = useMutation(UPDATE_TASK_COLUMN);

  const tasks: Task[] = data?.tasks || [];

  // Update column in backend when task is moved
  const handleTaskUpdate = async (id: string, newColumn: Task["column"]) => {
    try {
      await updateTaskColumn({
        variables: { id, column: newColumn },
      });
      refetch(); // Refresh UI
    } catch (error) {
      console.error("Failed to update task column:", error);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (event: any) => {
    const task = tasks.find(t => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    setActiveTask(null);
    
    if (!over || over.id === active.id) return;

    const taskId = active.id as string;
    const newColumn = over.id as Task["column"];
    handleTaskUpdate(taskId, newColumn);
  };

  // Search + filter tasks per column
  const filteredTasks = (col: Task["column"]) =>
    tasks.filter(
      (task) =>
        task.column === col &&
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const getColumnTitle = (col: string) => {
    switch (col) {
      case "todo": return "To Do";
      case "doing": return "Doing";
      case "done": return "Done";
      default: return col;
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ fontSize: '18px', color: '#6b7280' }}>Loading tasks...</div>
    </div>
  );
  
  if (error) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ fontSize: '18px', color: '#dc2626' }}>Error: {error.message}</div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px' }}>
            Kanban Task Manager
          </h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  paddingLeft: '40px',
                  paddingRight: '16px',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  outline: 'none',
                  width: '256px'
                }}
              />
              <div style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }}>
                🔍
              </div>
            </div>
            
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px'
              }}
            >
              <span>+</span>
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {/* Kanban Board - HORIZONTAL LAYOUT */}
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '16px' }}>
            {columns.map((col) => (
              <div 
                key={col} 
                style={{
                  flexShrink: 0,
                  width: '320px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}
              >
                {/* Column Header */}
                <div 
                  style={{
                    backgroundColor: 'white',
                    borderTop: `4px solid ${col === 'todo' ? '#9ca3af' : col === 'doing' ? '#f59e0b' : '#10b981'}`,
                    padding: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h3 style={{ fontWeight: '600', color: '#1f2937' }}>
                      {getColumnTitle(col)}
                    </h3>
                    <span 
                      style={{
                        backgroundColor: '#e5e7eb',
                        color: '#374151',
                        padding: '4px 8px',
                        borderRadius: '9999px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      {filteredTasks(col).length}
                    </span>
                  </div>
                </div>

                {/* Column Content */}
                <Column
                  column={col}
                  tasks={filteredTasks(col)}
                  onTaskDrop={handleTaskUpdate}
                />
              </div>
            ))}
          </div>

          {/* Drag Overlay - Shows task being dragged */}
          <DragOverlay style={{ zIndex: 9999 }}>
            {activeTask ? (
              <div style={{ 
                opacity: 0.8,
                transform: 'rotate(5deg)',
                cursor: 'grabbing'
              }}>
                <TaskCard task={activeTask} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <AddTaskModal
          onClose={() => setShowAddModal(false)}
          refetch={refetch}
        />
      )}

      {/* Add spinning animation for loading states */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}