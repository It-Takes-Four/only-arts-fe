import { useTheme } from "../core/theme-context";

interface LogoProps {
  className?: string;
  alt?: string;
  variant?: 'full' | 'icon';
}

export function Logo({ className = "h-8", alt = "OnlyArts Logo", variant = 'icon' }: LogoProps) {
  const { theme } = useTheme();
  
  const logoSrc = variant === 'full' 
    ? (theme === 'dark' 
        ? "/onlyarts-full-logo-dark.svg" 
        : "/onlyarts-full-logo-light.svg")
    : (theme === 'dark' 
        ? "/onlyarts-logo-dark.svg" 
        : "/onlyarts-logo-light.svg");

  return (
    <img 
      src={logoSrc} 
      alt={alt} 
      className={className}
    />
  );
}

export function FullLogo({ className = "h-16", alt = "OnlyArts Logo" }: Omit<LogoProps, 'variant'>) {
  return <Logo variant="full" className={className} alt={alt} />;
}

export function IconLogo({ className = "h-8", alt = "OnlyArts Logo" }: Omit<LogoProps, 'variant'>) {
  return <Logo variant="icon" className={className} alt={alt} />;
}
