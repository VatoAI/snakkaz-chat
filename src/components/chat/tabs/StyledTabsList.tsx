
import { TabsList } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export function StyledTabsList({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsList>) {
  return (
    <TabsList 
      className={cn(
        "w-full h-auto min-h-[3rem] bg-cyberdark-900/95 backdrop-blur-sm border-b border-cybergold-500/30",
        "grid grid-cols-3 p-1 gap-1 sticky top-0 z-30",
        "transition-all duration-300 ease-in-out shadow-lg",
        "[&[data-orientation=horizontal]]:flex [&[data-orientation=vertical]]:flex-col",
        "overflow-x-auto scrollbar-hide",
        className
      )} 
      {...props} 
    />
  );
}
