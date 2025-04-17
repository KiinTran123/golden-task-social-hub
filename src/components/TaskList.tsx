
import { useState } from 'react';
import { Task } from '@/types';
import TaskItem from './TaskItem';
import { useTaskStore } from '@/store/taskStore';
import TaskDetailModal from './TaskDetailModal';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';

const TaskList = () => {
  const { tasks } = useTaskStore();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelectTask = (task: Task) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const completedTasks = filteredTasks.filter(task => task.completed);
  const pendingTasks = filteredTasks.filter(task => !task.completed);

  return (
    <div>
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          className="pl-10"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pending Tasks Column */}
          <div className="border rounded-lg p-4 bg-white shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Pending Tasks ({pendingTasks.length})</h3>
            {pendingTasks.length > 0 ? (
              <ScrollArea className="h-[calc(100vh-250px)]">
                <div className="pr-4">
                  {pendingTasks.map(task => (
                    <TaskItem 
                      key={task.id} 
                      task={task} 
                      onSelect={handleSelectTask} 
                    />
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No pending tasks.
              </div>
            )}
          </div>
          
          {/* Completed Tasks Column */}
          <div className="border rounded-lg p-4 bg-white shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Completed Tasks ({completedTasks.length})</h3>
            {completedTasks.length > 0 ? (
              <ScrollArea className="h-[calc(100vh-250px)]">
                <div className="pr-4">
                  {completedTasks.map(task => (
                    <TaskItem 
                      key={task.id} 
                      task={task} 
                      onSelect={handleSelectTask} 
                    />
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No completed tasks.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          {searchQuery ? "No matching tasks found." : "No tasks yet. Create one to get started!"}
        </div>
      )}

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
        />
      )}
    </div>
  );
};

export default TaskList;
