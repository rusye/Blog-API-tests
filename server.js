const express = require("express");
const morgan = require("morgan");

const app = express();

const blogPostsRouter = require("/blogPostsRouter");

app.use(morgan("common"));

app.get("/", (req, res) => {
    res.sendFile(__dirname);
});

app.use("/blog-posts", blogPostsRouter);

app.listen(process.env.PORT || 8080, () => {
    console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});