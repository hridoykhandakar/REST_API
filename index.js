const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.set("view engine", "ejs");

// data source
mongoose
  .connect("mongodb://localhost:27017/wikiDB")
  .then(() => {
    console.log("connect success");
  })
  .catch((err) => console.log(err));

// data schemas
const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("Article", articleSchema);

// routes

app
  .route("/articles")
  .get((req, res) => {
    Article.find((err, article) => {
      if (err) {
        console.log(err);
      } else {
        res.json(article);
      }
    });
  })
  .post((req, res) => {
    const title = req.body.title;
    const content = req.body.post;

    const article = new Article({ title, content });
    article.save((err) => {
      if (!err) {
        res.send("success");
      } else {
        res.send("err");
      }
    });
  })
  .delete((req, res) => {
    Article.deleteMany((err) => {
      if (!err) {
        res.send("success");
      } else {
        res.send("err");
      }
    });
  });

app
  .route("/articles/:articleId")
  .get((req, res) => {
    const articleId = req.params.articleId;
    Article.findById(articleId, (err, article) => {
      if (!err) {
        res.send(article);
      } else {
        res.send("err");
      }
    });
  })
  .put(async (req, res) => {
    const _id = req.params.articleId;
    console.log(_id);
    await Article.updateOne(
      { _id },
      // { $set: req.body },
      { title: req.body.title, content: req.body.post },
      { overwrite: true },
      (err) => {
        if (!err) {
          res.send("success");
        } else {
          res.send(err);
        }
      }
    );
  })
  .delete(async (req, res) => {
    Article.findOneAndDelete({ _id: req.params.articleId }, (err) => {
      if (!err) res.send("success");
      else res.send(err);
    });
  })
  .patch(async (req, res) => {
    console.log(req.params.articleId);
    let data = await Article.updateOne(
      { _id: req.params.articleId },
      { $set: req.body }
    );
    res.send(data);
  });

app.listen(port, () => {
  console.log(`server listening on ${port}`);
});
