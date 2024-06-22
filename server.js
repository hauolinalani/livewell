const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require("path");
const passport = require("passport");

const datapoints = require("./routes/api/datapoints");
const auth = require("./routes/api/auth");

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// DB Config
const uri = process.env.MONGO_URI;
mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB connection established successfully');
})

app.use(passport.initialize());
require("./config/passport")(passport);

// Routes
app.use("/api/datapoints", datapoints);
app.use("/api/auth", auth);

// // Configure Express to also serve frontend
// app.use(express.static(path.join(__dirname, "client", "build")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "client", "build", "index.html"));
// });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})

module.exports = app;