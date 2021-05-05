const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {auth} = require("./middleware/auth");
const {User} = require("./models/User");
const config = require('./config/dev')
//application.x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());
app.use(cookieParser());


const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{
  useNewUrlParser: true,useUnifiedTopology: true, useCreateIndex:true,useFindAndModify:false
}).then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World! 안녕하세요~')
})

app.get('/api/hello', (req,res) => {
  res.send("안녕하세요. ~")
})

app.post('/api/users/register', (req,res) => {
  //회원가입 할떄 필요한 정보를 client에서 가져오면
  //그것들을 데이터 베이스에 넣어준다
  const user = new User(req.body)
  
  user.save((err, userInfo) => {
    if(err) return res.json({success: false, err})
    return res.status(200).json({
      success: true
    })
  })
})


app.post('/api/users/login', (req,res) => {
  //요청된 이메일을 데이터베이스에서 있는지 찾는다.
  User.findOne({email: req.body.email}, (err, user) =>{
    if(!user){
      return res.json({
        loginSuccess:false,
        message : "찾고자하는 이메일이 없습니다."
      })
    }
    //요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인
    user.comparePassword(req.body.password, (err , isMatch) => {
      if(!isMatch)
      return res.json({loginSuccess: false , message : "비밀번호가 틀렸습니다."
    })
        //비밀번호 까지 맞다면 토큰을 생성하기
        user.generateToken((err, user) => {

          if (err) return res.status(400).send(err);
          
          
          
           //토큰을 저장한다 쿠키에
          
          res.cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id })
          
      })
    })
  })
})
 
//role 1 어드민 role 2 특정 관리부서 어드민 0 일반유저 role 이 0이 아니면 관리자
//auth 라는 미들웨어 를 추가
app.get('/api/users/auth', auth ,(req,res) => {
  //여기 까지 미들웨어를 통과해 왔다는 얘기는 Authentication 이 true 라는 말.
  res.status(200).json({
      _id: req.user._id,
      isAdmin: req.user.role === 0 ? false : true,
      isAuth: true,
      email: req.user.email,
      name:req.user.name,
      lastname: req.user.lastname,
      role:req.user.role,
      image: req.user.image
  })

})

app.get('/api/users/logout', auth , (req , res) => {
  //찾아서 업데이트
  User.findOneAndUpdate({_id:req.user._id},
      {token : ""}
      , (err, user) => {
        if(err) return res.json({ success : false , err});
        return res.status(200).send({
          success: true
      })
   })
})

const port = 5000

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})