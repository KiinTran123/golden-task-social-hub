
export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  image?: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  text: string;
  createdAt: Date;
  author: string;
}
