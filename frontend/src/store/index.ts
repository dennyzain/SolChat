import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useWallet } from "@solana/wallet-adapter-react"
import { toast } from "sonner"
import instance from "../services/interceptor"
import { useEffect, useCallback } from "react"
import { jwtDecode } from "jwt-decode"
import type { WalletContextState } from '@solana/wallet-adapter-react';

interface AuthState {
    isAuthenticated: boolean
    jwtToken: string | null
    userId: string | null
    isAuthenticating: boolean
    setJwtToken: (token: string | null) => void
    setIsAuthenticated: (auth: boolean) => void
    setIsAuthenticating: (authing: boolean) => void
    setUserId: (userId: string | null) => void
    logout: () => void
    authenticate: (wallet: WalletContextState) => Promise<void>
}

export const useAuthStore = create<AuthState>()(persist((set) => ({
    isAuthenticated: false,
    jwtToken: null,
    isAuthenticating: false,
    userId: null,
    setJwtToken: (token) => set({ jwtToken: token }),
    setIsAuthenticated: (auth) => set({ isAuthenticated: auth }),
    setIsAuthenticating: (authing) => set({ isAuthenticating: authing }),
    setUserId: (userId) => set({ userId }),
    logout: () => {
        set({ isAuthenticated: false, jwtToken: null, isAuthenticating: false, userId: null })
    },
    authenticate: async (wallet) => {
        await authenticateWithWallet(
            wallet,
            (token) => set({ jwtToken: token }),
            (auth) => set({ isAuthenticated: auth }),
            (authing) => set({ isAuthenticating: authing }),
            (userId) => set({ userId })
        );
    }
}), {
    name: "solchat-auth",
}))

export async function authenticateWithWallet(
    wallet: WalletContextState,
    setJwtToken: (token: string | null) => void,
    setIsAuthenticated: (auth: boolean) => void,
    setIsAuthenticating: (authing: boolean) => void,
    setUserId: (userId: string | null) => void
) {
    if (!wallet.publicKey || !wallet.signMessage) {
        toast.error("Wallet not connected")
        return
    }
    setIsAuthenticating(true)
    try {
        const { data: responseChallenge } = await instance.post('/auth/challenge', {
            walletAddress: wallet.publicKey.toString(),
        })
        const message = new TextEncoder().encode(responseChallenge.createdChallenge?.message)
        const signature = await wallet.signMessage(message)
        const { data: responseVerify } = await instance.post('/auth/verify', {
            walletAddress: wallet.publicKey.toString(),
            signature: Array.from(signature),
            message: responseChallenge.createdChallenge?.message,
            nonce: responseChallenge.createdChallenge?.nonce,
        })

        const decodedToken: { userId: string } = jwtDecode(responseVerify.token)
        setUserId(decodedToken?.userId)
        setJwtToken(responseVerify.token)
        setIsAuthenticated(true)
        toast.success("Successfully authenticated!")
    } catch (error) {
        console.error("Authentication failed:", error)
        setIsAuthenticated(false)
        toast.error("Authentication failed. Please try again.")
    } finally {
        setIsAuthenticating(false)
    }
}

export function useAuthWithWallet() {
    const wallet = useWallet()
    const { setJwtToken, setIsAuthenticated, setIsAuthenticating, logout, isAuthenticated, setUserId } = useAuthStore()

    const authenticate = useCallback(() => authenticateWithWallet(wallet, setJwtToken, setIsAuthenticated, setIsAuthenticating, setUserId), [wallet, setJwtToken, setIsAuthenticated, setIsAuthenticating, setUserId])

    useEffect(() => {
        if (wallet.connected && wallet.publicKey && !isAuthenticated) {
            authenticate()
        }
    }, [wallet.connected, wallet.publicKey, isAuthenticated, authenticate])

    useEffect(() => {
        if (!wallet.connected) {
            logout()
        }
    }, [wallet.connected, logout])

    return { ...useAuthStore(), authenticate, wallet }
}

