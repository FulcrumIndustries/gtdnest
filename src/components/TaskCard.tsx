import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Pen, Trash2, Tag } from "lucide-react";
import { Task } from "@/types";
import { TaskDetailModal } from "./TaskDetailModal";

type TaskCardProps = {
  task: Task;
  onDelete: () => void;
  onEdit: (taskId: string, updates: Partial<Task>) => void;
  availableTags: string[];
};

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

export function TaskCard({
  task,
  onDelete,
  onEdit,
  availableTags,
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);

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
    zIndex: isDragging ? 100 : 1,
    position: "relative" as const,
    cursor: "grab",
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`
          group flex flex-col gap-2 p-3 rounded-lg
          bg-slate-700/50 border border-slate-600
          hover:border-slate-500 hover:bg-slate-700/70
          ${isDragging ? "shadow-xl ring-2 ring-blue-500/50" : ""}
        `}
      >
        <div className="flex items-start justify-between gap-2">
          <span className="text-white flex-1" title={task.title}>
            {truncateText(task.title, 18)}
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="text-slate-400 hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Pen className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs rounded-full 
                bg-blue-500/10 text-blue-300 border border-blue-500/20
                flex items-center gap-1"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Task Detail Modal */}
      {isEditing && (
        <TaskDetailModal
          task={task}
          onClose={() => setIsEditing(false)}
          onSave={onEdit}
          availableTags={availableTags}
        />
      )}
    </>
  );
}
