
import { useState } from 'react';
import { Task } from '@/types';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Copy, 
  Check,
  Share2,
  MessageSquare
} from 'lucide-react';
import { toast } from "sonner";

interface ShareTaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

const ShareTaskModal = ({ task, isOpen, onClose }: ShareTaskModalProps) => {
  const [copied, setCopied] = useState(false);
  
  const shareText = `${task.completed ? '✅ Completed: ' : ''}${task.title} ${task.description ? `- ${task.description}` : ''}`;
  
  const shareUrl = window.location.href;
  
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(shareText)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    setCopied(true);
    toast("Link copied to clipboard!");
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const openShareWindow = (url: string) => {
    window.open(url, '_blank', 'width=600,height=400');
    toast("Share window opened!");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Share Task
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-2">
          <div className="p-3 bg-gray-50 rounded-md">
            <h4 className="font-medium text-sm mb-1">{task.title}</h4>
            {task.description && <p className="text-sm text-gray-700">{task.description}</p>}
            {task.comments.length > 0 && (
              <div className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                {task.comments.length} comments
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-medium">Share on social media</h4>
            <div className="flex gap-2">
              <Button 
                onClick={() => openShareWindow(facebookShareUrl)}
                variant="outline" 
                className="flex-1"
              >
                <Facebook className="h-4 w-4 mr-2" />
                Facebook
              </Button>
              <Button 
                onClick={() => openShareWindow(twitterShareUrl)}
                variant="outline" 
                className="flex-1"
              >
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
              </Button>
              <Button 
                onClick={() => openShareWindow(linkedinShareUrl)}
                variant="outline" 
                className="flex-1"
              >
                <Linkedin className="h-4 w-4 mr-2" />
                LinkedIn
              </Button>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Or copy link</h4>
            <div className="flex">
              <Button 
                onClick={handleCopy} 
                variant="outline" 
                className="w-full"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy to clipboard
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareTaskModal;
