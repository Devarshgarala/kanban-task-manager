import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { DELETE_TASK } from "../graphql/mutations";
import type { Task } from "../types/types";

interface DeleteTaskModalProps {
  task: Task;
  onClose: () => void;
  refetch: () => void;
}

export default function DeleteTaskModal({ task, onClose, refetch }: DeleteTaskModalProps) {
  const [deleteTask, { loading }] = useMutation(DELETE_TASK);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleDelete = async () => {
    try {
      setErrorMessage("");
      await deleteTask({
        variables: { id: task.id },
      });
      
      refetch();
      setSuccessMessage("✅ Task deleted successfully!");

      // Auto-close after 1s
      setTimeout(() => {
        setSuccessMessage("");
        onClose();
      }, 1000);
    } catch (error: any) {
      console.error("Failed to delete task:", error);
      setErrorMessage(error.message || "Failed to delete task");
    }
  };


  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };


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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 60, 
    padding: '16px'
  };

  const modalStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    width: '100%',
    maxWidth: '448px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
    transform: 'scale(1)',
    transition: 'all 0.2s ease-in-out',
    position: 'relative'
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
    color: '#dc2626',
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

  const warningSectionStyle: React.CSSProperties = {
    marginBottom: '24px'
  };

  const warningHeaderStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px'
  };

  const warningIconContainerStyle: React.CSSProperties = {
    width: '48px',
    height: '48px',
    backgroundColor: '#fef2f2',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '16px'
  };

  const warningTextStyle: React.CSSProperties = {
    flex: 1
  };

  const warningTitleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    margin: '0 0 4px 0'
  };

  const warningSubtitleStyle: React.CSSProperties = {
    color: '#6b7280',
    fontSize: '14px',
    margin: 0
  };

  const taskDetailsStyle: React.CSSProperties = {
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    padding: '16px',
    border: '1px solid #e5e7eb'
  };

  const taskDetailsHeaderStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '8px'
  };

  const taskDetailItemStyle: React.CSSProperties = {
    display: 'flex',
    marginBottom: '8px'
  };

  const labelStyle: React.CSSProperties = {
    fontWeight: '600',
    color: '#1f2937',
    minWidth: '100px'
  };

  const valueStyle: React.CSSProperties = {
    color: '#374151',
    marginLeft: '8px',
    textTransform: 'capitalize' as const
  };

  const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px'
  };

  const buttonStyle: React.CSSProperties = {
    padding: '10px 20px',
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

  const cancelButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#f3f4f6',
    color: '#374151'
  };

  const deleteButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#dc2626',
    color: 'white'
  };

  return (
    <>
      <div style={backdropStyle} onClick={handleBackdropClick}>
        <div style={modalStyle}>
          {/* Modal Header */}
          <div style={headerStyle}>
            <h2 style={titleStyle}>Delete Task</h2>
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

          {/* Warning Content */}
          <div style={warningSectionStyle}>
            <div style={warningHeaderStyle}>
              <div style={warningIconContainerStyle}>
                <svg width="24" height="24" fill="none" stroke="#dc2626" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.122 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div style={warningTextStyle}>
                <h3 style={warningTitleStyle}>Are you sure?</h3>
                <p style={warningSubtitleStyle}>This action cannot be undone.</p>
              </div>
            </div>

            {/* Task Details */}
            <div style={taskDetailsStyle}>
              <p style={taskDetailsHeaderStyle}>You are about to delete:</p>
              <div>
                <div style={taskDetailItemStyle}>
                  <span style={labelStyle}>Title:</span>
                  <span style={valueStyle}>{task.title}</span>
                </div>
                <div style={taskDetailItemStyle}>
                  <span style={labelStyle}>Assigned to:</span>
                  <span style={valueStyle}>{task.assignedTo}</span>
                </div>
                <div style={taskDetailItemStyle}>
                  <span style={labelStyle}>Status:</span>
                  <span style={valueStyle}>{task.status}</span>
                </div>
                <div style={taskDetailItemStyle}>
                  <span style={labelStyle}>Column:</span>
                  <span style={valueStyle}>{task.column}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={buttonContainerStyle}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                ...cancelButtonStyle,
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
              onClick={handleDelete}
              disabled={loading}
              style={{
                ...deleteButtonStyle,
                opacity: loading ? 0.5 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#b91c1c')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#dc2626')}
            >
              {loading && (
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite' }}>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" style={{ opacity: 0.25 }}></circle>
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" style={{ opacity: 0.75 }}></path>
                </svg>
              )}
              <span>{loading ? "Deleting..." : "Delete Task"}</span>
            </button>
          </div>
        </div>
      </div>

     
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