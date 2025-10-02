const express = require('express');
const app = express();

// ========== 路由处理函数 ==========
function helloWorld(req, res, next) {
    res.send('Hello World');
}

function goodbye(req, res, next) {
    res.send('Goodbye, guys!');
}

// ========== 用户对象 ==========
const userObj = {
    name: 'John Smith',
    email: 'john@smith.com'
};

// /user → 返回 JSON
app.get('/user', (req, res) => {
    res.json(userObj);
});

// /user/:userId → 返回带参数的 JSON
app.get('/user/:userId', (req, res) => {
    console.log(req.params.userId);

    res.json({
        userId: req.params.userId,
        firstName: 'John',
        lastName: 'Smith'
    });
});

// ========== 路由绑定 ==========
app.use('/hello', helloWorld);
app.use('/goodbye', goodbye);

// ========== 启动服务器 ==========
app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
