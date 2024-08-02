const express = require("express");
const { PrismaClient } = require("@prisma/client");
const isAuthenticated = require("../middlewares/isAuthenticated");

const router = express.Router();
const prisma = new PrismaClient();

/**
 * ログインユーザー取得用API
 * @route GET /find
 * @param {Object} req - リクエストオブジェクト
 * @param {Object} res - レスポンスオブジェクト
 */
router.get("/find", isAuthenticated, async (req, res) => {
  try {
    // ユーザーをIDで検索
    const user = await prisma.user.findUnique({ where: { id: req.userId } });

    // ユーザーが見つからない場合の処理
    if (!user) {
      return handleError(res, 404, "ユーザーが見つかりませんでした。");
    }

    // ユーザー情報をレスポンス
    return sendUserResponse(res, user);
  } catch (error) {
    console.error(error);
    return handleError(res, 500, "ユーザー情報取得中にエラーが発生しました。");
  }
});

/**
 * ユーザー情報をレスポンスする関数
 * @param {Object} res - レスポンスオブジェクト
 * @param {Object} user - ユーザーオブジェクト
 */
function sendUserResponse(res, user) {
  res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
    },
  });
}

/**
 * エラーハンドリングの関数
 * @param {Object} res - レスポンスオブジェクト
 * @param {number} statusCode - ステータスコード
 * @param {string} message - エラーメッセージ
 */
function handleError(res, statusCode, message) {
  res.status(statusCode).json({ error: message });
}
