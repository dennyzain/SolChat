import type { Request, Response } from "express";
import express from "express";

const app = express();
const port = 8080;

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});


