const express = require("express");
import { PrismaClient } from "@prisma/client";

// ローカルサーバーの構築
const app = express();

const PORT = 8000;

// インスタンス化
const prisma = new PrismaClient();

// 新規ユーザー登録API
app.post("/api/auth/register", async (req, res) => {
  // フォームから送信されるデータ
  const { username, email, password } = req.body;

  /*
    https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/querying-the-database-typescript-postgresql
  */
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password,
    },
  });

  return res.json({ user });
});

app.listen(PORT, () => console.log(`server is running on Port ${PORT}`));
