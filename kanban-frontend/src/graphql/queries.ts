import { gql } from "@apollo/client";

// Query to get all tasks - REMOVED createdAt and updatedAt
export const GET_TASKS = gql`
  query GetTasks {
    tasks {
      id
      title
      detail
      column
      assignedTo
      status
    }
  }
`;

// Query to get tasks by column
export const GET_TASKS_BY_COLUMN = gql`
  query GetTasksByColumn($column: String!) {
    tasksByColumn(column: $column) {
      id
      title
      detail
      column
      assignedTo
      status
    }
  }
`;

// Query to get a single task by ID
export const GET_TASK_BY_ID = gql`
  query GetTaskById($id: ID!) {
    task(id: $id) {
      id
      title
      detail
      column
      assignedTo
      status
    }
  }
`;

// Query to search tasks
export const SEARCH_TASKS = gql`
  query SearchTasks($query: String!) {
    searchTasks(query: $query) {
      id
      title
      detail
      column
      assignedTo
      status
    }
  }
`;

// Query to get tasks statistics
export const GET_TASKS_STATS = gql`
  query GetTasksStats {
    tasksStats {
      total
      todo
      doing
      done
      byStatus
    }
  }
`;