const express = require("express");

// ローカルサーバーの構築
const app = express();

const PORT = 8000;

app.listen(PORT, () => console.log(`server is running on Port ${PORT}`));
