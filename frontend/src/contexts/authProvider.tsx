import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { toast } from "sonner"

interface AuthContextType {
    isAuthenticated: boolean
    jwtToken: string | null
    isAuthenticating: boolean
    authenticate: () => Promise<void>
    logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const { publicKey, signMessage, connected } = useWallet()
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [jwtToken, setJwtToken] = useState<string | null>(null)
    const [isAuthenticating, setIsAuthenticating] = useState(false)

    // Auto-authenticate when wallet connects
    useEffect(() => {
        if (connected && publicKey && !isAuthenticated) {
            authenticate()
        }
    }, [connected, publicKey])

    // Clear auth when wallet disconnects
    useEffect(() => {
        if (!connected) {
            logout()
        }
    }, [connected])

    const authenticate = async () => {
        if (!publicKey || !signMessage) {
            toast.error("Wallet not connected")
            return
        }

        setIsAuthenticating(true)

        try {
            // Create authentication message
            const message = `Sign this message to authenticate with Solana Chat.\n\nWallet: ${publicKey.toString()}\nTimestamp: ${Date.now()}`
            const encodedMessage = new TextEncoder().encode(message)

            // Sign the message
            const signature = await signMessage(encodedMessage)

            // In a real app, you'd send this to your backend
            // const response = await fetch('/api/auth', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({
            //     publicKey: publicKey.toString(),
            //     signature: Array.from(signature),
            //     message
            //   })
            // })

            // For demo purposes, create a mock JWT
            const mockJWT = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(
                JSON.stringify({
                    publicKey: publicKey.toString(),
                    timestamp: Date.now(),
                }),
            )}.mock_signature_${Date.now()}`

            setJwtToken(mockJWT)
            setIsAuthenticated(true)
            toast.success("Successfully authenticated!")
        } catch (error) {
            console.error("Authentication failed:", error)
            toast.error("Authentication failed. Please try again.")
        } finally {
            setIsAuthenticating(false)
        }
    }

    const logout = () => {
        setIsAuthenticated(false)
        setJwtToken(null)
        setIsAuthenticating(false)
    }

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                jwtToken,
                isAuthenticating,
                authenticate,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}

