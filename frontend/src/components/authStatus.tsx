import { useAuth } from "../hooks/useAuth"
import { Badge } from "./ui/badge"
import { CheckCircle, XCircle, Clock } from "lucide-react"

export function AuthStatus() {
    const { isAuthenticated, jwtToken, isAuthenticating } = useAuth()

    const truncateToken = (token: string) => {
        if (token.length <= 20) return token
        return `${token.slice(0, 10)}...${token.slice(-10)}`
    }

    if (isAuthenticating) {
        return (
            <div className="flex items-center gap-2">
                <Badge variant="outline" className="gap-1">
                    <Clock className="w-3 h-3" />
                    Authenticating...
                </Badge>
            </div>
        )
    }

    if (isAuthenticated && jwtToken) {
        return (
            <div className="flex justify-between items-center gap-2 lg:justify-start">
                <Badge variant="default" className="gap-1 bg-green-500">
                    <CheckCircle className="w-3 h-3" />
                    Authenticated
                </Badge>
                <code className="text-xs bg-muted px-2 py-1 rounded">JWT: {truncateToken(jwtToken)}</code>
            </div>
        )
    }

    return (
        <Badge variant="destructive" className="gap-1">
            <XCircle className="w-3 h-3" />
            Not Authenticated
        </Badge>
    )
}
