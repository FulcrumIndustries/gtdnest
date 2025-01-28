import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TaskInputProps {
  onAddTask: (task: string) => void;
}

export const TaskInput = ({ onAddTask }: TaskInputProps) => {
  const [task, setTask] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.trim()) {
      onAddTask(task);
      setTask("");
      toast({
        title: "Task added",
        description: "Your task has been added successfully.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-2xl mx-auto">
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
    </form>
  );
};