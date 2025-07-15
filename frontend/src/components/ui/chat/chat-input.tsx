import { cn } from "../../../lib/utils"
import { Send } from "lucide-react"
import { Button } from "../buttons/classic"

interface ChatInputProps extends React.ComponentProps<"input"> {
    handleSubmit: () => void
    containerClassName?: string
}

function ChatInput({ className, type, handleSubmit, value, disabled, containerClassName, ...props }: ChatInputProps) {
    const onFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSubmit();
    };
    return (
        <form onSubmit={onFormSubmit} className={containerClassName}>
            <input
                type={type}
                data-slot="input"
                className={cn(
                    "file:text-foreground placeholder:text-muted-foreground selection:bg-primary w-[90%] selection:text-primary-foreground border-input flex h-9 min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                    "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
                    className
                )}
                disabled={disabled}
                value={value}
                {...props}
            />
            <Button type="submit" disabled={disabled || !value} ><Send /></Button>
        </form>
    )
}

export { ChatInput }
