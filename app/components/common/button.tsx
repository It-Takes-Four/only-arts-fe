import * as React from "react"
import { Button as ShadcnButton, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { type VariantProps } from "class-variance-authority"

interface CustomButtonProps extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <ShadcnButton
        ref={ref}
        className={cn("cursor-pointer", className)}
        variant={variant}
        size={size}
        asChild={asChild}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
export type { CustomButtonProps as ButtonProps }
