const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
require("./libs/sequelize");
const path = require("path");

dotenv.config();

const app = express();

const port = process.env.PORT || 3001;

const routerApi = require("./routes");

app.use(express.static(path.join(__dirname, "public")));

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Dream team backend");
});

routerApi(app);

app.listen(port, () => {
  console.log(`Backend is running`);
});
