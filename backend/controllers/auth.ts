import type { Request, Response } from "express";
import { verifySignature } from "../helper/verifySign";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma/db";
import { JWT_SECRET } from "../helper/varEnv";


const challengeFunction = async (req: Request, res: Response) => {
    const { walletAddress } = req.body

    if (!walletAddress) {
        return res.status(400).json({ error: "Wallet address is required" });
    }

    const challenge = {
        message: `Sign this message to authenticate with SolChat!\nWallet: ${walletAddress}\nTime: ${Date.now()}`,
        nonce: Math.random().toString(36).substring(7)
    };

    const createdChallenge = await prisma.challenge.create({
        data: {
            message: challenge.message,
            nonce: challenge.nonce,
            expiresAt: new Date(Date.now() + 1000 * 60 * 5)
        }
    });

    if (!createdChallenge) {
        return res.status(400).json({ error: "Failed to create challenge" });
    }

    res.json({ createdChallenge });
};

const verifyFunction = async (req: Request, res: Response) => {
    try {
        const { walletAddress, signature, nonce, message } = req.body


        if (!walletAddress || !signature || !nonce || !message) {
            return res.status(400).json({ error: `Missing required fields: ${!walletAddress ? "walletAddress" : ""} ${!signature ? "signature" : ""} ${!nonce ? "nonce" : ""} ${!message ? "message" : ""}` });
        }

        const challenge = await prisma.challenge.findUnique({
            where: {
                nonce: nonce
            }
        });

        if (!challenge) {
            return res.status(400).json({ error: "Invalid nonce" });
        }

        if (challenge.expiresAt < new Date()) {
            return res.status(400).json({ error: "Challenge expired" });
        }

        const isVerified = verifySignature(message, signature, walletAddress);

        if (!isVerified) {
            return res.status(400).json({ error: "Invalid signature" });
        }

        let user = await prisma.user.findUnique({
            where: { walletAddress }
        });

        if (!user) {
            user = await prisma.user.create({
                data: { walletAddress }
            });
        }

        await prisma.challenge.delete({
            where: {
                nonce: nonce
            }
        });

        const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

        const token = jwt.sign({ userId: user.id, walletAddress }, JWT_SECRET, { expiresIn: "1h" });


        await prisma.session.create({
            data: {
                userId: user.id,
                token,
                expiresAt
            }
        });

        res.json({
            token,
            user: {
                id: user.id,
                walletAddress: user.walletAddress
            }
        });
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
};

export { challengeFunction, verifyFunction };