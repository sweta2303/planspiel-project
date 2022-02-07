const express = require("express");
const bodyParser = require("body-parser");
const app = express();
var path = require("path");
const cron = require("node-cron");
require("dotenv").config();
const prof = require("./ExtractInfoTUC");

const port = process.env.SERVER_PORT;

const swaggerUi = require("swagger-ui-express"),
  swaggerDocument = require("./swagger.json");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.post("/profs", prof.getProfsFromTUCWebsiteInsertToDB);
app.get("/profs", prof.fetchProfessorsfromDB);
app.put("/profs", prof.updateProfInterests);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});

