import "dotenv/config";
import "./db";
import "./models/Video";
import "./models/User";
import app from "./server";

const port = process.env.PORT;

const handelListening = () =>
  console.log(`✅ Server listening on http://localhost:${port}`);

app.listen(port, handelListening);
