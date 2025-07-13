"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { useAuthStore } from '../store'
import { LiquidButton } from "./ui/buttons/liquid"
import { Button } from "./ui/buttons/classic"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { ChevronDown, Copy, ExternalLink, LogOut, Wallet, CheckCircle, Key } from "lucide-react"
import { useState, useEffect } from "react"
import { useConnection } from "@solana/wallet-adapter-react"
import { LAMPORTS_PER_SOL } from "@solana/web3.js"

export function WalletButton() {
    const { connection } = useConnection()
    const { publicKey, wallet, disconnect, connecting, connected } = useWallet()
    const walletContext = useWallet()
    const { setVisible } = useWalletModal()
    const { isAuthenticated, isAuthenticating, authenticate, logout } = useAuthStore()
    const [balance, setBalance] = useState<number | null>(null)
    const [copied, setCopied] = useState(false)

    // Fetch wallet balance
    useEffect(() => {
        if (publicKey && connected) {
            connection
                .getBalance(publicKey)
                .then((balance) => {
                    setBalance(balance / LAMPORTS_PER_SOL)
                })
                .catch(() => {
                    setBalance(null)
                })
        } else {
            setBalance(null)
        }
    }, [publicKey, connected, connection])

    const copyAddress = async () => {
        if (publicKey) {
            await navigator.clipboard.writeText(publicKey.toString())
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const formatAddress = (address: string) => {
        return `${address.slice(0, 4)}...${address.slice(-4)}`
    }

    const openInExplorer = () => {
        if (publicKey) {
            window.open(`https://explorer.solana.com/address/${publicKey.toString()}?cluster=devnet`, "_blank")
        }
    }

    if (connecting || isAuthenticating) {
        return (
            <LiquidButton disabled className="gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                {connecting ? "Connecting..." : "Authenticating..."}
            </LiquidButton>
        )
    }

    if (connected && publicKey) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2 min-w-[200px] justify-between bg-transparent">
                        <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                                <AvatarImage src={wallet?.adapter.icon || "/placeholder.svg"} alt={wallet?.adapter.name} />
                                <AvatarFallback>
                                    <Wallet className="w-3 h-3" />
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-start">
                                <div className="flex items-center gap-1">
                                    <span className="text-sm font-medium">{formatAddress(publicKey.toString())}</span>
                                    {isAuthenticated && <CheckCircle className="w-3 h-3 text-green-500" />}
                                </div>
                                {balance !== null && <span className="text-xs text-muted-foreground">{balance.toFixed(4)} SOL</span>}
                            </div>
                        </div>
                        <ChevronDown className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                    <div className="p-3">
                        <div className="flex items-center gap-3 mb-3">
                            <Avatar className="w-10 h-10">
                                <AvatarImage src={wallet?.adapter.icon || "/placeholder.svg"} alt={wallet?.adapter.name} />
                                <AvatarFallback>
                                    <Wallet className="w-5 h-5" />
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">{wallet?.adapter.name}</span>
                                    <Badge variant={isAuthenticated ? "default" : "secondary"} className="text-xs">
                                        {isAuthenticated ? (
                                            <>
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                Authenticated
                                            </>
                                        ) : (
                                            "Connected"
                                        )}
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">Devnet</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Address:</span>
                                <code className="text-xs bg-muted px-2 py-1 rounded">{formatAddress(publicKey.toString())}</code>
                            </div>
                            {balance !== null && (
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Balance:</span>
                                    <span className="text-sm font-medium">{balance.toFixed(4)} SOL</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <DropdownMenuSeparator />

                    {!isAuthenticated && (
                        <>
                            <DropdownMenuItem onClick={() => authenticate(walletContext)} className="gap-2">
                                <Key className="w-4 h-4" />
                                Authenticate for Chat
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                        </>
                    )}

                    <DropdownMenuItem onClick={copyAddress} className="gap-2">
                        <Copy className="w-4 h-4" />
                        {copied ? "Copied!" : "Copy Address"}
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={openInExplorer} className="gap-2">
                        <ExternalLink className="w-4 h-4" />
                        View in Explorer
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={() => {
                        disconnect()
                        logout()
                    }} className="gap-2 text-red-600">
                        <LogOut className="w-4 h-4" />
                        Disconnect
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }

    return (
        <LiquidButton onClick={() => setVisible(true)} className="gap-2">
            <Wallet className="w-4 h-4" />
            Connect Wallet
        </LiquidButton>
    )
}
