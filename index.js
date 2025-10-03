const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 连接数据库
connectDB();

// 路由
const indexRouter = require("./app/routers/index");
const userRouter = require("./app/routers/users");

app.use("/", indexRouter);
app.use("/api/users", userRouter);

// 启动服务器
app.listen(3000, () => {
    console.log("🚀 Server running at http://localhost:3000");
});
