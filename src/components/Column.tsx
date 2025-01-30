import { useState } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { TaskCard } from './TaskCard';
import { Pen, Trash2, X } from 'lucide-react';
import { Task } from '@/types';

type ColumnProps = {
  id: string;
  title: string;
  tasks: Task[];
  onAddTask: (title: string) => void;
  onDeleteTask: (id: string) => void;
  onDeleteColumn: () => void;
  onRenameColumn: (newTitle: string) => void;
  onEditTask: (taskId: string, newTitle: string) => void;
  availableTags: string[];
};

export function Column({
  id,
  title,
  tasks,
  onAddTask,
  onDeleteTask,
  onDeleteColumn,
  onRenameColumn,
  onEditTask,
  availableTags,
}: ColumnProps) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className="w-72 flex-shrink-0 bg-slate-800/50 rounded-lg p-4"
    >
      <div className="flex items-center justify-between mb-4">
        {isEditing ? (
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={() => {
              setIsEditing(false);
              onRenameColumn(editedTitle);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setIsEditing(false);
                onRenameColumn(editedTitle);
              }
            }}
            className="bg-slate-700/50 border border-slate-600 rounded px-2 py-1 text-white"
            autoFocus
          />
        ) : (
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <button
              onClick={() => setIsEditing(true)}
              className="text-slate-400 hover:text-slate-300"
            >
              <Pen className="h-3 w-3" />
            </button>
          </div>
        )}
        <button
          onClick={onDeleteColumn}
          className="text-slate-400 hover:text-red-400"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      
      <div className="mb-4">
        <form onSubmit={(e) => {
          e.preventDefault();
          if (newTaskTitle.trim()) {
            onAddTask(newTaskTitle.trim());
            setNewTaskTitle('');
          }
        }}>
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Add task..."
            className="w-full px-3 py-2 rounded bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>
      </div>

      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={() => onDeleteTask(task.id)}
              onEdit={(taskId, updates) => onEditTask(taskId, updates)}
              availableTags={availableTags}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
} 