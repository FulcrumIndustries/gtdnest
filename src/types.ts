export type TaskStatus = "today" | "tomorrow" | "next" | "waiting" | "someday";

export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  completed?: boolean;
  tags?: string[];
  description?: string;
}; 