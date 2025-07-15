import { ChatInput } from "../../../components/ui/chat/chat-input";
import {
    ChatMessage,
    ChatMessageAvatar,
    ChatMessageContent,
} from "../../../components/ui/chat/chat-message";
import { motion } from "motion/react";
import { ScrollArea } from "../../../components/ui/scroll-area";
import clsx from "clsx";
import type { RefObject, Dispatch, SetStateAction, } from "react";

interface ConversationMessage {
    id: string,
    userId: string,
    content: string,
    walletAddress: string,
    createdAt: Date
}

interface ChatGlobalComponentProps {
    value: string;
    setValue: Dispatch<SetStateAction<string>>;
    bottomRef: RefObject<HTMLDivElement | null>
    messages: ConversationMessage[];
    isConnected: boolean;
    userId: string | null;
    handleSubmit: () => Promise<void>;
}

export default function ChatGlobalComponent({
    value,
    setValue,
    bottomRef,
    messages,
    isConnected,
    userId,
    handleSubmit
}: ChatGlobalComponentProps) {

    return (
        <motion.div className="relative w-[87%] mx-auto overflow-hidden items-center gap-2 px-3 rounded-xl bg-gradient-to-b from-neutral-100/80 to-neutral-100 border border-neutral-200/50 group transition-all duration-300 lg:w-[60%] hover:border-neutral-300"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex flex-col gap-1 px-10 py-3">
                <h1 className="text-xl font-light">Global Chat Room</h1>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className={clsx(
                        "w-2 h-2 rounded-full animate-pulse",
                        isConnected ? "bg-green-500" : "bg-red-500"
                    )} />
                    {isConnected ? "Connected to chat" : "Disconnected"}
                </div>
            </div>

            <ScrollArea className={clsx("w-[95%] relative px-5 mx-auto border rounded-xl border-neutral-300 pb-16 pt-5 h-[700px] lg:w-[90%] ", {
                "h-[500px]": !isConnected,
            })}>
                <div className="space-y-4">

                    {
                        !isConnected || messages.length === 0 ? (
                            <div className="flex justify-center items-center text-muted-foreground py-8">
                                <p>
                                    No messages yet. {isConnected ? "Start the conversation!" : "Connect your wallet to see messages."}
                                </p>
                            </div>
                        ) : (
                            messages && messages.map((message) => (
                                <ChatMessage
                                    key={message.id}
                                    id={message.id}
                                    type={message.userId === userId ? "outgoing" : "incoming"}
                                    variant="bubble"
                                    timestamp={new Date(message.createdAt).getTime()}
                                >
                                    {message.userId !== userId && (
                                        <ChatMessageAvatar walletAddress={message.walletAddress} />
                                    )}
                                    <ChatMessageContent content={message.content} walletAddress={message.walletAddress} timestamp={new Date(message.createdAt).getTime()} />
                                    {message.userId === userId && (
                                        <ChatMessageAvatar />
                                    )}
                                </ChatMessage>
                            ))
                        )
                    }
                    <div className="h-1" ref={bottomRef} />
                </div>
            </ScrollArea>
            {isConnected ?
                <ChatInput type="text" placeholder="Type your message..." value={value} onChange={(e) => setValue(e.target.value)} disabled={!isConnected} handleSubmit={handleSubmit} containerClassName="flex items-center gap-2 left-0 absolute bottom-0 w-full px-10 justify-center text-black-pearl bg-white backdrop-blur-lg p-4" />
                :
                <div className="text-center gap-2 left-0 absolute bottom-0 w-full text-black-pearl bg-white backdrop-blur-lg p-4">
                    <p className="text-sm text-gray-500">Please connect your wallet to chat</p>
                </div>
            }
        </motion.div >
    );
}
