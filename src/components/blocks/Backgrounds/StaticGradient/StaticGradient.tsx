import React from "react";

interface StaticGradientProps extends React.HTMLAttributes<HTMLDivElement> {
  baseColor?: [number, number, number];
  variant?: 'subtle' | 'vibrant' | 'dark';
}

export const StaticGradient: React.FC<StaticGradientProps> = ({
  baseColor = [0.125, 0.1, 0.3],
  variant = 'subtle',
  className = '',
  ...props
}) => {
  const [r, g, b] = baseColor.map(c => Math.round(c * 255));
  
  const getGradientClass = () => {
    switch (variant) {
      case 'subtle':
        return `bg-gradient-to-br from-[rgb(${r},${g},${b})] via-[rgb(${Math.round(r * 1.2)},${Math.round(g * 1.2)},${Math.round(b * 1.4)})] to-[rgb(${Math.round(r * 0.8)},${Math.round(g * 0.8)},${Math.round(b * 1.2)})]`;
      case 'vibrant':
        return `bg-gradient-to-br from-[rgb(${r},${g},${b})] via-[rgb(${Math.round(r * 1.5)},${Math.round(g * 1.3)},${Math.round(b * 1.8)})] to-[rgb(${Math.round(r * 1.2)},${Math.round(g * 1.1)},${Math.round(b * 1.6)})]`;
      case 'dark':
        return `bg-gradient-to-br from-[rgb(${Math.round(r * 0.5)},${Math.round(g * 0.5)},${Math.round(b * 0.8)})] via-[rgb(${r},${g},${b})] to-[rgb(${Math.round(r * 0.3)},${Math.round(g * 0.3)},${Math.round(b * 0.6)})]`;
      default:
        return `bg-gradient-to-br from-[rgb(${r},${g},${b})] to-[rgb(${Math.round(r * 1.2)},${Math.round(g * 1.2)},${Math.round(b * 1.4)})]`;
    }
  };

  return (
    <div
      className={`w-full h-full ${getGradientClass()} ${className}`}
      {...props}
    >
      {/* Optional animated overlay for subtle movement */}
      <div 
        className="absolute inset-0 opacity-30 animate-subtle-shift"
        style={{
          background: `linear-gradient(45deg, 
            rgba(${r}, ${g}, ${b}, 0.1) 0%, 
            rgba(${Math.round(r * 1.3)}, ${Math.round(g * 1.3)}, ${Math.round(b * 1.5)}, 0.2) 50%, 
            rgba(${r}, ${g}, ${b}, 0.1) 100%)`,
        }}
      />
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes subtle-shift {
            0% { transform: translateX(-2%) translateY(-1%) scale(1.01); }
            100% { transform: translateX(2%) translateY(1%) scale(1.02); }
          }
          .animate-subtle-shift {
            animation: subtle-shift 20s ease-in-out infinite alternate;
          }
        `
      }} />
    </div>
  );
};

export default StaticGradient;
