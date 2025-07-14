import jwt from "jsonwebtoken";
import { prisma } from "../prisma/db";
import { JWT_SECRET } from "../helper/varEnv";
import type { NextFunction, Request, Response } from "express";
import type { Socket } from "socket.io";

export const authenticateSocket = async (socket: Socket, next: any) => {
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

        socket.data.user = session.user;
        next();
    } catch (error) {
        next(new Error('Authentication failed'));
    }
};

export const authenticateToken = async (req: Request, res: any, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        const session = await prisma.session.findUnique({
            where: { token },
            include: { user: true }
        });

        if (!session || session.expiresAt < new Date()) {
            return res.status(401).json({ error: 'Token expired or invalid' });
        }

        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid token' });
    }
};
