
export interface Task {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: Date;
  image?: string | null;
  comments: Comment[];
}

export interface Comment {
  id: string;
  text: string;
  createdAt: Date;
  author: string;
}

// Helper function to convert Supabase task data to our app's Task interface
export function mapSupabaseTask(task: any, comments: any[] = []): Task {
  return {
    id: task.id,
    title: task.title,
    description: task.description || '',
    completed: task.completed,
    createdAt: new Date(task.created_at),
    image: task.image,
    comments: comments.map(comment => ({
      id: comment.id,
      text: comment.text,
      createdAt: new Date(comment.created_at),
      author: comment.author
    }))
  };
}
