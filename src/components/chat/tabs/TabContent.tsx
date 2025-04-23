
import { TabsContent } from "@/components/ui/tabs";

interface TabContentProps {
  value: string;
  children: React.ReactNode;
}

export const TabContent = ({ value, children }: TabContentProps) => {
  return (
    <TabsContent 
      value={value} 
      className="h-full m-0 p-0 data-[state=active]:animate-fadeIn bg-cyberdark-950/95"
    >
      {children}
    </TabsContent>
  );
};
