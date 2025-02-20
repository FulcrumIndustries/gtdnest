import { useState, useEffect } from "react";
import { TaskInput } from "@/components/TaskInput";
import { TaskList, Task, TaskStatus } from "@/components/TaskList";
import { Button } from "@/components/ui/button";
import { Download, Upload, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { DndProvider } from "@/components/dnd/Context";
import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Column } from "@/components/Column";
import { AddColumnButton } from "@/components/AddColumnButton";
import { getRandomTaskColor } from "@/lib/colors";

const INITIAL_TASKS: Task[] = [
  {
    id: "1",
    title: "Complete project proposal",
    status: "today",
    completed: false,
    tags: ["work"],
    color: "bg-blue-500/20 border-blue-500/30 hover:bg-blue-500/30",
  },
  {
    id: "2",
    title: "Schedule team meeting",
    status: "today",
    completed: false,
    tags: ["work", "important"],
    color: "bg-purple-500/20 border-purple-500/30 hover:bg-purple-500/30",
  },
  {
    id: "3",
    title: "Review quarterly goals",
    status: "tomorrow",
    completed: false,
    color: "bg-emerald-500/20 border-emerald-500/30 hover:bg-emerald-500/30",
  },
];

const INITIAL_TAGS = ["work", "personal", "important", "urgent"];

interface AppState {
  columns: ColumnType[];
}

type ColumnType = {
  id: string;
  title: string;
  tasks: Task[];
};

const INITIAL_COLUMNS: ColumnType[] = [
  {
    id: "today",
    title: "Today",
    tasks: [],
  },
  {
    id: "tomorrow",
    title: "Tomorrow",
    tasks: [],
  },
];

