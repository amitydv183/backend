const express = require('express');
const db = require('./databaseconnect/db');
const web = require('./routes/web');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileupload = require('express-fileupload');
//require('dotenv').config();

const port = 3000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ✅ enable image upload
app.use(fileupload({
  useTempFiles: true,
}));

app.use('/api', web);
db();

app.listen(port, () => console.log("Server running at port 3000"));
