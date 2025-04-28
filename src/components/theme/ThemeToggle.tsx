import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className={`rounded-full ${theme === "dark"
                    ? "text-cybergold-400 hover:text-cybergold-300 hover:bg-cyberdark-700"
                    : "text-blue-600 hover:text-blue-500 hover:bg-gray-200"
                }`}
            aria-label="Endre tema"
        >
            {theme === "dark" ? (
                <Sun className="h-5 w-5" />
            ) : (
                <Moon className="h-5 w-5" />
            )}
        </Button>
    );
}