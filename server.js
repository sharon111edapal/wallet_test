require("dotenv").config();
const compression = require("compression");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { mongoURI } = require("./config/key");

const app = express();

const routes = require("./routes");

app.use(compression({ level: 6 }));
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB Config
const mongooseOptions = { useUnifiedTopology: true };
// Connect to mongoDB
mongoose
	.connect(mongoURI, mongooseOptions)
	.then(async () => {
		console.log("MongoDB connected");
	})
	.catch((err) => {
		console.error("Could not connect to the MongoDB. ERR: ", err);
		process.exit();
	});

app.use("/", routes);

const port = process.env.PORT || 3230;
app.listen(port, () => console.log(`Server running on port ${port}`));
