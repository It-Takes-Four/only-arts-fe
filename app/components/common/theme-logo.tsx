import { FullLogo } from "./logo";

interface ThemeLogoProps {
  className?: string;
  alt?: string;
}

export function ThemeLogo({ className = "h-16", alt = "OnlyArts Logo" }: ThemeLogoProps) {
  return <FullLogo className={className} alt={alt} />;
}
