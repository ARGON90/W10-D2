const express = require("express");
const app = express();
app.use(express.json());
require("express-async-errors");

app.use("/static", express.static("assets"));

console.log("Hello!");

app.use((req, res, next) => {
  console.log("Method is", req.method);
  console.log("URL Path", req.url);
  console.log("StatusCode");
  res.on("finish", () => {
    console.log(res.statusCode);
  });
  next();
});

// For testing purposes, GET /
app.get("/", (req, res) => {
  res.json(
    "Express server running. No content provided at root level. Please use another route."
  );
});

// For testing express.json middleware
app.post("/test-json", (req, res, next) => {
  // send the body as JSON with a Content-Type header of "application/json"
  // finishes the response, res.end()
  res.json(req.body);
  next();
});

// For testing express-async-errors
app.get("/test-error", async (req, res) => {
  throw new Error("Hello World!");
});

app.use((req, res, next) => {
  let error = new Error("That don't work.");
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  let statuscode = err.status || 500;
  res.status(statuscode);

  console.log(err.message);
  res.json({
    message: err.message || "Stop that",
    "Error Code": statuscode,
  });
});

const port = 5000;
app.listen(port, () => console.log("Server is listening on port", port));
