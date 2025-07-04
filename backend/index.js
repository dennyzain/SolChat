import express from "express";
import { WebSocketServer } from "ws";

const app = express();
const server = app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
const wss = new WebSocketServer({ server });

app.route("/").get((req, res) => {
    wss.on("connection", (ws) => {
        console.log("Client connected");
    });
    
    wss.on("message", (message) => {
        console.log("Message received: ", message);
    });
    
    wss.on("error", (error) => {
        console.log("Error: ", error);
    });
    
    wss.on("close", () => {
        console.log("Client disconnected"); 
    });
});
