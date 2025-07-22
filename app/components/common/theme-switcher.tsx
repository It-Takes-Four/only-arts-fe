import { MoonIcon, SunIcon } from '@heroicons/react/24/solid'
import { useTheme } from "../core/theme-context";
import { Button } from "@/components/ui/button";

export function ThemeSwitcher() {
    const {toggleTheme, theme} = useTheme();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleTheme()}
            className="relative"
        >
            <SunIcon className={`h-5 w-5 transition-all ${theme === 'dark' ? 'rotate-90 scale-0' : 'rotate-0 scale-100'}`} />
            <MoonIcon className={`absolute h-5 w-5 transition-all ${theme === 'dark' ? 'rotate-0 scale-100' : '-rotate-90 scale-0'}`} />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}