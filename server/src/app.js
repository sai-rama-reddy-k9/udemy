const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const authRoutes = require("./routes/auth.route");
const courseRoutes = require("./routes/course.route");
const enrollRoutes = require("./routes/enrollment.route");

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/enrollments", enrollRoutes);

app.get("/", (req, res) => {
  res.send("Blog Backend System Running smoothly... 🚀");
});

module.exports = app;
