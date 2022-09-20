const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { default: mongoose } = require('mongoose');
const app = express();
const port = process.env.PORT||8080;
const mongoUrl = 'mongodb://localhost:27017/Twitter';
mongoose.connect(mongoUrl).then(()=>{console.log("DB Connection Succesfull");});

// view engine setup
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

app.listen(port,()=>{
  console.log(`App is listening on port ${port}`);
});

module.exports = app;
