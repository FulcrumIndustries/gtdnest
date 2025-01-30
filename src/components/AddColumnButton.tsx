import { Plus } from "lucide-react";

type Props = {
  onClick: () => void;
};

export function AddColumnButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600/30 hover:bg-blue-600/40 text-blue-400 rounded-lg transition-colors"
    >
      <Plus className="h-5 w-5" />
      Add Column
    </button>
  );
}
