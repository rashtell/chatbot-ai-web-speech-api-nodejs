"use strict";

//your client access token
const APIAI_TOKEN = "65e9df1a38704f95b568cc1148f20e03";
// a unique sesseion id
const APIAI_SESSION_ID = "ThisIsASesseionIdAndCanBeAnyThingLessThan32Bytes";
//port
const PORT = process.env.PORT || 5000;


const express = require("express");
const app = express();

app.use(express.static(__dirname + "/views"));
app.use(express.static(__dirname + "/public"));

const server = app.listen(PORT, () => {
  console.log("express server is listening on port ", PORT);
});

const io = require("socket.io")(server);
const apiai = require("apiai")(APIAI_TOKEN);

io.on("connection", function(socket) {
  console.log("a user connected");
  
  socket.on("chat message", text => {
    console.log("Message: ", text);

    let apiaiReq = apiai.textRequest(text, { sessionId: APIAI_SESSION_ID });

    apiaiReq.on("response", response => {
      console.log("apiai response: ", response)
      let aiText = response.result.fulfillment.speech;
      console.log("Bot reply: " + aiText);
      socket.emit("bot-reply", aiText);
    });

    apiaiReq.on("error", error => {
      console.log("error: ", error);
    });

    apiaiReq.end();
    console.log("apiaiReq end");
  });
});

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

