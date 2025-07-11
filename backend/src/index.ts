import express from "express";
import { Server } from "socket.io";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import authRoutes from "./routes/auth";
import cors from "cors";

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "index.html"));
});

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);

app.get("/messages", (req, res) => {
    res.send("Hello World");
});

io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("message", (message) => {
        console.log(message);
    });
});



server.listen(8080, () => {
    console.log("Server is running on port 8080");
});