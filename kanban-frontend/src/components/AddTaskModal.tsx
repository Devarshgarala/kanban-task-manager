import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { ADD_TASK } from "../graphql/mutations";

interface AddTaskModalProps {
  onClose: () => void;
  refetch: () => void;
}

export default function AddTaskModal({ onClose, refetch }: AddTaskModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    detail: "",
    assignedTo: "",
    status: "pending" as "pending" | "committed" | "done" | "reassigned",
    column: "todo" as "todo" | "doing" | "done",
  });

  const [addTask, { loading }] = useMutation(ADD_TASK);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Handle form submission
  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      setErrorMessage("Title is required");
      return;
    }

    if (!formData.assignedTo.trim()) {
      setErrorMessage("Assigned to field is required");
      return;
    }

    try {
      setErrorMessage("");
      await addTask({
        variables: {
          title: formData.title.trim(),
          detail: formData.detail.trim(),
          assignedTo: formData.assignedTo.trim(),
          status: formData.status,
          column: formData.column,
        },
      });
      
      refetch();
      setSuccessMessage("✅ Task created successfully!");

      // Auto-close after 1.5s
      setTimeout(() => {
        setSuccessMessage("");
        onClose();
      }, 1500);
    } catch (error: any) {
      console.error("Failed to create task:", error);
      setErrorMessage(error.message || "Failed to create task");
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

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px'
      }}
      onClick={handleBackdropClick}
    >
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          width: '100%',
          maxWidth: '28rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>Add New Task</h2>
          <button
            onClick={onClose}
            style={{
              color: '#9ca3af',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            ×
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div style={{
            marginBottom: '16px',
            padding: '12px',
            backgroundColor: '#dcfce7',
            border: '1px solid #bbf7d0',
            color: '#166534',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div style={{
            marginBottom: '16px',
            padding: '12px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            borderRadius: '8px',
            fontSize: '14px'
          }}>
            {errorMessage}
          </div>
        )}

        {/* Form Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Title */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              Task Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter task title"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
              maxLength={100}
              required
            />
          </div>

          {/* Detail */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              Description
            </label>
            <textarea
              value={formData.detail}
              onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
              placeholder="Describe the task details..."
              rows={4}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                resize: 'none'
              }}
              maxLength={500}
            />
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
              {formData.detail.length}/500 characters
            </div>
          </div>

          {/* Assigned To */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              Assigned To *
            </label>
            <input
              type="text"
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              placeholder="Enter assignee name"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
              maxLength={50}
              required
            />
          </div>

          {/* Column */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              Column
            </label>
            <select
              value={formData.column}
              onChange={(e) => setFormData({ ...formData, column: e.target.value as "todo" | "doing" | "done" })}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
            >
              <option value="todo">To Do</option>
              <option value="doing">Doing</option>
              <option value="done">Done</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as "pending" | "committed" | "done" | "reassigned" })}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
            >
              <option value="pending">Pending</option>
              <option value="committed">Committed</option>
              <option value="done">Done</option>
              <option value="reassigned">Reassigned</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '24px', marginTop: '24px', borderTop: '1px solid #e5e7eb' }}>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            style={{
              padding: '8px 16px',
              color: '#374151',
              backgroundColor: '#e5e7eb',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !formData.title.trim() || !formData.assignedTo.trim()}
            style={{
              padding: '8px 24px',
              backgroundColor: loading || !formData.title.trim() || !formData.assignedTo.trim() ? '#9ca3af' : '#2563eb',
              color: 'white',
              borderRadius: '8px',
              border: 'none',
              cursor: loading || !formData.title.trim() || !formData.assignedTo.trim() ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {loading && (
              <div style={{ 
                width: '16px', 
                height: '16px', 
                border: '2px solid #ffffff', 
                borderTop: '2px solid transparent', 
                borderRadius: '50%', 
                animation: 'spin 1s linear infinite' 
              }}></div>
            )}
            <span>{loading ? "Creating..." : "Create Task"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}