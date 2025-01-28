import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TaskInputProps {
  onAddTask: (task: string, tags?: string[]) => void;
  availableTags: string[];
  onAddTag: (tag: string) => void;
}

export const TaskInput = ({ onAddTask, availableTags, onAddTag }: TaskInputProps) => {
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

  return (
    <div className="space-y-4 w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 h-12 text-base transition-all duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-primary"
          />
          <Button
            type="submit"
            size="icon"
            className="h-12 w-12 rounded-full transition-all duration-200 hover:scale-105"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex gap-2 flex-wrap">
          {availableTags.map((tag) => (
            <Button
              key={tag}
              type="button"
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              size="sm"
              onClick={() => handleTagSelect(tag)}
              className="rounded-full"
            >
              {tag}
            </Button>
          ))}
        </div>
      </form>
      <form onSubmit={handleAddTag} className="flex gap-2">
        <Input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="Add a new tag..."
          className="flex-1"
        />
        <Button type="submit" size="sm">
          Add Tag
        </Button>
      </form>
    </div>
  );
};