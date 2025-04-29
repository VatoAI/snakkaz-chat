import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Laptop } from "lucide-react";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`rounded-md w-9 h-9 ${
                        theme === "dark"
                            ? "text-cybergold-400 hover:text-cybergold-300 hover:bg-cyberdark-700"
                            : "text-cyberblue-500 hover:text-cyberblue-400 hover:bg-gray-200"
                    }`}
                    aria-label="Velg tema"
                >
                    {theme === "dark" ? (
                        <Moon className="h-[1.2rem] w-[1.2rem]" />
                    ) : theme === "light" ? (
                        <Sun className="h-[1.2rem] w-[1.2rem]" />
                    ) : (
                        <Laptop className="h-[1.2rem] w-[1.2rem]" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem 
                    onClick={() => setTheme("light")}
                    className={theme === "light" ? "bg-accent text-accent-foreground" : ""}
                >
                    <Sun className="mr-2 h-4 w-4" />
                    <span>Lys</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                    onClick={() => setTheme("dark")}
                    className={theme === "dark" ? "bg-accent text-accent-foreground" : ""}
                >
                    <Moon className="mr-2 h-4 w-4" />
                    <span>Mørk</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                    onClick={() => setTheme("system")}
                    className={theme === "system" ? "bg-accent text-accent-foreground" : ""}
                >
                    <Laptop className="mr-2 h-4 w-4" />
                    <span>System</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}