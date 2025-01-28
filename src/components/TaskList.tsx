import { Check, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type TaskStatus = "today" | "tomorrow" | "next" | "waiting" | "someday";

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  completed: boolean;
  tags?: string[];
}

interface TaskListProps {
  tasks: Task[];
  status: TaskStatus;
  onComplete: (id: string) => void;
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

export const TaskList = ({ tasks, status, onComplete }: TaskListProps) => {
  const filteredTasks = tasks.filter((task) => task.status === status);

  return (
    <div className="space-y-2">
      {filteredTasks.map((task) => (
        <div
          key={task.id}
          className={cn(
            "group flex items-center gap-3 p-4 rounded-lg bg-card hover:bg-accent/50 transition-all duration-200",
            task.completed && "opacity-50"
          )}
        >
          <button
            onClick={() => onComplete(task.id)}
            className={cn(
              "h-5 w-5 rounded border border-input flex items-center justify-center transition-colors",
              task.completed && "bg-primary border-primary",
              "hover:border-primary"
            )}
          >
            {task.completed && <Check className="h-3 w-3 text-primary-foreground" />}
          </button>
          <span className={cn("flex-1", task.completed && "line-through")}>
            {task.title}
          </span>
          {getStatusIcon(status)}
          {task.tags && (
            <div className="flex gap-2">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};