const Index = () => {
  const [columns, setColumns] = useState<ColumnType[]>(INITIAL_COLUMNS);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>(INITIAL_TAGS);
  const { toast } = useToast();
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  // Load state from localStorage on component mount
  useEffect(() => {
    const savedColumns = localStorage.getItem("columns");
    if (savedColumns) {
      try {
        const parsed = JSON.parse(savedColumns);
        // Ensure we have both tasks and title for each column
        const validColumns = parsed.map((col: any) => ({
          id: col.id,
          title: col.title || col.id, // Fallback to id if title missing
          tasks: Array.isArray(col.tasks) ? col.tasks : [],
        }));
        setColumns(validColumns);
      } catch (e) {
        console.error("Failed to parse saved columns:", e);
      }
    }
  }, []);

  // Save state to localStorage whenever tasks or tags change
  useEffect(() => {
    const state: AppState = { columns };
    localStorage.setItem("gtdNestState", JSON.stringify(state));
  }, [columns]);

  const handleAddTask = (title: string, tags?: string[]) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title,
      status: columns[0].id as TaskStatus,
      completed: false,
      tags: tags || [],
      color: getRandomTaskColor(),
    };
    setColumns((cols) =>
      cols.map((col) =>
        col.id === "today" ? { ...col, tasks: [...col.tasks, newTask] } : col
      )
    );
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

  const handleDeleteTag = (tagToDelete: string) => {
    // Remove the tag from available tags
    setAvailableTags(availableTags.filter((tag) => tag !== tagToDelete));

    // Remove the tag from all tasks that have it
    setColumns(
      columns.map((col) => ({
        ...col,
        tasks: col.tasks.map((task) => ({
          ...task,
          tags: task.tags?.filter((tag) => tag !== tagToDelete) || [],
        })),
      }))
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Find source column and task
    let sourceColumn;
    let taskToMove;
    let overColumn;
    let overTask;

    for (const column of columns) {
      const task = column.tasks.find((t) => t.id === activeId);
      if (task) {
        sourceColumn = column;
        taskToMove = task;
      }

      // Also find the target task and its column
      const targetTask = column.tasks.find((t) => t.id === overId);
      if (targetTask) {
        overColumn = column;
        overTask = targetTask;
      }
    }

    if (!sourceColumn || !taskToMove) return;

    // Determine target column - either the column we dropped on directly,
    // or the column containing the task we dropped on
    const targetColumnId = overTask ? overColumn.id : overId;

    // If dropping in the same column, reorder tasks
    if (sourceColumn.id === targetColumnId) {
      setColumns((cols) =>
        cols.map((col) => {
          if (col.id === sourceColumn.id) {
            const newTasks = [...col.tasks];
            const oldIndex = newTasks.findIndex((t) => t.id === activeId);
            const newIndex = overTask
              ? newTasks.findIndex((t) => t.id === overId) + 1
              : newTasks.length;

            // Remove task from old position
            newTasks.splice(oldIndex, 1);
            // Insert at new position
            newTasks.splice(
              newIndex - (newIndex > oldIndex ? 1 : 0),
              0,
              taskToMove
            );

            return {
              ...col,
              tasks: newTasks,
            };
          }
          return col;
        })
      );
      return;
    }

    // Moving to different column
    setColumns((cols) =>
      cols.map((col) => {
        // Remove from source column
        if (col.id === sourceColumn.id) {
          return {
            ...col,
            tasks: col.tasks.filter((t) => t.id !== activeId),
          };
        }
        // Add to destination column
        if (col.id === targetColumnId) {
          const newTasks = [...col.tasks];
          const insertIndex = overTask
            ? newTasks.findIndex((t) => t.id === overId) + 1
            : newTasks.length;

          newTasks.splice(insertIndex, 0, {
            ...taskToMove,
            status: targetColumnId as TaskStatus,
          });

          return {
            ...col,
            tasks: newTasks,
          };
        }
        return col;
      })
    );
  };

  const handleDeleteTask = (id: string) => {
    setColumns((cols) =>
      cols.map((col) => ({
        ...col,
        tasks: col.tasks.filter((task) => task.id !== id),
      }))
    );
    toast({
      title: "Task deleted",
      description: "Your task has been deleted successfully.",
    });
  };

  const exportState = () => {
    try {
      const state: AppState = { columns };
      const blob = new Blob([JSON.stringify(state, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `gtd-nest-backup-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({
        title: "Export successful",
        description: "Your data has been exported successfully.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your data.",
        variant: "destructive",
      });
    }
  };

  const importState = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsImporting(true);
      try {
        const text = await file.text();
        const { columns: importedColumns } = JSON.parse(text) as AppState;
        setColumns(importedColumns);
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
      } finally {
        setIsImporting(false);
        // Reset the input
        event.target.value = "";
      }
    }
  };

  const addColumn = () => {
    const newColumn: ColumnType = {
      id: `column-${Date.now()}`,
      title: "New Column",
      tasks: [],
    };
    setColumns([...columns, newColumn]);
  };

  const handleRenameColumn = (columnId: string, newTitle: string) => {
    setColumns((cols) =>
      cols.map((col) =>
        col.id === columnId ? { ...col, title: newTitle } : col
      )
    );
    // Save immediately after rename
    localStorage.setItem("columns", JSON.stringify(columns));
  };

  const handleDeleteColumn = (columnId: string) => {
    setColumns(columns.filter((col) => col.id !== columnId));
  };

  const handleEditTask = (taskId: string, updates: Partial<Task>) => {
    setColumns(
      columns.map((col) => ({
        ...col,
        tasks: col.tasks.map((task) =>
          task.id === taskId ? { ...task, ...updates } : task
        ),
      }))
    );
  };

  // Add resetState function
  const resetState = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all data? This cannot be undone."
      )
    ) {
      setColumns(INITIAL_COLUMNS);
      setAvailableTags(INITIAL_TAGS);
      localStorage.removeItem("gtdNestState");
      toast({
        title: "Reset successful",
        description: "All data has been reset to initial values.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* App Header */}
        <header className="space-y-6">
          {/* Title and Task Input */}
          <div className="flex items-start justify-between gap-8">
            <div className="flex-1">
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white">
                GTD Nest<span className="text-[#3B82F6]">.</span>
              </h1>
              <p className="text-lg text-slate-400 mt-2">
                Organize your tasks, get things done ✨
              </p>
              <div className="flex items-center gap-4 mt-4">
                {/* Action Buttons */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Button
                      onClick={exportState}
                      variant="outline"
                      size="sm"
                      className="bg-slate-800/50 border-slate-700 text-slate-300 
                        hover:bg-slate-800 hover:border-blue-500/50 transition-all group"
                    >
                      <Download className="w-4 h-4 mr-2 group-hover:text-blue-400 transition-colors" />
                      <span className="group-hover:text-blue-400 transition-colors">
                        Export
                      </span>
                    </Button>

                    <div className="relative">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-slate-800/50 border-slate-700 text-slate-300 
                          hover:bg-slate-800 hover:border-blue-500/50 transition-all group cursor-pointer"
                      >
                        <input
                          type="file"
                          accept=".json"
                          onChange={importState}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          style={{ minWidth: "auto" }}
                        />
                        <Upload className="w-4 h-4 mr-2 group-hover:text-blue-400 transition-colors" />
                        <span className="group-hover:text-blue-400 transition-colors">
                          Import
                        </span>
                      </Button>
                    </div>

                    <Button
                      onClick={resetState}
                      variant="outline"
                      size="sm"
                      className="bg-slate-800/50 border-red-900/50 text-red-300 
                        hover:bg-red-950/50 hover:border-red-500/50 transition-all group"
                    >
                      <Trash2 className="w-4 h-4 mr-2 group-hover:text-red-400 transition-colors" />
                      <span className="group-hover:text-red-400 transition-colors">
                        Reset Local Storage
                      </span>
                    </Button>
                  </div>
                  <p className="text-sm text-slate-500 italic">
                    Everything is saved dynamically in your browser local
                    storage.
                  </p>
                </div>
              </div>
            </div>

            {/* Task Input - Expanded */}
            <div className="w-[600px] bg-slate-800/50 rounded-lg p-4">
              <TaskInput
                onAddTask={handleAddTask}
                availableTags={availableTags}
                onAddTag={handleAddTag}
                onDeleteTag={handleDeleteTag}
              />
            </div>
          </div>
        </header>

        {/* Board Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Task Board</h2>
          <AddColumnButton onClick={addColumn} />
        </div>

        {/* Columns */}
        <DndProvider onDragEnd={handleDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-8 custom-scroll relative z-0">
            {columns.map((column) => (
              <div key={column.id} className="column-enter relative z-0">
                <Column
                  id={column.id}
                  title={column.title}
                  tasks={column.tasks}
                  onAddTask={(title) => {
                    const newTask: Task = {
                      id: `task-${Date.now()}`,
                      title,
                      status: column.id as TaskStatus,
                      completed: false,
                      tags: [],
                      color: getRandomTaskColor(),
                    };
                    setColumns((cols) =>
                      cols.map((col) =>
                        col.id === column.id
                          ? { ...col, tasks: [...col.tasks, newTask] }
                          : col
                      )
                    );
                  }}
                  onDeleteTask={(taskId) => {
                    setColumns((cols) =>
                      cols.map((col) => ({
                        ...col,
                        tasks: col.tasks.filter((task) => task.id !== taskId),
                      }))
                    );
                  }}
                  onDeleteColumn={() => handleDeleteColumn(column.id)}
                  onRenameColumn={(newTitle) =>
                    handleRenameColumn(column.id, newTitle)
                  }
                  onEditTask={(taskId, updates) =>
                    handleEditTask(taskId, updates as Partial<Task>)
                  }
                  availableTags={availableTags}
                />
              </div>
            ))}
          </div>
        </DndProvider>
      </div>
    </div>
  );
};

export default Index;
