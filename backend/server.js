import "dotenv/config";
import { app } from "./index.js";
import { connectDB } from "./src/config/connectDB.js";

const PORT = process.env.PORT;
const DB_URI = process.env.DB_URI;

await connectDB(DB_URI);

app.listen(PORT, () => {
    console.log("Express server started.");
});