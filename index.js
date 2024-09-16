const express = require("express");
const app = express();

const PORT = 3000;

require("dotenv").config();
app.use(express.json());
const client = require("./db/client");

client.connect();

server.use(cors());

console.log(process.env.JWT_SECRET);
// app.use(express.json());

app.use("/api", require("./api"));

app.get("/", (req, res) => {
  res.send("Hello from our server");
});

app.get("*", (req, res) => {
  res.status(404).send({
    error: "404 - Not Found",
    message: "No Route found for the requested URL",
  });
});
app.use((error, req, res, next) => {
  console.log("error", error);
  if (res.statusCode < 400) res.status(500);
  res.send({
    message: error.message,
    name: error.name,
  });
});

app.listen(PORT, () => {
  console.log(`server alive on port ${PORT}`);
});
