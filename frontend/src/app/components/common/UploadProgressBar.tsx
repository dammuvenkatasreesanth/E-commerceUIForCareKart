export function UploadProgressBar({ percent }: { percent: number }) {
  return (
    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-1.5">
      <div className="h-full bg-primary rounded-full transition-[width] duration-150" style={{ width: `${Math.min(100, Math.max(0, percent))}%` }} />
    </div>
  );
}
