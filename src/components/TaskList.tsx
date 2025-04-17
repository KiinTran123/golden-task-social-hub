
import { useState } from 'react';
import { Task } from '@/types';
import TaskItem from './TaskItem';
import { useTaskStore } from '@/store/taskStore';
import TaskDetailModal from './TaskDetailModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TaskList = () => {
  const { tasks } = useTaskStore();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleSelectTask = (task: Task) => {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  };

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);

  return (
    <div>
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All ({tasks.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingTasks.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {tasks.length > 0 ? (
            tasks.map(task => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onSelect={handleSelectTask} 
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No tasks yet. Create one to get started!
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="pending">
          {pendingTasks.length > 0 ? (
            pendingTasks.map(task => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onSelect={handleSelectTask} 
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No pending tasks.
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed">
          {completedTasks.length > 0 ? (
            completedTasks.map(task => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onSelect={handleSelectTask} 
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No completed tasks.
            </div>
          )}
        </TabsContent>
      </Tabs>

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
