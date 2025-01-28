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

const INITIAL_TAGS = [
  "work",
  "personal",
  "important",
  "urgent",
  "health",
  "finance",
];

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
    const savedState = localStorage.getItem("gtdNestState");
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
    localStorage.setItem("gtdNestState", JSON.stringify(state));
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

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
    toast({
      title: "Task deleted",
      description: "Your task has been deleted successfully.",
    });
  };

  const exportState = () => {
    const state: AppState = {
      tasks,
      tags: availableTags,
    };
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gtd-nest-backup.json";
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
    <div className="min-h-screen bg-gradient-to-b from-[#0F172A] to-[#1E293B] relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />

      {/* Floating orbs with more subtle colors */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div
          className="absolute w-[800px] h-[800px] rounded-full bg-[#3B82F6]/5 blur-3xl 
          animate-float top-0 -left-96"
        />
        <div
          className="absolute w-[600px] h-[600px] rounded-full bg-[#2563EB]/5 blur-3xl 
          animate-float-delayed -bottom-64 -right-32"
        />
      </div>

      <div className="max-w-5xl mx-auto p-6 sm:p-8 space-y-8">
        {/* Header section with improved typography */}
        <header className="space-y-4 text-center py-12">
          <h1
            className="text-4xl sm:text-6xl font-bold tracking-tight text-white 
            animate-fade-in font-display"
          >
            GTD Nest
            <span className="text-[#3B82F6]">.</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 animate-fade-in-up font-light">
            Organize your tasks, get things done ✨
          </p>

          {/* Action buttons with improved styling */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button
              onClick={exportState}
              variant="outline"
              size="lg"
              className="group relative bg-slate-900/50 border-slate-700 text-slate-300 
              hover:bg-[#3B82F6]/10 hover:border-[#3B82F6] hover:text-[#3B82F6] 
              transition-all duration-300"
            >
              <Download
                className="w-5 h-5 mr-2 group-hover:scale-110 group-hover:translate-y-0.5 
                transition-all duration-300"
              />
              Export Data
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="group relative bg-slate-900/50 border-slate-700 text-slate-300 
              hover:bg-[#3B82F6]/10 hover:border-[#3B82F6] hover:text-[#3B82F6] 
              transition-all duration-300"
            >
              <input
                type="file"
                accept=".json"
                onChange={importState}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload
                className="w-5 h-5 mr-2 group-hover:scale-110 group-hover:-translate-y-0.5 
                transition-all duration-300"
              />
              Import Data
            </Button>
          </div>
        </header>

        {/* Task input section with glassmorphism */}
        <div
          className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 sm:p-8 
          border border-slate-800/50 shadow-xl"
        >
          <TaskInput
            onAddTask={handleAddTask}
            availableTags={availableTags}
            onAddTag={handleAddTag}
          />
        </div>

        {/* Tasks section */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Tabs defaultValue="today" className="w-full">
            <TabsList
              className="flex w-full p-1 bg-slate-900/50 backdrop-blur-xl 
              rounded-xl border border-slate-800/50 mb-6"
            >
              {["today", "tomorrow", "next", "waiting", "someday"].map(
                (tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="flex-1 text-base sm:text-lg rounded-lg py-3 
                  data-[state=active]:bg-[#3B82F6] data-[state=active]:text-white 
                  text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 
                  transition-colors capitalize"
                  >
                    {tab}
                  </TabsTrigger>
                )
              )}
            </TabsList>

            <div
              className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 sm:p-8 
              border border-slate-800/50 shadow-xl"
            >
              {["today", "tomorrow", "next", "waiting", "someday"].map(
                (tab) => (
                  <TabsContent key={tab} value={tab}>
                    <TaskList
                      tasks={tasks}
                      status={tab as TaskStatus}
                      onComplete={handleComplete}
                      onMoveTask={handleMoveTask}
                      onDeleteTask={handleDeleteTask}
                      availableTags={availableTags}
                    />
                  </TabsContent>
                )
              )}
            </div>
          </Tabs>
        </DragDropContext>
      </div>
    </div>
  );
};

export default Index;
