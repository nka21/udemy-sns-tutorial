const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

// ローカルサーバーの構築
const app = express();

const PORT = 8000;

// インスタンス化
const prisma = new PrismaClient();

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

app.listen(PORT, () => console.log(`server is running on Port ${PORT}`));
