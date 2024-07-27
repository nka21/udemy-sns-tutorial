const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoute = require("./routers/auth");

// 環境変数の設定
dotenv.config();

// Expressアプリケーションの作成
const app = express();

// ポート番号の設定
const PORT = 8000;

// ミドルウェアの設定
// req.bodyにアクセスするため、JSON形式に設定
app.use(express.json());

// CORSの設定
app.use(cors());

// ルートの設定
app.use("/api/auth", authRoute);

// サーバーの起動
app.listen(PORT, () => console.log(`server is running on Port ${PORT}`));
