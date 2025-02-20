import { Check, Clock, ArrowRight, MoveVertical, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";

import { CSS } from "@dnd-kit/utilities";
import { Task, TaskStatus } from "@/types";

export type { Task, TaskStatus };

interface TaskListProps {
  tasks: Task[];
  status: TaskStatus;
  onComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

const getStatusIcon = (status: TaskStatus) => {
  switch (status) {
    case "today":
      return <Clock className="h-4 w-4 text-primary" />;
    case "tomorrow":
      return <ArrowRight className="h-4 w-4 text-muted-foreground" />;
    default:
      return null;
  }
};

const STATUS_LABELS: Record<TaskStatus, string> = {
  today: "Today",
  tomorrow: "Tomorrow",
  next: "Next Actions",
  waiting: "Waiting For",
  someday: "Someday",
};

export const TaskList = ({
  tasks,
  status,
  onComplete,
  onDeleteTask,
}: TaskListProps) => {
  return (
    <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
      <div className="space-y-2">
        {tasks.map((task) => (
          <SortableTask
            key={task.id}
            task={task}
            onComplete={onComplete}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>
    </SortableContext>
  );
};

const SortableTask = ({
  task,
  onComplete,
  onDeleteTask,
}: {
  task: Task;
  onComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex flex-col gap-2 p-3 rounded-lg bg-slate-800/20 border border-slate-800/30",
        "hover:bg-slate-800/30 transition-all duration-200 mb-2 last:mb-0",
        task.completed && "opacity-50",
        isDragging && "shadow-xl bg-slate-800/50 border-[#3B82F6]/30"
      )}
      {...attributes}
    >
      <div className="flex items-center gap-3" {...listeners}>
        <button
          onClick={() => onComplete(task.id)}
          className={cn(
            "shrink-0 h-5 w-5 rounded border border-slate-600 flex items-center justify-center",
            "transition-colors hover:border-[#3B82F6]",
            task.completed && "bg-[#3B82F6] border-[#3B82F6]"
          )}
        >
          {task.completed && <Check className="h-3 w-3 text-white" />}
        </button>
        <span
          className={cn(
            "flex-1 text-sm text-slate-200",
            task.completed && "line-through text-slate-400"
          )}
        >
          {task.title}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDeleteTask(task.id)}
          className="opacity-30 group-hover:opacity-100 hover:scale-125 hover:bg-red-500/20 hover:text-red-400 
          transition-all text-slate-400 shrink-0"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs rounded-full bg-[#3B82F6]/10 text-[#93C5FD]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
