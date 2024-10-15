import app from "./app.js";
import { connectToDatabase } from "./config/dbConfig.js";
import { port } from "./config/dotenv.config.js";

app.get("/", (_, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  connectToDatabase();
  console.log(`Server running at http://localhost:${port}`);
});
