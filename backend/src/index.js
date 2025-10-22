import express from "express";
const app = express();

app.get("/", (req, res) => {
  res.send("Backend działa");
});

app.listen(4000, () => console.log("Server running on http://localhost:4000"));
