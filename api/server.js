const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// ローカルサーバーの構築
const app = express();

const PORT = 8000;

// インスタンス化
const prisma = new PrismaClient();

// req.bodyにアクセスするため、JSON形式に設定
app.use(express.json());

// 新規ユーザー登録API
app.post("/api/auth/register", async (req, res) => {
  // フォームから送信されるデータ
  const { username, email, password } = req.body;

  // bcryptで、passwordをハッシュ化
  // 10とは、saltRoundという、ハッシュ化の強度
  // saltRoundが高すぎると、処理に時間がかかる
  const hashedPassword = await bcrypt.hash(password, 10);

  /*
    https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/querying-the-database-typescript-postgresql
  */
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });

  return res.json({ user });
});

// ユーザーログインAPI
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  // emailを検索
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res
      .status(401)
      .json({ error: "そのようなユーザーは存在しません。" });
  }

  // パスワードの確認
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ error: "そのパスワードは間違っています。" });
  }

  // JWTトークンの生成
  const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });

  return res.json({ token });
});

app.listen(PORT, () => console.log(`server is running on Port ${PORT}`));
