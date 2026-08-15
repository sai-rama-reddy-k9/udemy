const dotenv = require("dotenv");
const connectDB = require("./config/db");
const app = require("./src/app");

dotenv.config();
const port = process.env.PORT;
connectDB();

app.listen(port, () => {
  console.log(`Server is roaring on port ${port} 🔥`);
});
