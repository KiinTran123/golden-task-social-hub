
import { useState } from 'react';
import { CheckSquare, PlusCircle, CheckCircle } from 'lucide-react';
import TaskForm from '@/components/TaskForm';
import TaskList from '@/components/TaskList';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary shadow-sm">
        <div className="container mx-auto py-4 px-4 sm:px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-primary-foreground" />
            <h1 className="text-2xl font-bold text-primary-foreground">Task Master</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              My Tasks
            </h2>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1"
            >
              {showForm ? 'Hide Form' : (
                <>
                  <PlusCircle className="h-4 w-4" />
                  New Task
                </>
              )}
            </Button>
          </div>

          {showForm && <TaskForm />}
          <TaskList />
        </div>
      </main>

      <footer className="py-6 border-t border-gray-200 mt-auto">
        <div className="container mx-auto px-4 sm:px-6">
          <p className="text-center text-gray-500 text-sm">
            Task Master - Organize your life, share your accomplishments.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
