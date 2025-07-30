import React, { useState } from "react";
import Column from "./Column";
import AddTaskModal from "./AddTaskModal";
import type { Task } from "../types/types";
import type { DragEndEvent } from "@dnd-kit/core";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { useQuery, useMutation } from "@apollo/client";
import { GET_TASKS } from "../graphql/queries";
import { UPDATE_TASK } from "../graphql/mutations";
import TaskCard from "./TaskCard";

const columns = ["todo", "doing", "done"] as const;

export default function TaskBoard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  
  const { data, loading, error, refetch } = useQuery(GET_TASKS);
  const [updateTask] = useMutation(UPDATE_TASK);

  const tasks: Task[] = data?.tasks || [];

  // Function to get new status based on column movement
  const getStatusForColumn = (column: Task["column"]): Task["status"] => {
    switch (column) {
      case "todo": return "pending";
      case "doing": return "committed";
      case "done": return "done";
      default: return "pending";
    }
  };

  // Function to get reassigned status when moving backwards
  const getReassignedStatus = (fromColumn: Task["column"], toColumn: Task["column"]): Task["status"] => {
    // If moving from done to doing, or doing to todo, mark as reassigned
    if ((fromColumn === "done" && toColumn === "doing") || 
        (fromColumn === "doing" && toColumn === "todo") ||
        (fromColumn === "done" && toColumn === "todo")) {
      return "reassigned";
    }
    return getStatusForColumn(toColumn);
  };

  // Update task with both column and status in backend
  const handleTaskUpdate = async (id: string, newColumn: Task["column"]) => {
    try {
      const currentTask = tasks.find(t => t.id === id);
      if (!currentTask) return;

      // Determine new status based on column movement
      let newStatus: Task["status"];
      if (currentTask.column !== newColumn) {
        newStatus = getReassignedStatus(currentTask.column, newColumn);
      } else {
        newStatus = currentTask.status;
      }

      await updateTask({
        variables: { 
          id, 
          column: newColumn,
          status: newStatus
        },
      });
      refetch(); // Refresh UI
    } catch (error) {
      console.error("Failed to update task:", error);
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

  // Enhanced search function
  const filteredTasks = (col: Task["column"]) => {
    return tasks.filter((task) => {
      // First filter by column
      if (task.column !== col) return false;
      
      // If no search query, return all tasks in this column
      if (!searchQuery.trim()) return true;
      
      const query = searchQuery.toLowerCase().trim();
      
      // Search in multiple fields
      return (
        task.title.toLowerCase().includes(query) ||
        task.detail.toLowerCase().includes(query) ||
        task.assignedTo.toLowerCase().includes(query) ||
        task.status.toLowerCase().includes(query) ||
        task.id.toLowerCase().includes(query)
      );
    });
  };

  const getColumnTitle = (col: string) => {
    switch (col) {
      case "todo": return "To Do";
      case "doing": return "Doing";
      case "done": return "Done";
      default: return col;
    }
  };

  // Clear search function
  const clearSearch = () => {
    setSearchQuery("");
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
           Task Manager
          </h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search tasks by title, description, assignee, status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  paddingLeft: '40px',
                  paddingRight: searchQuery ? '40px' : '16px',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  outline: 'none',
                  width: '320px',
                  fontSize: '14px'
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
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    padding: '2px'
                  }}
                  title="Clear search"
                >
                  ✕
                </button>
              )}
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

          {/* Search Results Info */}
          {searchQuery && (
            <div style={{ marginTop: '12px', fontSize: '14px', color: '#6b7280' }}>
              Searching for: "<strong>{searchQuery}</strong>" - 
              Found {tasks.filter(task => {
                const query = searchQuery.toLowerCase().trim();
                return task.title.toLowerCase().includes(query) ||
                       task.detail.toLowerCase().includes(query) ||
                       task.assignedTo.toLowerCase().includes(query) ||
                       task.status.toLowerCase().includes(query) ||
                       task.id.toLowerCase().includes(query);
              }).length} results
            </div>
          )}
        </div>

        {/* Kanban Board - HORIZONTAL LAYOUT */}
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '16px' }}>
            {columns.map((col) => {
              const columnTasks = filteredTasks(col);
              return (
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
                        {columnTasks.length}
                      </span>
                    </div>
                  </div>

                  {/* Column Content */}
                  <Column
                    column={col}
                    tasks={columnTasks}
                    onTaskDrop={handleTaskUpdate}
                  />
                </div>
              );
            })}
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