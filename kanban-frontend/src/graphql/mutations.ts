import { gql } from "@apollo/client";

export const ADD_TASK = gql`
  mutation AddTask(
    $title: String!
    $detail: String!
    $column: String!
    $assignedTo: String!
    $status: String!
  ) {
    addTask(
      title: $title
      detail: $detail
      column: $column
      assignedTo: $assignedTo
      status: $status
    ) {
      id
      title
      detail
      column
      assignedTo
      status
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask(
    $id: ID!
    $title: String
    $detail: String
    $column: String
    $assignedTo: String
    $status: String
  ) {
    updateTask(
      id: $id
      title: $title
      detail: $detail
      column: $column
      assignedTo: $assignedTo
      status: $status
    ) {
      id
      title
      detail
      column
      assignedTo
      status
    }
  }
`;

export const UPDATE_TASK_COLUMN = gql`
  mutation UpdateTaskColumn($id: ID!, $column: String!) {
    updateTaskColumn(id: $id, column: $column) {
      id
      title
      detail
      column
      assignedTo
      status
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      id
      title
    }
  }
`;

// TypeScript interfaces
export interface AddTaskVariables {
  title: string;
  detail: string;
  column: string;
  assignedTo: string;
  status: string;
}

export interface UpdateTaskVariables {
  id: string;
  title?: string;
  detail?: string;
  column?: string;
  assignedTo?: string;
  status?: string;
}

export interface UpdateTaskColumnVariables {
  id: string;
  column: string;
}

export interface DeleteTaskVariables {
  id: string;
}