import { useState } from "react";
import { TaskInput } from "@/components/TaskInput";
import { TaskList, Task, TaskStatus } from "@/components/TaskList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DragDropContext, DropResult } from "react-beautiful-dnd";

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

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [availableTags, setAvailableTags] = useState<string[]>(INITIAL_TAGS);

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

  return (
    <div className="min-h-screen p-8 bg-background animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-bold tracking-tight">GTD Nest</h1>
          <p className="text-muted-foreground">
            Organize your tasks, get things done.
          </p>
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