import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../../store";
import { instance } from "../../services/interceptor";
import { Socket } from "socket.io-client";
import { toast } from "sonner";
import { io } from "socket.io-client";
import ChatGlobalComponent from "./component/ChatGlobalComponent";

interface ConversationMessage {
    id: string,
    userId: string,
    content: string,
    walletAddress: string,
    createdAt: Date
}

export default function ChatGlobalContainer() {
    const [value, setValue] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<ConversationMessage[]>([]);
    const { isAuthenticated, isAuthenticating, userId, jwtToken } = useAuthStore()
    const isConnected = !isAuthenticating && isAuthenticated;
    const socketRef = useRef<Socket | null>(null);

    const formatWalletAddress = (address: string) => {
        if (!address || address.length <= 8) return address
        return `${address.slice(0, 4)}...${address.slice(-4)}`
    }
    const fetchMessages = async () => {
        const { data } = await instance.get('/messages');
        setMessages(data as ConversationMessage[]);
    };

    const handleSubmit = async () => {
        try {
            if (!value.trim()) return;
            socketRef.current?.emit("sendMessage", {
                message: value,
                userId: userId,
            });
            setValue("");
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_error) {
            toast.error("Failed to send message. Please try again.");
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);


    useEffect(() => {
        socketRef.current = io("http://localhost:8080", {
            auth: {
                token: jwtToken
            }
        })
        socketRef.current.on("newMessage", (message: ConversationMessage) => {
            setMessages((prev) => {
                if (prev.some((m) => m.id === message.id)) return prev;
                return [...prev, message];
            });
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        });

        socketRef.current.on("connect", () => {
            console.log("Connected to chat server");
        });

        socketRef.current.on("disconnect", () => {
            console.log("Disconnected from chat server");
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <ChatGlobalComponent
            value={value}
            setValue={setValue}
            bottomRef={bottomRef}
            messages={messages}
            isConnected={isConnected}
            userId={userId}
            formatWalletAddress={formatWalletAddress}
            handleSubmit={handleSubmit}
        />
    )
}