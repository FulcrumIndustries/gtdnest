import { useDragLayer } from "react-beautiful-dnd";
import { Task } from "@/components/TaskList";

export const CustomDragLayer = () => {
  const { isDragging, currentOffset, active } = useDragLayer((monitor) => ({
    isDragging: monitor.isDragging(),
    currentOffset: monitor.getSourceClientOffset(),
    active: monitor.getItem(),
  }));

  if (!isDragging || !currentOffset || !active) return null;

  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        transform: `translate(${currentOffset.x}px, ${currentOffset.y}px)`,
        width: "240px",
      }}
    >
      <div className="bg-slate-800/80 backdrop-blur-sm p-3 rounded-lg border border-slate-700/50 shadow-xl">
        <div className="text-sm text-slate-300 truncate">
          {active.task.title}
        </div>
        {active.task.tags && (
          <div className="flex flex-wrap gap-1 mt-2">
            {active.task.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs rounded-full bg-slate-700/50 text-slate-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
