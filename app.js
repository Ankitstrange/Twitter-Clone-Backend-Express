const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet')

const app = express();
const port = process.env.PORT||8080;

// view engine setup
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

app.listen(port,()=>{
  console.log(`App is listening on port ${port}`);
});

module.exports = app;
