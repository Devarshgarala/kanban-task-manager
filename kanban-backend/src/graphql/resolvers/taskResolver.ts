import { prisma } from "../../lib/prisma";

export const resolvers = {
  Query: {
    tasks: () => prisma.task.findMany(),
    task: (_: any, { id }: { id: string }) => 
      prisma.task.findUnique({ where: { id } }),
    tasksByColumn: (_: any, { column }: { column: string }) =>
      prisma.task.findMany({ where: { column } }),
    searchTasks: (_: any, { query }: { query: string }) =>
      prisma.task.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { detail: { contains: query, mode: 'insensitive' } },
            { assignedTo: { contains: query, mode: 'insensitive' } },
          ],
        },
      }),
    tasksStats: async () => {
      const tasks = await prisma.task.findMany();
      const byStatus = tasks.reduce((acc: any, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
      }, {});
      
      const stats = {
        total: tasks.length,
        todo: tasks.filter(t => t.column === 'todo').length,
        doing: tasks.filter(t => t.column === 'doing').length,
        done: tasks.filter(t => t.column === 'done').length,
        byStatus: JSON.stringify(byStatus),
      };
      return stats;
    },
  },
  Mutation: {
    addTask: (_: any, args: any) => prisma.task.create({ data: args }),
    
    createTask: (_: any, args: any) => prisma.task.create({ data: args }),
    
    updateTask: async (_: any, { id, ...data }: any) =>
      prisma.task.update({ where: { id }, data }),
    
    updateTaskColumn: async (_: any, { id, column }: { id: string, column: string }) =>
      prisma.task.update({ where: { id }, data: { column } }),
    
    updateTaskStatus: async (_: any, { id, status }: { id: string, status: string }) =>
      prisma.task.update({ where: { id }, data: { status } }),
    
    updateTaskAssignment: async (_: any, { id, assignedTo }: { id: string, assignedTo: string }) =>
      prisma.task.update({ where: { id }, data: { assignedTo } }),
    
    deleteTask: async (_: any, { id }: { id: string }) =>
      prisma.task.delete({ where: { id } }),
    
    duplicateTask: async (_: any, { id }: { id: string }) => {
      const originalTask = await prisma.task.findUnique({ where: { id } });
      if (!originalTask) throw new Error('Task not found');
      
      // Fixed the destructuring - removed the conflicting variable name
      const { id: originalId, ...taskData } = originalTask;
      return prisma.task.create({
        data: {
          ...taskData,
          title: `${taskData.title} (Copy)`,
        },
      });
    },
    
    bulkUpdateTasks: async (_: any, { updates }: { updates: any[] }) => {
      const updatePromises = updates.map(({ id, ...data }) => {
        const validData: any = {};
        if (data.title !== undefined) validData.title = data.title;
        if (data.detail !== undefined) validData.detail = data.detail;
        if (data.assignedTo !== undefined) validData.assignedTo = data.assignedTo;
        if (data.status !== undefined) validData.status = data.status;
        if (data.column !== undefined) validData.column = data.column;
        
        return prisma.task.update({ where: { id }, data: validData });
      });
      return Promise.all(updatePromises);
    },
  },
};