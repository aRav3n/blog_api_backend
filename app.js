const express = require("express");
const app = express();
const router = require("./routes/router");

const jwt = require("jsonwebtoken");

app.use(express.urlencoded({ extended: false }));

app.use("/", router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log("Express app listening on port" + PORT + "!")
);
