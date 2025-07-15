import type { Server } from "socket.io";
import { prisma } from "../prisma/db";
import type { Request, Response } from "express";
import { authenticateSocket } from "../middleware/auth";

export const getMessages = async (req: Request, res: Response) => {

    const messages = await prisma.message.findMany({
        include: {
            user: true
        },
        orderBy: {
            createdAt: "asc"
        }
    });


    const formattedMessages = messages.map(msg => ({
        userId: msg.userId,
        content: msg.content,
        walletAddress: msg.user.walletAddress,
        createdAt: msg.createdAt
    }));

    res.json(formattedMessages);
}

export const registerChatSocket = (io: Server) => {
    io.use(authenticateSocket)
    io.on("connection", (socket) => {
        console.log("a user connected");
        socket.on("sendMessage", async (context) => {
            const msg = await prisma.message.create({
                data: {
                    content: context.message,
                    userId: context.userId
                },
                include: {
                    user: true

                }
            })
            const formattedMessages = {
                id: msg.id,
                userId: msg.userId,
                content: msg.content,
                walletAddress: msg.user.walletAddress,
                createdAt: msg.createdAt
            }
            io.emit("newMessage", formattedMessages)
        });
    });
}
