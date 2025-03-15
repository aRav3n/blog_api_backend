const express = require("express");
const app = express();
const router = require("./routes/router");

const cors = require("cors");
const corsOptionsDelegate = require("./controllers/corsController");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", cors(corsOptionsDelegate), router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));
