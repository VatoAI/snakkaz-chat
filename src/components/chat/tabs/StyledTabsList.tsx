
import { TabsList } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export function StyledTabsList({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsList>) {
  return (
    <TabsList 
      className={cn(
        "w-full h-14 bg-cyberdark-900/80 backdrop-blur-sm border-b border-cybergold-500/30",
        "grid grid-cols-2 p-1 gap-2",
        "[&[data-orientation=horizontal]]:flex [&[data-orientation=vertical]]:flex-col",
        className
      )} 
      {...props} 
    />
  );
}
