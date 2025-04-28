import { MoonStar, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface ThemeToggleProps {
    variant?: "default" | "outline" | "ghost";
    size?: "default" | "sm" | "lg" | "icon";
}

export function ThemeToggle({ variant = "ghost", size = "icon" }: ThemeToggleProps) {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant={variant}
                    size={size}
                    onClick={toggleTheme}
                    className={`${isDark
                        ? "text-cybergold-400 hover:text-cybergold-300"
                        : "text-cyberblue-700 hover:text-cyberblue-800"}`}
                >
                    {isDark ? (
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                    ) : (
                        <MoonStar className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                    )}
                    <span className="sr-only">
                        {isDark ? "Bytt til lys modus" : "Bytt til mørk modus"}
                    </span>
                </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
                <p>{isDark ? "Bytt til lys modus" : "Bytt til mørk modus"}</p>
            </TooltipContent>
        </Tooltip>
    );
}