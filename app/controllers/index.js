module.exports.helloWorld = function (req, res) {
    res.send("Hello World");
};

module.exports.goodbye = function (req, res) {
    res.send("Goodbye, guys!");
};

module.exports.home = function (req, res) {
    res.json({ message: "Welcome to My Portfolio" });
};
