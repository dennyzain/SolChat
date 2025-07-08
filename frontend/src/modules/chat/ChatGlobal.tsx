import { useState, useRef, useEffect } from "react";
import { ChatInput } from "../../components/ui/chat/chat-input";
import {
    ChatMessage,
    ChatMessageAvatar,
    ChatMessageContent,
} from "../../components/ui/chat/chat-message";
import { motion } from "motion/react";
import { useAuth } from "../../hooks/useAuth";
import { ScrollArea } from "../../components/ui/scroll-area";
import clsx from "clsx";



interface ConversationMessage {
    id: string;
    walletAddress: string;
    message: string;
    type: "user" | "assistant";
    timestamp: number;
}

const messages: ConversationMessage[] = [
    {
        id: "1",
        walletAddress: "0xUserWallet1",
        message: "Can you tell me a story? Maybe something about a magical forest?",
        type: "user",
        timestamp: Date.now() - 1000 * 60 * 10,
    },
    {
        id: "2",
        walletAddress: "0xAssistantWallet",
        message: "Of course! I'd love to tell you a story about the Whispering Woods. Would you like to hear it?",
        type: "assistant",
        timestamp: Date.now() - 1000 * 60 * 9,
    },
    {
        id: "3",
        walletAddress: "0xUserWallet1",
        message: "Yes, please! I'm excited to hear it!",
        type: "user",
        timestamp: Date.now() - 1000 * 60 * 8,
    },
    {
        id: "4",
        walletAddress: "0xAssistantWallet",
        message: "Deep in the heart of the Whispering Woods, there lived a young fox named Luna with fur as silver as moonlight. Unlike other foxes, Luna had the magical ability to speak with the ancient trees that surrounded her home.",
        type: "assistant",
        timestamp: Date.now() - 1000 * 60 * 7,
    },
    {
        id: "5",
        walletAddress: "0xAssistantWallet",
        message:
            "One day, Luna discovered that the oldest tree in the forest had fallen silent. This was very unusual, as this particular oak tree loved telling stories about the forest's history. Concerned, Luna decided to investigate.",
        type: "assistant",
        timestamp: Date.now() - 1000 * 60 * 6,
    },
    {
        id: "6",
        walletAddress: "0xUserWallet1",
        message: "Oh no! What happened to the old oak tree?",
        type: "user",
        timestamp: Date.now() - 1000 * 60 * 5,
    },
    {
        id: "7",
        walletAddress: "0xAssistantWallet",
        message:
            "As Luna approached the ancient oak, she noticed something glowing at its roots - a tiny crystal that pulsed with a soft blue light. The tree had been protecting this crystal for centuries, and now it was losing its power.",
        type: "assistant",
        timestamp: Date.now() - 1000 * 60 * 4,
    },
    {
        id: "8",
        walletAddress: "0xAssistantWallet",
        message:
            "Luna knew she had to help. She gathered dewdrops from spider webs at dawn, collected starlight in flower petals at night, and asked the wind to share its oldest songs. With these magical ingredients, she restored the crystal's power.",
        type: "assistant",
        timestamp: Date.now() - 1000 * 60 * 3,
    },
    {
        id: "9",
        walletAddress: "0xUserWallet1",
        message: "Did it work? Did the old oak tree start speaking again?",
        type: "user",
        timestamp: Date.now() - 1000 * 60 * 2,
    },
    {
        id: "10",
        walletAddress: "0xAssistantWallet",
        message:
            "Yes! The moment the crystal began glowing brightly again, the old oak's leaves rustled with joy, and its deep, wise voice returned. It thanked Luna for her help and shared even more wonderful stories about the forest's ancient magic.",
        type: "assistant",
        timestamp: Date.now() - 1000 * 60 * 1,
    },
    {
        id: "11",
        walletAddress: "0xAssistantWallet",
        message:
            "From that day forward, Luna became known as the Guardian of the Whispering Woods, and she made sure to visit the old oak tree every day to hear its wonderful tales.",
        type: "assistant",
        timestamp: Date.now(),
    },
    {
        id: "12",
        walletAddress: "0xUserWallet1",
        message:
            "That was such a beautiful story! I loved how Luna helped save the old oak tree's voice.",
        type: "user",
        timestamp: Date.now() + 1000 * 60 * 1,
    },
    {
        id: "13",
        walletAddress: "0xAssistantWallet",
        message:
            "I'm glad you enjoyed it! The story teaches us that even the smallest acts of kindness can help preserve the magic in our world.",
        type: "assistant",
        timestamp: Date.now() + 1000 * 60 * 2,
    },
];

