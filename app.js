const express = require("express");
const app = express();
const connectDB = require("./config/db");

const bodyParser = require("body-parser");
const cors = require("cors");

const boardsRoutes = require("./routes/boards");
const columnsRoutes = require("./routes/columns");
const tasksRoutes = require("./routes/tasks");
const subtasksRoutes = require("./routes/subtasks");
const authRoutes = require("./routes/auth");

require("dotenv").config({ path: "./config/.env" });
connectDB();

app.use(cors({origin: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/boards", boardsRoutes);
app.use("/columns", columnsRoutes);
app.use("/tasks", tasksRoutes);
app.use("/subtasks", subtasksRoutes);
app.use("/auth", authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
