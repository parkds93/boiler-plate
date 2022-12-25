const express = require("express");
const app = express();
const port = 5000;

const mongoose = require('mongoose');
mongoose.set('strictQuery',true);
mongoose.connect('mongodb+srv://parkds93:qkr102030!@boilerplate.d7cpwbp.mongodb.net/?retryWrites=true&w=majority',{
    useNewUrlParser: true, useUnifiedTopology : true
}).then(() => console.log('MongoDb Connected...'))
  .catch(err => console.log(err));



app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));