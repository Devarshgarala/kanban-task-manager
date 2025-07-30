import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Task {
    id: ID!
    title: String!
    detail: String!
    assignedTo: String!
    status: String!
    column: String!
  }

  type TaskStats {
    total: Int!
    todo: Int!
    doing: Int!
    done: Int!
    byStatus: String! # JSON string representation
  }

  type Query {
    tasks: [Task!]!
    task(id: ID!): Task
    tasksByColumn(column: String!): [Task!]!
    searchTasks(query: String!): [Task!]!
    tasksStats: TaskStats!
  }

  type Mutation {
    addTask(title: String!, detail: String!, assignedTo: String!, status: String!, column: String!): Task
    createTask(title: String!, detail: String!, assignedTo: String!, status: String!, column: String!): Task
    updateTask(id: ID!, title: String, detail: String, assignedTo: String, status: String, column: String): Task
    updateTaskColumn(id: ID!, column: String!): Task
    updateTaskStatus(id: ID!, status: String!): Task
    updateTaskAssignment(id: ID!, assignedTo: String!): Task
    deleteTask(id: ID!): Task
    duplicateTask(id: ID!): Task
    bulkUpdateTasks(updates: [TaskUpdateInput!]!): [Task!]!
  }

  input TaskUpdateInput {
    id: ID!
    title: String
    detail: String
    assignedTo: String
    status: String
    column: String
  }
`;