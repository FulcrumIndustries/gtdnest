// Pastel colors with consistent alpha that work well with dark theme
export const taskColors = [
  'bg-blue-500/20 border-blue-500/30 hover:bg-blue-500/30',
  'bg-purple-500/20 border-purple-500/30 hover:bg-purple-500/30',
  'bg-emerald-500/20 border-emerald-500/30 hover:bg-emerald-500/30',
  'bg-amber-500/20 border-amber-500/30 hover:bg-amber-500/30',
  'bg-rose-500/20 border-rose-500/30 hover:bg-rose-500/30',
  'bg-cyan-500/20 border-cyan-500/30 hover:bg-cyan-500/30',
  'bg-indigo-500/20 border-indigo-500/30 hover:bg-indigo-500/30',
  'bg-teal-500/20 border-teal-500/30 hover:bg-teal-500/30',
] as const;

export const getRandomTaskColor = () => {
  return taskColors[Math.floor(Math.random() * taskColors.length)];
}; 