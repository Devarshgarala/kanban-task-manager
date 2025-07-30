// src/types/types.ts

export interface Task {
  id: string;
  title: string;
  detail: string;
  column: "todo" | "doing" | "done";
  assignedTo: string;
  status: "pending" | "committed" | "done" | "reassigned";
  // Removed createdAt and updatedAt since they don't exist in backend
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}

// GraphQL response types
export interface GetTasksResponse {
  tasks: Task[];
}

export interface AddTaskResponse {
  addTask: Task;
}

export interface UpdateTaskResponse {
  updateTask: Task;
}

export interface UpdateTaskColumnResponse {
  updateTaskColumn: Task;
}

// Form types
export interface TaskFormData {
  title: string;
  detail: string;
  assignedTo: string;
  status: Task["status"];
  column: Task["column"];
}

// Mutation variables
export interface AddTaskVariables {
  title: string;
  detail: string;
  assignedTo: string;
  column: string;
  status: string;
}

export interface UpdateTaskVariables {
  id: string;
  title?: string;
  detail?: string;
  assignedTo?: string;
  column?: string;
  status?: string;
}

export interface UpdateTaskColumnVariables {
  id: string;
  column: string;
}

// Component props
export interface TaskCardProps {
  task: Task;
  onTaskDrop?: (id: string, newColumn: Task["column"]) => void;
}

export interface ColumnProps {
  column: Task["column"];
  tasks: Task[];
  onTaskDrop: (id: string, newColumn: Task["column"]) => void;
}

export interface EditTaskModalProps {
  task: Task;
  onClose: () => void;
  refetch: () => void;
}

// Drag and Drop types
export interface DragEndEventData {
  active: {
    id: string;
  };
  over: {
    id: string;
  } | null;
}