import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_TASK } from "../graphql/mutations";
import type { Task } from "../types/types";
import DeleteTaskModal from "./DeleteTaskModal";

interface EditTaskModalProps {
  task: Task;
  onClose: () => void;
  refetch: () => void;
}

export default function EditTaskModal({ task, onClose, refetch }: EditTaskModalProps) {
  const [formData, setFormData] = useState<{
    title: string;
    detail: string;
    assignedTo: string;
    status: "pending" | "committed" | "done" | "reassigned";
    column: "todo" | "doing" | "done";
  }>({
    title: task.title,
    detail: task.detail,
    assignedTo: task.assignedTo,
    status: task.status as "pending" | "committed" | "done" | "reassigned",
    column: task.column,
  });

  const [updateTask, { loading }] = useMutation(UPDATE_TASK);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Handle form submission
  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      setErrorMessage("Title is required");
      return;
    }

    try {
      setErrorMessage("");
      await updateTask({
        variables: {
          id: task.id,
          title: formData.title.trim(),
          detail: formData.detail.trim(),
          assignedTo: formData.assignedTo.trim(),
          status: formData.status,
          column: formData.column,
        },
      });
      
      refetch();
      setSuccessMessage("✅ Task updated successfully!");

      // Auto-close after 1.5s
      setTimeout(() => {
        setSuccessMessage("");
        onClose();
      }, 1500);
    } catch (error: any) {
      console.error("Failed to update task:", error);
      setErrorMessage(error.message || "Failed to update task");
    }
  };

  // Handle click outside modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const backdropStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
    padding: '16px'
  };

  const modalStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    width: '100%',
    maxWidth: '448px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    transform: 'scale(1)',
    transition: 'all 0.2s ease-in-out'
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: 0
  };

  const closeButtonStyle: React.CSSProperties = {
    color: '#9ca3af',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    transition: 'color 0.2s ease',
    fontSize: '0'
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    transition: 'all 0.2s ease',
    outline: 'none'
  };

  const inputFocusStyle: React.CSSProperties = {
    ...inputStyle,
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '8px'
  };

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    minHeight: '80px',
    resize: 'none' as const,
    fontFamily: 'inherit'
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    cursor: 'pointer'
  };

  const buttonStyle: React.CSSProperties = {
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const primaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '10px 20px'
  };

  const secondaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#f3f4f6',
    color: '#374151'
  };

  const dangerButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    border: '1px solid #fecaca'
  };

  const messageStyle: React.CSSProperties = {
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '16px'
  };

  const successMessageStyle: React.CSSProperties = {
    ...messageStyle,
    backgroundColor: '#f0fdf4',
    color: '#166534',
    border: '1px solid #bbf7d0',
    fontWeight: '500'
  };

  const errorMessageStyle: React.CSSProperties = {
    ...messageStyle,
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    border: '1px solid #fecaca'
  };

  return (
    <>
      <div style={backdropStyle} onClick={handleBackdropClick}>
        <div style={modalStyle}>
          {/* Modal Header */}
          <div style={headerStyle}>
            <h2 style={titleStyle}>Edit Task</h2>
            <button
              onClick={onClose}
              style={closeButtonStyle}
              onMouseEnter={(e) => e.currentTarget.style.color = '#6b7280'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div style={successMessageStyle}>
              {successMessage}
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div style={errorMessageStyle}>
              {errorMessage}
            </div>
          )}

          {/* Form Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Title */}
            <div>
              <label style={labelStyle}>
                Task Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter task title"
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                maxLength={100}
                required
              />
            </div>

            {/* Detail */}
            <div>
              <label style={labelStyle}>
                Description
              </label>
              <textarea
                value={formData.detail}
                onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
                placeholder="Describe the task details..."
                rows={4}
                style={textareaStyle}
                onFocus={(e) => Object.assign(e.target.style, { ...textareaStyle, borderColor: '#3b82f6', boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)' })}
                onBlur={(e) => Object.assign(e.target.style, textareaStyle)}
                maxLength={500}
              />
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                {formData.detail.length}/500 characters
              </div>
            </div>

            {/* Assigned To */}
            <div>
              <label style={labelStyle}>
                Assigned To
              </label>
              <input
                type="text"
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                placeholder="Enter assignee name"
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                maxLength={50}
              />
            </div>

            {/* Column */}
            <div>
              <label style={labelStyle}>
                Column
              </label>
              <select
                value={formData.column}
                onChange={(e) => setFormData({ ...formData, column: e.target.value as "todo" | "doing" | "done" })}
                style={selectStyle}
                onFocus={(e) => Object.assign(e.target.style, { ...selectStyle, borderColor: '#3b82f6', boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)' })}
                onBlur={(e) => Object.assign(e.target.style, selectStyle)}
              >
                <option value="todo">To Do</option>
                <option value="doing">Doing</option>
                <option value="done">Done</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label style={labelStyle}>
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as "pending" | "committed" | "done" | "reassigned" })}
                style={selectStyle}
                onFocus={(e) => Object.assign(e.target.style, { ...selectStyle, borderColor: '#3b82f6', boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)' })}
                onBlur={(e) => Object.assign(e.target.style, selectStyle)}
              >
                <option value="pending">Pending</option>
                <option value="committed">Committed</option>
                <option value="done">Done</option>
                <option value="reassigned">Reassigned</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            paddingTop: '24px', 
            marginTop: '24px', 
            borderTop: '1px solid #e5e7eb' 
          }}>
            {/* Delete Button */}
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              disabled={loading}
              style={{
                ...dangerButtonStyle,
                opacity: loading ? 0.5 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#fecaca')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#fef2f2')}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Delete</span>
            </button>

            {/* Save/Cancel Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                style={{
                  ...secondaryButtonStyle,
                  opacity: loading ? 0.5 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
                onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#e5e7eb')}
                onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#f3f4f6')}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !formData.title.trim()}
                style={{
                  ...primaryButtonStyle,
                  opacity: (loading || !formData.title.trim()) ? 0.5 : 1,
                  cursor: (loading || !formData.title.trim()) ? 'not-allowed' : 'pointer'
                }}
                onMouseEnter={(e) => !(loading || !formData.title.trim()) && (e.currentTarget.style.backgroundColor = '#2563eb')}
                onMouseLeave={(e) => !(loading || !formData.title.trim()) && (e.currentTarget.style.backgroundColor = '#3b82f6')}
              >
                {loading && (
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite' }}>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }}></circle>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" style={{ opacity: 0.75 }}></path>
                  </svg>
                )}
                <span>{loading ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteTaskModal
          task={task}
          onClose={() => {
            setShowDeleteModal(false);
            // Close the edit modal as well when delete modal closes
          }}
          refetch={() => {
            refetch();
            onClose(); // Close edit modal after successful delete
          }}
        />
      )}

      {/* Add spinning animation keyframes */}
      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </>
  );
}