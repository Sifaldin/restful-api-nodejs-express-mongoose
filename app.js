const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

const articleSchema = {
  title: String,
  content: String
}

const Article = mongoose.model("Article", articleSchema);

app.route('/articles')
.get((req, res) => {
  Article.find((e, articles) => {
    if (!e) { res.send(articles); }
    else { res.send(e); }
  });
})
.post((req, res) => {
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  })

  newArticle.save((e) => {
    if (!e) { res.send("Successfully posted...") }
    else { res.send("Failed to post...") }
  });
})
.delete((req, res) => {
  Article.deleteMany((e) =>{
    if (!e) { res.send("Successfully deleted all...") }
    else { res.send(e) }
    })
});

//////////////////////////////specific articles///////////
app.route('/articles/:articleTitle')
.get((req, res) => {
  Article.findOne({title: req.params.articleTitle}, (e, foundArticle) => {
    if (foundArticle) { res.send(foundArticle); }
    else { res.send(e); }
  });
})
.put((req, res)=>{
  Article.replaceOne(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    (e)=>{if(!e){res.send('Successfully updated all...')}
          else{res.send(e)}});
})
.patch((req, res)=>{
  Article.updateOne(
    {title: req.params.articleTitle},
    {$set: req.body},
    (e)=>{if(!e){res.send('Successfully updated parameter...')}
          else{res.send(e)}});
})
.delete((req, res) => {
  Article.deleteOne( {title: req.params.articleTitle},
    (e) =>{
    if (!e) { res.send("Successfully deleted one...") }
    else { res.send(e) }
    })
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});

