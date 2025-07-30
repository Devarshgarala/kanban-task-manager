// src/components/ui/badge.tsx
import React from "react";
import clsx from "clsx";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "destructive" | "success" | "warning";
  size?: "sm" | "md" | "lg";
}

export function Badge({ 
  children, 
  className, 
  variant = "default", 
  size = "md" 
}: BadgeProps) {
  const baseStyle = "inline-flex items-center font-medium rounded-full transition-colors";
  
  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
    lg: "px-3 py-1.5 text-sm",
  };

  const variantStyles = {
    default: "bg-gray-100 text-gray-800 border border-gray-200",
    outline: "border border-gray-300 text-gray-700 bg-transparent",
    secondary: "bg-blue-100 text-blue-800 border border-blue-200",
    destructive: "bg-red-100 text-red-800 border border-red-200",
    success: "bg-green-100 text-green-800 border border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border border-yellow-200",
  };

  return (
    <span 
      className={clsx(
        baseStyle, 
        sizeStyles[size], 
        variantStyles[variant], 
        className
      )}
    >
      {children}
    </span>
  );
}

// Status-specific badge components
export function StatusBadge({ status }: { status: string }) {
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "committed": return "success";
      case "done": return "secondary";
      case "reassigned": return "warning";
      case "pending": return "default";
      default: return "default";
    }
  };

  return (
    <Badge variant={getStatusVariant(status)} size="sm">
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

// Priority badge
export function PriorityBadge({ priority }: { priority: "low" | "medium" | "high" | "urgent" }) {
  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "urgent": return "destructive";
      case "high": return "warning";
      case "medium": return "secondary";
      case "low": return "default";
      default: return "default";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent": return "🔴";
      case "high": return "🟡";
      case "medium": return "🔵";
      case "low": return "⚪";
      default: return "";
    }
  };

  return (
    <Badge variant={getPriorityVariant(priority)} size="sm">
      <span className="mr-1">{getPriorityIcon(priority)}</span>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Badge>
  );
}