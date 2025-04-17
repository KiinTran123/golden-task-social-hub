
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Task, Comment, mapSupabaseTask } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  fetchTasks: () => Promise<void>;
  addTask: (title: string, description: string, image?: string) => Promise<void>;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  addComment: (taskId: string, text: string, author: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      loading: false,

      fetchTasks: async () => {
        set({ loading: true });
        try {
          // Fetch tasks
          const { data: tasks, error: tasksError } = await supabase
            .from('tasks')
            .select('*')
            .order('created_at', { ascending: false });

          if (tasksError) {
            throw tasksError;
          }

          // Fetch comments for all tasks
          const { data: comments, error: commentsError } = await supabase
            .from('comments')
            .select('*');

          if (commentsError) {
            throw commentsError;
          }

          // Map tasks with their comments
          const tasksWithComments = tasks.map(task => {
            const taskComments = comments.filter(comment => comment.task_id === task.id) || [];
            return mapSupabaseTask(task, taskComments);
          });

          set({ tasks: tasksWithComments, loading: false });
        } catch (error) {
          console.error('Error fetching tasks:', error);
          toast({
            title: "Error",
            description: "Failed to fetch tasks. Please try again.",
            variant: "destructive",
          });
          set({ loading: false });
        }
      },

      addTask: async (title, description, image) => {
        try {
          // Insert task into Supabase
          const { data, error } = await supabase
            .from('tasks')
            .insert({
              title,
              description,
              completed: false,
              image,
            })
            .select()
            .single();

          if (error) {
            throw error;
          }

          // Add the new task to the state
          const newTask = mapSupabaseTask(data, []);
          set(state => ({
            tasks: [newTask, ...state.tasks],
          }));

          toast({
            title: "Success",
            description: "Task added successfully",
          });
        } catch (error) {
          console.error('Error adding task:', error);
          toast({
            title: "Error",
            description: "Failed to add task. Please try again.",
            variant: "destructive",
          });
        }
      },

      updateTask: async (id, updates) => {
        try {
          // Update task in Supabase
          const { error } = await supabase
            .from('tasks')
            .update({
              title: updates.title,
              description: updates.description,
              image: updates.image,
              completed: updates.completed,
            })
            .eq('id', id);

          if (error) {
            throw error;
          }

          // Update the task in state
          set(state => ({
            tasks: state.tasks.map(task =>
              task.id === id ? { ...task, ...updates } : task
            ),
          }));

          toast({
            title: "Success",
            description: "Task updated successfully",
          });
        } catch (error) {
          console.error('Error updating task:', error);
          toast({
            title: "Error",
            description: "Failed to update task. Please try again.",
            variant: "destructive",
          });
        }
      },

      deleteTask: async (id) => {
        try {
          // Delete task from Supabase
          const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', id);

          if (error) {
            throw error;
          }

          // Remove the task from state
          set(state => ({
            tasks: state.tasks.filter(task => task.id !== id),
          }));

          toast({
            title: "Success",
            description: "Task deleted successfully",
          });
        } catch (error) {
          console.error('Error deleting task:', error);
          toast({
            title: "Error",
            description: "Failed to delete task. Please try again.",
            variant: "destructive",
          });
        }
      },

      toggleComplete: async (id) => {
        const task = get().tasks.find(t => t.id === id);
        if (!task) return;

        try {
          // Toggle completed status in Supabase
          const { error } = await supabase
            .from('tasks')
            .update({ completed: !task.completed })
            .eq('id', id);

          if (error) {
            throw error;
          }

          // Update task in state
          set(state => ({
            tasks: state.tasks.map(task =>
              task.id === id ? { ...task, completed: !task.completed } : task
            ),
          }));

          toast({
            title: "Success",
            description: `Task marked as ${!task.completed ? 'completed' : 'incomplete'}`,
          });
        } catch (error) {
          console.error('Error toggling task completion:', error);
          toast({
            title: "Error",
            description: "Failed to update task. Please try again.",
            variant: "destructive",
          });
        }
      },

      addComment: async (taskId, text, author) => {
        try {
          // Add comment to Supabase
          const { data, error } = await supabase
            .from('comments')
            .insert({
              task_id: taskId,
              text,
              author,
            })
            .select()
            .single();

          if (error) {
            throw error;
          }

          // Add comment to state
          const comment = {
            id: data.id,
            text: data.text,
            createdAt: new Date(data.created_at),
            author: data.author,
          };

          set(state => ({
            tasks: state.tasks.map(task =>
              task.id === taskId
                ? {
                    ...task,
                    comments: [...task.comments, comment],
                  }
                : task
            ),
          }));

          toast({
            title: "Success",
            description: "Comment added successfully",
          });
        } catch (error) {
          console.error('Error adding comment:', error);
          toast({
            title: "Error",
            description: "Failed to add comment. Please try again.",
            variant: "destructive",
          });
        }
      },
    }),
    {
      name: 'tasks-storage',
    }
  )
);
