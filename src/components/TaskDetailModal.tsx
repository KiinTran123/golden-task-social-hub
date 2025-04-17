
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Task } from '@/types';
import { useTaskStore } from '@/store/taskStore';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, User, Share2 } from 'lucide-react';
import ShareTaskModal from './ShareTaskModal';

interface TaskDetailModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

const TaskDetailModal = ({ task, isOpen, onClose }: TaskDetailModalProps) => {
  const [commentText, setCommentText] = useState('');
  const [userName, setUserName] = useState('User');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { addComment } = useTaskStore();

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    addComment(task.id, commentText, userName);
    setCommentText('');
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <DialogTitle>{task.title}</DialogTitle>
              {task.completed && (
                <Badge className="bg-green-100 text-green-800">
                  Completed
                </Badge>
              )}
            </div>
            <DialogDescription>
              Created {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {task.description && (
              <div>
                <h4 className="text-sm font-medium mb-1">Description</h4>
                <p className="text-sm text-gray-700">{task.description}</p>
              </div>
            )}
            
            {task.image && (
              <div>
                <h4 className="text-sm font-medium mb-1">Attachment</h4>
                <img 
                  src={task.image} 
                  alt={task.title} 
                  className="rounded-md max-h-60 object-cover"
                />
              </div>
            )}
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  Comments ({task.comments.length})
                </h4>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs h-8"
                  onClick={() => setIsShareModalOpen(true)}
                >
                  <Share2 className="h-3 w-3 mr-1" />
                  Share
                </Button>
              </div>
              
              <div className="space-y-3 mb-4">
                {task.comments.length > 0 ? (
                  task.comments.map(comment => (
                    <div key={comment.id} className="bg-gray-50 p-3 rounded-md">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="font-medium text-sm">{comment.author}</span>
                        <span className="text-xs text-gray-500">
                          • {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm">{comment.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-2">
                    No comments yet. Be the first to comment!
                  </p>
                )}
              </div>
              
              <form onSubmit={handleCommentSubmit} className="space-y-2">
                <div className="flex gap-2 items-center">
                  <User className="h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Your name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="text-sm"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="resize-none text-sm min-h-[80px]"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={!commentText.trim() || !userName.trim()}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Add Comment
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <ShareTaskModal
        task={task}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </>
  );
};

export default TaskDetailModal;
