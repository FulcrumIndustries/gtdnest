import { useState } from 'react';
import { X, Plus, Tag } from 'lucide-react';
import { Task } from '@/types';

type TaskDetailModalProps = {
  task: Task;
  onClose: () => void;
  onSave: (taskId: string, updates: Partial<Task>) => void;
  availableTags?: string[];
};

export function TaskDetailModal({ task, onClose, onSave, availableTags = [] }: TaskDetailModalProps) {
  const [editedTask, setEditedTask] = useState(task);
  const [newTag, setNewTag] = useState('');

  const handleAddTag = (tag: string) => {
    const normalizedTag = tag.trim().toLowerCase();
    if (normalizedTag && !editedTask.tags?.includes(normalizedTag)) {
      setEditedTask({
        ...editedTask,
        tags: [...(editedTask.tags || []), normalizedTag],
      });
    }
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditedTask({
      ...editedTask,
      tags: editedTask.tags?.filter(tag => tag !== tagToRemove) || [],
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-lg w-full max-w-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-white">Edit Task</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-300">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-slate-400">Title</label>
            <input
              type="text"
              value={editedTask.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg
                text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-400">Description</label>
            <textarea
              value={editedTask.description || ''}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg
                text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Add a more detailed description..."
            />
          </div>

          {/* Tags Section */}
          <div className="space-y-2">
            <label className="text-sm text-slate-400">Tags</label>
            
            {/* Current Tags */}
            <div className="flex flex-wrap gap-2 mb-2">
              {editedTask.tags?.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-sm rounded-full bg-blue-500/10 text-blue-300 
                    border border-blue-500/20 flex items-center gap-1 group"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-slate-400 hover:text-red-400"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            
            {/* Available Tags Section - Moved up for better visibility */}
            {availableTags.length > 0 && (
              <div className="mb-4 p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                <p className="text-sm text-slate-400 mb-2">Quick add from available tags:</p>
                <div className="flex flex-wrap gap-2">
                  {availableTags
                    .filter(tag => !editedTask.tags?.includes(tag))
                    .map(tag => (
                      <button
                        key={tag}
                        onClick={() => handleAddTag(tag)}
                        className="px-2 py-1 text-sm rounded-full bg-slate-700/50 
                          text-slate-400 hover:bg-blue-500/10 hover:text-blue-300 
                          transition-colors flex items-center gap-1"
                      >
                        <Plus className="h-3 w-3" />
                        {tag}
                      </button>
                    ))}
                </div>
              </div>
            )}
            
            {/* Custom Tag Input */}
            <div>
              <label className="text-xs text-slate-400 mb-2 block">Add custom tag:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag(newTag);
                    }
                  }}
                  placeholder="Type and press Enter..."
                  className="flex-1 px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg
                    text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleAddTag(newTag)}
                  className="px-3 py-2 bg-blue-500/10 text-blue-300 rounded-lg 
                    hover:bg-blue-500/20 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t border-slate-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-400 hover:text-slate-300"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(task.id, editedTask);
              onClose();
            }}
            className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
} 