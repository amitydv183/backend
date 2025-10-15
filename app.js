const express = require('express');
const db = require('./databaseconnect/db');
const web = require('./routes/web');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileupload = require('express-fileupload');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://petcarelog.netlify.app",
    credentials: true,
  })
);

// ✅ enable image upload
app.use(fileupload({
  useTempFiles: true,
}));

app.use('/api', web);
db();

app.listen(process.env.PORT, () => console.log("Server running "));
