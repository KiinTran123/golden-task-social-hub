
import { useState } from 'react';
import { Task } from '@/types';
import { Check, X, MessageSquare, Share2, Image, Edit, Trash, CheckCircle2 } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTaskStore } from '@/store/taskStore';
import { formatDistanceToNow } from 'date-fns';
import TaskEditModal from './TaskEditModal';
import ShareTaskModal from './ShareTaskModal';
import { toast } from '@/hooks/use-toast';

interface TaskItemProps {
  task: Task;
  onSelect: (task: Task) => void;
}

const TaskItem = ({ task, onSelect }: TaskItemProps) => {
  const { toggleComplete, deleteTask } = useTaskStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleToggleComplete = async () => {
    setIsToggling(true);
    try {
      await toggleComplete(task.id);
      toast({
        title: task.completed ? "Task marked as pending" : "Task marked as completed",
        description: `"${task.title}" has been ${task.completed ? "moved back to pending" : "marked as done"}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive"
      });
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <>
      <Card className={`mb-4 ${task.completed ? 'bg-gray-50 border-green-200' : ''}`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <Button 
                variant={task.completed ? "outline" : "secondary"}
                size="icon" 
                className={`h-8 w-8 transition-colors duration-200 ${
                  task.completed 
                    ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
                onClick={handleToggleComplete}
                disabled={isToggling}
              >
                {isToggling ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <CheckCircle2 className={`h-5 w-5 ${task.completed ? 'fill-green-500' : ''}`} />
                )}
              </Button>
              <CardTitle 
                className={`text-lg ${task.completed ? 'line-through text-gray-500' : ''}`}
              >
                {task.title}
              </CardTitle>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => setIsEditModalOpen(true)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)}>
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Created {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="text-sm text-gray-700">{task.description}</p>
          {task.image && (
            <div className="mt-2">
              <img 
                src={task.image} 
                alt={task.title} 
                className="rounded-md max-h-40 object-cover"
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-0 flex justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-8 gap-1"
              onClick={() => onSelect(task)}
            >
              <MessageSquare className="h-3 w-3" />
              {task.comments.length > 0 ? task.comments.length : ''}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-8 gap-1"
              onClick={() => setIsShareModalOpen(true)}
            >
              <Share2 className="h-3 w-3" />
              Share
            </Button>
          </div>
          {task.completed ? (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
              Completed
            </Badge>
          ) : (
            <Badge variant="outline" className="text-gray-600 hover:bg-gray-100">
              Pending
            </Badge>
          )}
        </CardFooter>
      </Card>
      <TaskEditModal 
        task={task} 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
      />
      <ShareTaskModal
        task={task}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </>
  );
};

export default TaskItem;
