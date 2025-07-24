import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface SearchProps extends React.ComponentProps<typeof Input> {
  onSearch?: (value: string) => void
}

export function SearchInput({ className, onSearch, ...props }: SearchProps) {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search..."
        className="pl-10 h-10 bg-background/50 border-border/50 focus:bg-background focus:border-border"
        onChange={(e) => onSearch?.(e.target.value)}
        {...props}
      />
    </div>
  )
}
