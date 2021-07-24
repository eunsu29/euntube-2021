import express from "express";
import morgan from "morgan";

const PORT = 4000;

const app = express();
const logger = morgan("dev");

const handleHome = (req, res) => {
  return res.send("<h1>Home</h1>");
};

app.use(logger);
app.get("/", handleHome);

const handelListening = () =>
  console.log(`Server listening on http://localhost:${PORT}`);

app.listen(PORT, handelListening);
