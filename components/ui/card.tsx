import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-card/80 backdrop-blur-sm p-6 shadow-sm",
        "transition-all duration-500 ease-out",
        "hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20",
        "dark:hover:shadow-primary/10",
        className
      )}
      {...props}
    >
      {props.children}
      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-accent/0 group-hover:from-primary/[0.03] group-hover:to-accent/[0.03] transition-all duration-500 rounded-2xl -z-10" />
    </div>
  );
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-lg font-semibold tracking-tight group-hover:text-primary transition-colors duration-300",
        className
      )}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-muted-foreground leading-relaxed", className)} {...props} />;
}
