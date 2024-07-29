const express = require("express");
const { PrismaClient } = require("@prisma/client");

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
 * つぶやき投稿API
 * @route POST /post
 * @param {Object} req - リクエストオブジェクト
 * @param {Object} res - レスポンスオブジェクト
 */
router.post("/post", async (req, res) => {
  const { content } = req.body; // req.bodyから投稿内容を取得

  // contentに投稿内容がなかった場合
  if (!content) {
    return handleError(res, 400, "投稿内容がありません。");
  }

  // content, authorIdをprismaを用いて、dataに挿入
  try {
    const newPost = await prisma.post.create({
      data: {
        content,
        authorId: 27,
      },
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    return handleError(res, 500, "投稿中にエラーが発生しました。");
  }
});

module.exports = router;
