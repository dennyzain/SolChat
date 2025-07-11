
# SWIS Authentication Flow

This document outlines the step-by-step process for authenticating a user using their wallet with SWIS. It includes the challenge-response mechanism for proving ownership of a wallet and generating a JWT token for access.

## Authentication Flow

### 1. Client → Server: Request Login

The client sends a request to log in with a specific wallet address.

```http
POST /auth/challenge
Content-Type: application/json

{
  "walletAddress": "ABC123"
}
```

**Response:**
```json
{
  "message": "Login to SolChat...",
  "nonce": "xyz789"
}
```

### 2. Server → Client: Request Signature

The server generates a message and sends it to the client, asking the user to sign it. The message is used to prove ownership of the wallet address.

**Server sends:**
```json
{
  "message": "Login to SolChat...",
  "nonce": "xyz789"
}
```

### 3. Client: Sign the Message

The client signs the provided message using their private key from the wallet.

```javascript
const signature = await window.solana.signMessage(encodedMessage);
```

### 4. Client → Server: Submit Signature

The client then sends the signed message back to the server for verification.

```http
POST /auth/verify
Content-Type: application/json

{
  "walletAddress": "ABC123",
  "signature": [123, 45, 67, ...], // Array of bytes
  "message": "Login to SolChat...",
  "nonce": "xyz789"
}
```

### 5. Server: Verify Signature

The server performs the following verification steps:

- **Check Nonce Validity:** Ensure that the nonce is still valid (not expired).
- **Verify Signature:** Check if the signature matches the provided message and wallet address.
- **Generate JWT:** If the signature is valid, generate a JWT token to authenticate the user.

### 6. Server → Client: Provide Access Token

If the signature is valid, the server responds with an access token.

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

https://solana.com/id/developers/cookbook/wallets/sign-message
