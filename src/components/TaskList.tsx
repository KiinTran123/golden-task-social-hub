
import { useState } from 'react';
import { Task } from '@/types';
import TaskItem from './TaskItem';
import { useTaskStore } from '@/store/taskStore';
import TaskDetailModal from './TaskDetailModal';

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
      {tasks.length > 0 ? (
        <div>
          {pendingTasks.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Pending Tasks ({pendingTasks.length})</h3>
              {pendingTasks.map(task => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  onSelect={handleSelectTask} 
                />
              ))}
            </div>
          )}
          
          {completedTasks.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Completed Tasks ({completedTasks.length})</h3>
              {completedTasks.map(task => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  onSelect={handleSelectTask} 
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No tasks yet. Create one to get started!
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
