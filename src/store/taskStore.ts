
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Task, Comment } from '@/types';

interface TaskState {
  tasks: Task[];
  addTask: (title: string, description: string, image?: string) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  addComment: (taskId: string, text: string, author: string) => void;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      addTask: (title, description, image) => 
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              id: uuidv4(),
              title,
              description,
              completed: false,
              createdAt: new Date(),
              image,
              comments: [],
            },
          ],
        })),
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        })),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),
      toggleComplete: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
          ),
        })),
      addComment: (taskId, text, author) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  comments: [
                    ...task.comments,
                    {
                      id: uuidv4(),
                      text,
                      createdAt: new Date(),
                      author,
                    },
                  ],
                }
              : task
          ),
        })),
    }),
    {
      name: 'tasks-storage',
    }
  )
);
