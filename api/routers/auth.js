const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();
const prisma = new PrismaClient();

/**
 * エラーハンドリング関数
 * @param {Object} res - レスポンスオブジェクト
 * @param {number} statusCode - ステータスコード
 * @param {string} message - エラーメッセージ
 * @returns {Object} - JSON形式のエラーレスポンス
 */
function handleError(res, statusCode, message) {
  return res.status(statusCode).json({ error: message });
}

/**
 * 新規ユーザー登録API
 * @route POST /register
 * @param {Object} req - リクエストオブジェクト
 * @param {Object} res - レスポンスオブジェクト
 */
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    /*
    ユーザーをデータベースに作成
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
  } catch (error) {
    console.error(error);
    return handleError(res, 500, "ユーザー登録中にエラーが発生しました。");
  }
});

/**
 * ユーザーログインAPI
 * @route POST /login
 * @param {Object} req - リクエストオブジェクト
 * @param {Object} res - レスポンスオブジェクト
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // emailを検索
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return handleError(res, 401, "そのようなユーザーは存在しません。");
    }

    // パスワードの確認
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return handleError(res, 401, "そのパスワードは間違っています。");
    }

    // JWTトークンの生成
    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    return res.json({ token });
  } catch (error) {
    console.error(error);
    return handleError(res, 500, "ログイン中にエラーが発生しました。");
  }
});

module.exports = router;
