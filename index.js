import app from "./app.js";
import { connectToDatabase } from "./config/dbConfig.js";

const port = process.env.PORT || 3000;

app.get("/", (_, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  connectToDatabase();
  console.log(`Server running at http://localhost:${port}`);
});
