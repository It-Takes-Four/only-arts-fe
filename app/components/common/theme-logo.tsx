import { useTheme } from "../core/theme-context";

interface ThemeLogoProps {
  className?: string;
  alt?: string;
}

export function ThemeLogo({ className = "h-16", alt = "OnlyArts Logo" }: ThemeLogoProps) {
  const { theme } = useTheme();
  
  const logoSrc = theme === 'dark' 
    ? "/onlyarts-full-logo-dark.svg" 
    : "/onlyarts-full-logo-light.svg";

  return (
    <img 
      src={logoSrc} 
      alt={alt} 
      className={className}
    />
  );
}
