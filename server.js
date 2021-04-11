require("dotenv").config({ path: "./config.env" });
const express = require("express");
const app = express();
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");

connectDB();

app.use(express.json());
app.use("/api/auth", require("./routes/auth"));
app.use("/api/private", require("./routes/private"));
// Error Handler (should be he last piece f middleware)
app.use(errorHandler);

const PORT = process.env.port || 5000;
const server = app.listen(PORT, () =>
	console.log(`App running on port ${PORT}`)
);
process.on("unhandledRejection", (error, promise) => {
	console.log(`Logged error: ${error}`);
	server.close(() => process.exit(1));
});
