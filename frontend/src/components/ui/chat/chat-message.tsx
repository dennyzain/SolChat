import { cn } from "../../../lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import { UserIcon } from "lucide-react";
import React, { type ReactNode } from "react";
import { motion, type HTMLMotionProps } from 'motion/react';
import { stringToGradient } from "../../../helper/generateGradientColor";

const chatMessageVariants = cva("flex gap-4 w-full", {
    variants: {
        variant: {
            default: "",
            bubble: "",
            full: "p-5",
        },
        type: {
            incoming: "justify-start items-center mr-auto",
            outgoing: "justify-end items-center ml-auto w-full",
        },
    },
    compoundVariants: [
        {
            variant: "full",
            type: "outgoing",
            className: "bg-muted",
        },
        {
            variant: "full",
            type: "incoming",
            className: "bg-background",
        },
    ],
    defaultVariants: {
        variant: "default",
        type: "incoming",
    },
});

interface MessageContextValue extends VariantProps<typeof chatMessageVariants> {
    id: string;
}

const ChatMessageContext = React.createContext<MessageContextValue | null>(
    null,
);

const useChatMessage = () => {
    const context = React.useContext(ChatMessageContext);
    return context;
};

// Root component
interface ChatMessageProps
    extends HTMLMotionProps<'div'>,
    VariantProps<typeof chatMessageVariants> {
    children?: React.ReactNode;
    id: string;
    timestamp: number;
}

const ChatMessage = React.forwardRef<HTMLDivElement, ChatMessageProps>(
    (
        {
            className,
            variant = "default",
            type = "incoming",
            id,
            children,
            ...props
        },
        ref,
    ) => {
        return (
            <ChatMessageContext.Provider value={{ variant, type, id }}>
                <motion.div
                    ref={ref}
                    className={cn(chatMessageVariants({ variant, type, className }))}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    {...props}
                >
                    {children}
                </motion.div>
            </ChatMessageContext.Provider>
        );
    },
);
ChatMessage.displayName = "ChatMessage";

// Avatar component

const chatMessageAvatarVariants = cva(
    "w-10 h-10 flex items-center rounded-full justify-center ring-1 shrink-0 bg-transparent overflow-hidden lg:w-13 lg:h-13",
    {
        variants: {
            type: {
                incoming: "ring-border bg-white ",
                outgoing: "ring-muted-foreground/30 bg-white",
            },
        },
        defaultVariants: {
            type: "incoming",
        },
    },
);

interface ChatMessageAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    imageSrc?: string;
    icon?: ReactNode;
    walletAddress?: string;
}

const ChatMessageAvatar = React.forwardRef<
    HTMLDivElement,
    ChatMessageAvatarProps
>(({ className, icon: iconProps, imageSrc, walletAddress, ...props }, ref) => {
    const context = useChatMessage();
    const type = context?.type ?? "incoming";
    const icon =
        iconProps ?? <UserIcon />;
    const bgStyle = walletAddress ? { background: stringToGradient(walletAddress) } : undefined;
    return (
        <div
            ref={ref}
            className={cn(chatMessageAvatarVariants({ type, className }))}
            style={bgStyle}
            {...props}
        >
            {imageSrc ? (
                <img
                    src={imageSrc}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                />
            ) : (
                <div className="translate-y-px [&_svg]:size-4 [&_svg]:shrink-0">
                    {icon}
                </div>
            )}
        </div>
    );
});
ChatMessageAvatar.displayName = "ChatMessageAvatar";


const chatMessageContentVariants = cva("flex flex-col gap-2", {
    variants: {
        variant: {
            default: "",
            bubble: "rounded-xl px-3 py-2",
            full: "",
        },
        type: {
            incoming: "",
            outgoing: "",
        },
    },
    compoundVariants: [
        {
            variant: "bubble",
            type: "incoming",
            className: "bg-white text-secondary-foreground",
        },
        {
            variant: "bubble",
            type: "outgoing",
            className: "bg-primary text-primary-foreground",
        },
    ],
    defaultVariants: {
        variant: "default",
        type: "incoming",
    },
});

interface ChatMessageContentProps extends React.HTMLAttributes<HTMLDivElement> {
    id?: string;
    content: string;
    walletAddress?: string;
    timestamp?: number;
}

const ChatMessageContent = React.forwardRef<
    HTMLDivElement,
    ChatMessageContentProps
>(({ className, content, children, walletAddress, timestamp, id, ...props }, ref) => {
    const context = useChatMessage();

    const variant = context?.variant ?? "default";
    const type = context?.type ?? "incoming";

    return (
        <div key={id} className={cn("flex flex-col justify-between text-xs text-black-pearl mb-1", type === "incoming" ? "items-start" : "items-end")}>
            <div className="flex items-center gap-2 py-2">
                <span className="truncate">{walletAddress?.substring(0, 9)}...</span>
                <span className="text-xs">{new Date(timestamp ?? 0).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</span>
            </div>
            <div
                ref={ref}
                className={cn(chatMessageContentVariants({ variant, type, className }))}
                {...props}
            >
                {content.length > 0 && <p className="text-sm font-light break-words whitespace-pre-wrap">{content}</p>}
                {children}
            </div>
        </div >
    );
});
ChatMessageContent.displayName = "ChatMessageContent";

export { ChatMessage, ChatMessageAvatar, ChatMessageContent }; 