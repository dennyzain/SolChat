# SolChat

SolChat is a chat application built on Solana. It allows users to chat with each other on a global chat room.

## Setup & Running Guide

This guide will help you run the SolChat application, which consists of a Bun/Express/Prisma backend and a React/Vite frontend. The app uses Solana wallet authentication and real-time chat via Socket.IO.

## Prerequisites

- **Node.js** (for frontend, if not using Bun)
- **Bun** (v1.2.1 or later) – [Install Bun](https://bun.sh/docs/installation)
- **Docker** (optional, for containerized setup)
- **PostgreSQL** database (local or remote)

---

## 1. Backend Setup

### a. Install Dependencies

```bash
cd backend
bun install
```

### b. Environment Variables

Create a `.env` file in the `backend/` directory. At minimum, you need:

```
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>
JWT_SECRET=your_jwt_secret
```

Adjust the values as needed for your environment.

### c. Database Migration

Run the following to set up your database schema:

```bash
bun run prisma:migrate
```

### d. Start the Backend Server

For development (with hot reload):

```bash
bun run dev
```

Or for production:

```bash
bun run start
```

The backend will run on [http://localhost:8080](http://localhost:8080).

---

## 2. Frontend Setup

### a. Install Dependencies

```bash
cd frontend
bun install
```
Or, if you prefer npm/yarn/pnpm:
```bash
npm install
# or
yarn install
# or
pnpm install
```

### b. Environment Variables

If your frontend needs environment variables, create a `.env` file in `frontend/`. (No required variables are detected by default, but add as needed.)

### c. Start the Frontend Dev Server

```bash
bun run dev
```
Or, with npm/yarn/pnpm:
```bash
npm run dev
```

The frontend will run on [http://localhost:5173](http://localhost:5173).

---

## 3. Docker Setup (Optional)

### a. Backend

```bash
cd backend
docker build -t solchat-backend .
docker run --env-file .env -p 8080:8080 solchat-backend
```

### b. Frontend

```bash
cd frontend
docker build -t solchat-frontend .
docker run -p 5173:5173 solchat-frontend
```

---

## 4. Authentication Flow

This document outlines the step-by-step process for authenticating a user using their wallet with SWIS. It includes the challenge-response mechanism for proving ownership of a wallet and generating a JWT token for access.

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


## 5. Useful Scripts

From the `backend/` directory:

- `bun run dev` – Start backend in dev mode
- `bun run start` – Start backend in prod mode
- `bun run prisma:migrate` – Run DB migrations
- `bun run prisma:studio` – Open Prisma Studio

From the `frontend/` directory:

- `bun run dev` or `npm run dev` – Start frontend dev server
- `bun run build-prod` or `npm run build` – Build frontend for production
- `bun run preview` or `npm run preview` – Preview production build

---

## 6. Notes

- The backend expects the frontend to run on `http://localhost:5173` (see CORS settings).
- The backend listens on port `8080`.
- The frontend uses Vite and runs on port `5173` by default.
- Make sure your PostgreSQL database is running and accessible.



## Tech Stack

- Frontend: React, Vite, TailwindCSS, Shadcn UI
- Backend: Bun, Express, Prisma, PostgreSQL
- Database: PostgreSQL
- Authentication: Solana wallet
- Chat: Socket.IO