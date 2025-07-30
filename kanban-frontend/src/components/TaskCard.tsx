import React, { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import type { Task } from "../types/types";
import EditTaskModal from "./EditTaskModal";
import { useQuery } from "@apollo/client";
import { GET_TASKS } from "../graphql/queries";

interface TaskCardProps {
  task: Task;
  onTaskDrop?: (id: string, newColumn: Task["column"]) => void;
}

export default function TaskCard({ task, onTaskDrop }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDragDisabled, setIsDragDisabled] = useState(false);
  const { refetch } = useQuery(GET_TASKS);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    disabled: isDragDisabled, // Disable drag when hovering over edit button
  });

  const style = {
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 9999 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "committed": return { bg: '#dcfce7', text: '#166534', border: '#bbf7d0' };
      case "done": return { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' };
      case "reassigned": return { bg: '#fef3c7', text: '#d97706', border: '#fcd34d' };
      case "pending": return { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' };
      default: return { bg: '#f3f4f6', text: '#374151', border: '#d1d5db' };
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "#8b5cf6", "#3b82f6", "#10b981", 
      "#ef4444", "#f59e0b", "#6366f1", 
      "#ec4899", "#14b8a6"
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  // Handle edit button click with multiple event preventions
  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
  };

  // Handle mouse events for edit button area
  const handleEditMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle touch events for edit button area
  const handleEditTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleEditMouseEnter = () => {
    setIsDragDisabled(true);
  };

  const handleEditMouseLeave = () => {
    setIsDragDisabled(false);
  };

  const statusColors = getStatusColor(task.status);

  return (
    <>
      <div
        ref={setNodeRef}
        style={{
          ...style,
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '16px',
          boxShadow: isDragging ? '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          border: '1px solid #e5e7eb',
          marginBottom: '12px',
          transition: 'all 0.2s ease',
        }}
        {...(isDragDisabled ? {} : listeners)}
        {...(isDragDisabled ? {} : attributes)}
      >
        {/* Task Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <h4 style={{ 
            fontWeight: '500', 
            fontSize: '14px', 
            color: '#111827', 
            lineHeight: '1.4', 
            paddingRight: '8px', 
            flex: 1,
            margin: 0
          }}>
            {task.title}
          </h4>
          
          {/* Edit Button with No-Drag Zone */}
          <div
            onMouseEnter={handleEditMouseEnter}
            onMouseLeave={handleEditMouseLeave}
            style={{ 
              padding: '4px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            <button
              onClick={handleEditClick}
              onMouseDown={handleEditMouseDown}
              onPointerDown={handleEditMouseDown}
              onTouchStart={handleEditTouchStart}
              style={{
                color: '#9ca3af',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                fontSize: '16px',
                lineHeight: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '24px',
                minHeight: '24px'
              }}
              title="Edit task"
            >
              ⋯
            </button>
          </div>
        </div>

        {/* Task Description */}
        <p style={{ 
          fontSize: '12px', 
          color: '#6b7280', 
          marginBottom: '16px', 
          lineHeight: '1.5',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          margin: '0 0 16px 0'
        }}>
          {task.detail}
        </p>

        {/* Task Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Status Badge */}
          <span style={{
            padding: '4px 8px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: '500',
            border: `1px solid ${statusColors.border}`,
            backgroundColor: statusColors.bg,
            color: statusColors.text
          }}>
            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </span>

          {/* Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '12px',
                fontWeight: '500',
                backgroundColor: getAvatarColor(task.assignedTo)
              }}
              title={`Assigned to: ${task.assignedTo}`}
            >
              {getInitials(task.assignedTo)}
            </div>
          </div>
        </div>

        {/* Task ID (small, subtle) */}
        <div style={{ 
          marginTop: '8px', 
          paddingTop: '8px', 
          borderTop: '1px solid #f3f4f6'
        }}>
          <span style={{ fontSize: '10px', color: '#9ca3af' }}>
            ID: {task.id.slice(-8)}
          </span>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <EditTaskModal
          task={task}
          onClose={() => setIsEditing(false)}
          refetch={refetch}
        />
      )}
    </>
  );
}