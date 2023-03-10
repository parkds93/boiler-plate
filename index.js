const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")

const config = require('./config/key')

const {User} = require("./models/User")

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
// application/json
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose');
mongoose.set('strictQuery',true);
mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology : true
}).then(() => console.log('MongoDb Connected...'))
  .catch(err => console.log(err));



// 메인
app.get('/', (req, res) => res.send('Hello World! ~안녕하세요'));

// 회원가입
app.post('/register', (req, res) =>{
  
  // 회원 가입 할때 필요한 정보들을 client에서 가져오면
  // 그것들을 데이터 베이스에 넣어준다.
  const user = new User(req.body);

  user.save((err, userInfo) => {
    if(err) return res.json({ success : false, err})
    return res.status(200).json({
      success:true
    })
  })
})

app.post('/login', (req, res) =>{
  
  // 요청된 이메일을 데이터베이스에서 있는지 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {
    if(!user){
      return res.json({
        loginSuccess:"false",
        message:"제공된 이메일에 해당하는 유저가 없습니다."
      })
    }

    // 이메일이 존재한다면 비밀번호가 맞는지 확인.
    user.comparePassword(req.body.password, (err, isMatch) =>{
      if(!isMatch){
        return res.json({ loginSuccess: false, message: "비밀번호가 틀렷습니다."});
      }

      // 비밀번호가 같다면 token을 생성
      user.generateToken((err,user) => {
        if(err) return res.status(400).send(err);

        // 토큰을 저장한다. WHERE? cookie OR localStorage
        res.cookie("x_auth",user.token)
        .status(200)
        .json({ loginSuccess: true, userId: user._id});
      })
    })
  })



  
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));