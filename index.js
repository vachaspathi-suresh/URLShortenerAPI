require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const urlValidate = require("./utils/urlValidate");
const urlRoutes = require("./routes/url-routes");
const redirectRoutes = require("./routes/redirect-routes");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api", urlRoutes);
app.use("/", redirectRoutes);
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.DB_URL, { useNewUrlParser: true })
  .then(() => {
    try {
      app.listen(process.env.PORT || 5000, () => {
        console.log("Server is up and listening");
      });
    } catch (err) {
      console.error(err);
    }
  })
  .catch((err) => {
    console.log("ERROR_CONNECTING_DATABASE", err);
  });
