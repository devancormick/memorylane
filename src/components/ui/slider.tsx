import * as React from "react";
import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    min?: number;
    max?: number;
    step?: number;
    value: number[];
    onValueChange?: (value: number[]) => void;
  }
>(({ className, min = 0, max = 100, step = 1, value, onValueChange, ...props }, ref) => {
  const [dragging, setDragging] = React.useState(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDragging(true);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    setDragging(false);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const rect = (ref as any)?.current?.getBoundingClientRect();
    if (!rect) return;

    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newValue = Math.round(((max - min) * percent + min) / step) * step;
    
    if (onValueChange) {
      onValueChange([newValue]);
    }
  };

  const percentage = ((value[0] - min) / (max - min)) * 100;

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      {...props}
    >
      <div className="relative h-2 w-full grow overflow-hidden rounded-full bg-neutral-200">
        <div
          className="absolute h-full bg-primary-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div
        className={cn(
          "absolute flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary-500 bg-white transition-transform",
          dragging && "scale-110"
        )}
        style={{ left: `calc(${percentage}% - 10px)` }}
      >
        <div
          className="h-2 w-2 rounded-full bg-primary-500"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerMove={handlePointerMove}
        />
      </div>
    </div>
  );
});
Slider.displayName = "Slider";

export { Slider };