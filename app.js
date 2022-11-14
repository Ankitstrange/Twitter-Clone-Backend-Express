const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const fs = require('fs');
const { default: mongoose } = require('mongoose');
const tweetRouter = require('./routes/tweetRoute');
const userRouter = require("./routes/userRoute");
const errorLogger = require('./Util/errorLogger');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const port = process.env.PORT||8080;
const mongoUrl = process.env.mongoUrl||'mongodb://localhost:27017/Twitter';

var LogStream = fs.createWriteStream('RequestLogger.log', {flag: 'a'});

mongoose.connect(mongoUrl).then(()=>{console.log("DB Connection Succesfull");});

// view engine setup
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(morgan('combined', {stream:LogStream}));
app.use("/tweets",tweetRouter);
app.use("/users",userRouter);
app.use(errorLogger);
app.all("*",async(req, res)=>{
  console.log("Invalid path");
  res.status(404).json({
      message:"Invalid Path"
  });
});

app.listen(port,()=>{
  console.log(`App is listening on port ${port}`);
});

module.exports = app;
