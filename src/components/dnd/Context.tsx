import { DndContext, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { useState } from 'react';
import { Task } from '@/types';

export const DndProvider = ({ children, onDragEnd }: { 
  children: React.ReactNode,
  onDragEnd: (event: DragEndEvent) => void 
}) => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  return (
    <DndContext 
      sensors={sensors} 
      onDragEnd={(event) => {
        setActiveTask(null);
        onDragEnd(event);
      }}
      onDragStart={(event) => {
        const task = event.active.data.current as Task;
        setActiveTask(task);
      }}
    >
      {children}
      <DragOverlay dropAnimation={{
        duration: 200,
        easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
      }}>
        {activeTask && (
          <div className="p-3 rounded-lg bg-slate-700/95 border-2 border-blue-500/50 shadow-xl
            backdrop-blur-sm w-72 transform-gpu rotate-3">
            <span className="text-white">{activeTask.title}</span>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}; 