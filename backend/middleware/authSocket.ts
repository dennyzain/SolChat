import jwt from "jsonwebtoken";
import { prisma } from "../prisma/db";
import { JWT_SECRET } from "../helper/varEnv";

export const authenticateSocket = async (socket: any, next: any) => {
    try {
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error('Authentication token required'));
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        const session = await prisma.session.findUnique({
            where: { token },
            include: { user: true }
        });

        if (!session || session.expiresAt < new Date()) {
            return next(new Error('Token expired or invalid'));
        }

        socket.user = session.user;
        next();
    } catch (error) {
        next(new Error('Authentication failed'));
    }
};
