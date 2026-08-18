const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const authRoutes = require("./routes/auth.route");
const courseRoutes = require("./routes/course.route");
const enrollRoutes = require("./routes/enrollment.route");
const sectionRoutes = require("./routes/section.route");
const lessonRoutes = require("./routes/lesson.route");
const instructorRoutes = require("./routes/instructor.route");

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
app.use("/api/sections", sectionRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/instructor", instructorRoutes);

app.get("/", (req, res) => {
  res.send("Blog Backend System Running smoothly... 🚀");
});

module.exports = app;
