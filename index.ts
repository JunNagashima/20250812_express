import express, { type Request, type Response } from "express";
import serverless from "serverless-http";
import dotenv from "dotenv";

// アプリケーションで動作するようにdotenvを設定する
dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (request: Request, response: Response) => {
  response.status(200).send("Hello World");
});

app.post("/", (request: Request, response: Response) => {
  response.status(200).json({ message: "POST request successful" });
});

// For serverless deployment
export const handler = serverless(app);

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
  }).on("error", (error) => {
    // エラーの処理
    throw new Error(error.message);
  });
}
