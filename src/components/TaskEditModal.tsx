
import { useState, useRef, useEffect } from 'react';
import { Task } from '@/types';
import { useTaskStore } from '@/store/taskStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UploadCloud, X } from 'lucide-react';

interface TaskEditModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

const TaskEditModal = ({ task, isOpen, onClose }: TaskEditModalProps) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [image, setImage] = useState<string | undefined>(task.image);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateTask } = useTaskStore();

  useEffect(() => {
    if (isOpen) {
      setTitle(task.title);
      setDescription(task.description);
      setImage(task.image);
    }
  }, [isOpen, task]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Only allow images under 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    updateTask(task.id, {
      title,
      description,
      image
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
              required
            />
            <Textarea
              placeholder="Task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full resize-none"
              rows={3}
            />
          </div>
          
          {image ? (
            <div className="relative rounded-md overflow-hidden">
              <img 
                src={image} 
                alt="Task attachment" 
                className="max-h-40 w-full object-cover"
              />
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 rounded-full"
                onClick={removeImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full">
              <label 
                htmlFor="edit-file-upload" 
                className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-8 h-8 mb-2 text-gray-500" />
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> an image
                  </p>
                </div>
                <input 
                  id="edit-file-upload" 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  ref={fileInputRef}
                />
              </label>
            </div>
          )}
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!title.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskEditModal;
