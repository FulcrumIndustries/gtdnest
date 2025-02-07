import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Tag, X, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type TaskInputProps = {
  onAddTask: (title: string, tags: string[]) => void;
  availableTags: string[];
  onAddTag: (tag: string) => void;
  onDeleteTag: (tag: string) => void;
};

export function TaskInput({
  onAddTask,
  availableTags,
  onAddTag,
  onDeleteTag,
}: TaskInputProps) {
  const [task, setTask] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.trim()) {
      onAddTask(task, selectedTags);
      setTask("");
      setSelectedTags([]);
      toast({
        title: "Task added",
        description: "Your task has been added successfully.",
      });
    }
  };

  const handleTagSelect = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim() && !availableTags.includes(newTag.trim())) {
      onAddTag(newTag.trim());
      setNewTag("");
      toast({
        title: "Tag added",
        description: "Your new tag has been added successfully.",
      });
    }
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags((current) => current.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="space-y-4 w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 h-12 text-base text-slate-200 transition-all duration-200 ease-in-out 
            focus-visible:ring-2 focus-visible:ring-slate-600 border-slate-600/20 bg-slate-800/20"
          />
          <Button
            type="submit"
            size="icon"
            className="h-12 w-12 rounded-full transition-all duration-200 hover:scale-105
            bg-[#508D69] hover:bg-[#508D69]/90"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </form>

      <div className="flex gap-2 flex-wrap">
        {availableTags.map((tag) => (
          <div key={tag} className="tag-enter">
            <button
              type="button"
              onClick={() => handleTagSelect(tag)}
              className={`
                px-2 py-1 rounded-full text-sm flex items-center gap-1
                transition-all duration-150 ease-out
                ${
                  selectedTags.includes(tag)
                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    : "bg-slate-700/50 text-slate-400 border border-slate-600/50 hover:bg-slate-700"
                }
              `}
            >
              <div className="inline-flex items-center gap-1.5 shrink-0">
                <Tag className="h-3 w-3 shrink-0" />
                <span className="truncate">{tag}</span>
              </div>
              <div className="w-px h-3.5 bg-slate-600/50 shrink-0" />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDeleteTag(tag);
                }}
                className="hover:text-red-400 transition-colors shrink-0 p-0.5"
                aria-label={`Delete ${tag} tag`}
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </button>
          </div>
        ))}
      </div>

      <form onSubmit={handleAddTag} className="flex gap-2">
        <Input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="Add a new tag..."
          className="flex-1 border-slate-600/20 text-slate-200 focus-visible:ring-slate-600 bg-slate-800/20"
        />
        <Button
          type="submit"
          size="sm"
          className="bg-[#508D69] hover:bg-[#508D69]/90"
        >
          Add Tag
        </Button>
      </form>
    </div>
  );
}
