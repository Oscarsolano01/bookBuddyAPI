const express = require("express");
const app = express();


const PORT = 3000;

require("dotenv").config();
app.use(express.json());
const client = require("./db/client");

client.connect();

console.log(process.env.JWT_SECRET);
// app.use(express.json());

app.use("/api", require("./api"))

app.get("/", (req, res) => {
  res.send("Hello from our server");
});

app.use((error, req,res,next) => {
  console.log("error", error);
  res.send({
    message: "something went wrong"
  });
})

app.listen(PORT, () => {
  console.log(`server alive on port ${PORT}`);
});