export default function ChatGlobal() {
    const [value, setValue] = useState("");
    const [chatMessages, setChatMessages] = useState(messages);
    const bottomRef = useRef<HTMLDivElement>(null);
    const { isAuthenticated } = useAuth();
    const isConnected = true && isAuthenticated;
    const userWallet = "0xUserWallet1"; // Replace with actual wallet from context


    const formatWalletAddress = (address: string) => {
        if (address.length <= 8) return address
        return `${address.slice(0, 4)}...${address.slice(-4)}`
    }

    const handleSubmit = () => {
        if (!value.trim()) return;
        setChatMessages(prev => [
            ...prev,
            {
                id: (prev.length + 1).toString(),
                walletAddress: userWallet,
                message: value,
                type: "user",
                timestamp: Date.now(),
            }
        ]);
        setValue("");
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);

    return (<>
        <motion.div className="relative w-[87%] mx-auto overflow-hidden items-center gap-2 px-3 rounded-xl bg-gradient-to-b from-neutral-100/80 to-neutral-100 border border-neutral-200/50 group transition-all duration-300 lg:w-[60%] hover:border-neutral-300"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex flex-col gap-2 px-10">
                <h1 className="text-2xl font-bold">Global Chat Room</h1>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className={clsx(
                        "w-2 h-2 rounded-full animate-pulse",
                        isConnected ? "bg-green-500" : "bg-red-500"
                    )} />
                    {isConnected ? "Connected to chat" : "Disconnected"}
                </div>
            </div>

            <ScrollArea className={clsx("w-[95%] relative px-5 mx-auto pb-16 pt-5 h-[700px] lg:w-[90%]", {
                "h-[500px]": !isConnected,
            })}>
                <div className="space-y-4">

                    {
                        !isConnected || chatMessages.length === 0 ? (
                            <div className="flex justify-center items-center text-muted-foreground py-8">
                                <p>
                                    No messages yet. {isConnected ? "Start the conversation!" : "Connect your wallet to see messages."}
                                </p>
                            </div>
                        ) : (
                            chatMessages.map((message) => (
                                <ChatMessage
                                    key={message.id}
                                    id={message.id}
                                    type={message.type === "user" ? "outgoing" : "incoming"}
                                    variant="bubble"
                                    walletAddress={message.walletAddress}
                                    timestamp={message.timestamp}
                                >
                                    {message.type === "assistant" && (
                                        <ChatMessageAvatar />
                                    )}
                                    <ChatMessageContent content={message.message} walletAddress={formatWalletAddress(message.walletAddress)} timestamp={message.timestamp} />
                                    {message.type === "user" && (
                                        <ChatMessageAvatar />
                                    )}
                                </ChatMessage>
                            ))
                        )
                    }
                    <div ref={bottomRef} />
                </div>
            </ScrollArea>
            {isConnected ?
                <ChatInput type="text" placeholder="Type your message..." value={value} onChange={(e) => setValue(e.target.value)} handleSubmit={handleSubmit} containerClassName="flex items-center gap-2 left-0 absolute bottom-0 w-full px-10 justify-center text-black-pearl bg-white backdrop-blur-lg p-4" />
                :
                <div className="text-center gap-2 left-0 absolute bottom-0 w-full text-black-pearl bg-white backdrop-blur-lg p-4">
                    <p className="text-sm text-gray-500">Please connect your wallet to chat</p>
                </div>
            }
        </motion.div >
    </>
    );
}
