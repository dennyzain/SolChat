import express from "express";
import { Server } from "socket.io";
import { createServer } from "node:http";
import authRoutes from "./routes/auth";
import chatRoutes from "./routes/chat";
import cors from "cors";
import { authenticateSocket, authenticateToken } from "./middleware/auth";
import { registerChatSocket } from "./controllers/chat";

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"]
    }
});

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"]
}));
app.use(express.json());
app.use("/auth", authRoutes);
app.use(authenticateToken)
app.use("/messages", chatRoutes);
registerChatSocket(io);


server.listen(8080, () => {
    console.log("Server is running on port 8080");
});

