import { useState, useEffect } from "react";
import { TaskInput } from "@/components/TaskInput";
import { TaskList, Task, TaskStatus } from "@/components/TaskList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const INITIAL_TASKS: Task[] = [
  {
    id: "1",
    title: "Complete project proposal",
    status: "today",
    completed: false,
    tags: ["work"],
  },
  {
    id: "2",
    title: "Schedule team meeting",
    status: "today",
    completed: false,
    tags: ["work", "important"],
  },
  {
    id: "3",
    title: "Review quarterly goals",
    status: "tomorrow",
    completed: false,
  },
];

const INITIAL_TAGS = ["work", "personal", "important", "urgent", "health", "finance"];

interface AppState {
  tasks: Task[];
  tags: string[];
}

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [availableTags, setAvailableTags] = useState<string[]>(INITIAL_TAGS);
  const { toast } = useToast();

  // Load state from localStorage on component mount
  useEffect(() => {
    const savedState = localStorage.getItem('gtdNestState');
    if (savedState) {
      const { tasks: savedTasks, tags: savedTags } = JSON.parse(savedState);
      setTasks(savedTasks);
      setAvailableTags(savedTags);
    }
  }, []);

  // Save state to localStorage whenever tasks or tags change
  useEffect(() => {
    const state: AppState = {
      tasks,
      tags: availableTags,
    };
    localStorage.setItem('gtdNestState', JSON.stringify(state));
  }, [tasks, availableTags]);

  const handleAddTask = (title: string, tags?: string[]) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      status: "today",
      completed: false,
      tags,
    };
    setTasks([...tasks, newTask]);
  };

  const handleComplete = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleMoveTask = (taskId: string, newStatus: TaskStatus) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const handleAddTag = (newTag: string) => {
    setAvailableTags([...availableTags, newTag]);
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const updatedTasks = tasks.map((task) => {
      if (task.id === draggableId) {
        return {
          ...task,
          status: destination.droppableId as TaskStatus,
        };
      }
      return task;
    });

    setTasks(updatedTasks);
  };

  const exportState = () => {
    const state: AppState = {
      tasks,
      tags: availableTags,
    };
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gtd-nest-backup.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Export successful",
      description: "Your data has been exported successfully.",
    });
  };

  const importState = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const state = JSON.parse(e.target?.result as string) as AppState;
          setTasks(state.tasks);
          setAvailableTags(state.tags);
          toast({
            title: "Import successful",
            description: "Your data has been imported successfully.",
          });
        } catch (error) {
          toast({
            title: "Import failed",
            description: "There was an error importing your data.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-background animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight">GTD Nest</h1>
          <p className="text-muted-foreground">
            Organize your tasks, get things done.
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Button onClick={exportState} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline" size="sm" className="relative">
              <input
                type="file"
                accept=".json"
                onChange={importState}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="w-4 h-4 mr-2" />
              Import Data
            </Button>
          </div>
        </div>

        <TaskInput 
          onAddTask={handleAddTask} 
          availableTags={availableTags} 
          onAddTag={handleAddTag}
        />

        <DragDropContext onDragEnd={handleDragEnd}>
          <Tabs defaultValue="today" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="tomorrow">Tomorrow</TabsTrigger>
              <TabsTrigger value="next">Next Actions</TabsTrigger>
              <TabsTrigger value="waiting">Waiting For</TabsTrigger>
              <TabsTrigger value="someday">Someday</TabsTrigger>
            </TabsList>

            <TabsContent value="today" className="mt-6">
              <TaskList
                tasks={tasks}
                status="today"
                onComplete={handleComplete}
                onMoveTask={handleMoveTask}
                availableTags={availableTags}
              />
            </TabsContent>
            <TabsContent value="tomorrow" className="mt-6">
              <TaskList
                tasks={tasks}
                status="tomorrow"
                onComplete={handleComplete}
                onMoveTask={handleMoveTask}
                availableTags={availableTags}
              />
            </TabsContent>
            <TabsContent value="next" className="mt-6">
              <TaskList
                tasks={tasks}
                status="next"
                onComplete={handleComplete}
                onMoveTask={handleMoveTask}
                availableTags={availableTags}
              />
            </TabsContent>
            <TabsContent value="waiting" className="mt-6">
              <TaskList
                tasks={tasks}
                status="waiting"
                onComplete={handleComplete}
                onMoveTask={handleMoveTask}
                availableTags={availableTags}
              />
            </TabsContent>
            <TabsContent value="someday" className="mt-6">
              <TaskList
                tasks={tasks}
                status="someday"
                onComplete={handleComplete}
                onMoveTask={handleMoveTask}
                availableTags={availableTags}
              />
            </TabsContent>
          </Tabs>
        </DragDropContext>
      </div>
    </div>
  );
};

export default Index;