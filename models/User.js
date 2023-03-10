const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const salRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type : String,
        maxlength: 50
    },
    email: {
        type: String,
        trim:true, // 공백제거
        unique: 1
    },
    password: {
        type:String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

userSchema.pre('save', function( next ){
    var user = this;

    // 비밀번호 변경시에만
    if(user.isModified("password")){
        // 비밀번호 암호화
        bcrypt.genSalt(salRounds, function( err, salt){
            if(err) return next(err);

            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err);
                user.password = hash;
                next();
            })
        })
    } else {
        next();
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb){
    // plainPassword = 1234567
    // 암호화된 비밀번호 = $2b$10$RBUl0/4O1zYE0gipsVA4k.QXJtWH5uymAlnln3ddm1OL.4DAdOTsm

    bcrypt.compare(plainPassword, this.password ,function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch);
    })
}

userSchema.methods.generateToken = function(cb){
    var user = this;
    
    // jsonwebtoken 을 이용해서 token 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken');

    user.token = token;
    user.save(function(err, user){
        if(err) return cb(err);
        
        cb(null, user);
    })

}

const User = mongoose.model('User', userSchema)

module.exports = {User}