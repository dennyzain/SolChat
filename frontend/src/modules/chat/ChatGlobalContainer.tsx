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
    const { userId, jwtToken } = useAuthStore()
    const [isConnectedChat, setIsConnectedChat] = useState(false);
    const socketRef = useRef<Socket | null>(null);

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
            }
            );
            setValue("");
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_error) {
            toast.error("Failed to send message. Please try again.");
        }
    };

    useEffect(() => {
        if (jwtToken) {
            fetchMessages();
        }
    }, [jwtToken]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    useEffect(() => {
        if (!jwtToken) return;
        socketRef.current = io(import.meta.env.VITE_API_URL, {
            auth: {
                token: jwtToken
            }
        })
        socketRef.current.on("newMessage", (message: ConversationMessage) => {
            setMessages((prev) => {
                if (prev.some((m) => m.id === message.id)) return prev;
                return [...prev, message];
            });
        });

        socketRef.current.on("connect", () => {
            if (jwtToken) {
                setIsConnectedChat(true);

            }
        });
        socketRef.current.on("connect_error", () => {
            toast.error("Failed to connect to chat server.");
            setIsConnectedChat(false);
        });

        socketRef.current.on("error", () => {
            toast.error("A socket error occurred.");
            setIsConnectedChat(false);
        });

        socketRef.current.on("reconnect_error", () => {
            toast.error("Reconnection to chat server failed.");
            setIsConnectedChat(false);
        });
        socketRef.current.on("disconnect", (reason) => {
            toast.error(`Disconnected: ${reason}`);
            setIsConnectedChat(false);
        });
        socketRef.current.on("reconnect_attempt", () => {
            toast.info("Reconnecting to chat server...");
        });

        socketRef.current.on("reconnect", () => {
            setIsConnectedChat(true);
        });

        return () => {
            socketRef.current?.disconnect();
            setIsConnectedChat(false);
        }
    }, [jwtToken]);


    return (
        <ChatGlobalComponent
            value={value}
            setValue={setValue}
            bottomRef={bottomRef}
            messages={messages}
            isConnected={isConnectedChat}
            userId={userId}
            handleSubmit={handleSubmit}
        />
    )
}