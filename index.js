const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const Sentiment = require("sentiment");
const config = require("./helper/config");
const formRoute = require("./routes/route");
const app = express();

//adding socket.io
const server = require("http").Server(app);
const io = require("socket.io")(server);

const PORT = process.env.PORT || 8000;

//connecting mongodb
mongoose
  .connect(config.mongoURL)
  .then(() => {
    console.log(`connected`);
  })
  .catch(err => {
    console.error(err);
  });

app.set("view engine", "ejs");

//serving static files
app.use(express.static(path.join(__dirname, "/public")));

//using bodyparser
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

//route
app.use(formRoute);

//establishing connection for socket.io
io.on("connection", socket => {

  socket.on("runanaysis", text => {
    const sentiment = new Sentiment();
    const result = sentiment.analyze(text);
    const { score, comparative, tokens, words, positive, negative } = result;
    socket.emit("result", result);
  });

  socket.on("disconnection", () => {
    console.log("disconnected....io...");
  });

});

server.listen(PORT, err => {
  if (err) throw err;
  console.log(`server is running at ${PORT}`);
});
