const jwt = require('jsonwebtoken');

exports.createToken = async(user) => {
    try{
        let payload = {
            sub: user._id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            role: user.role,
            iat: Math.floor(Date.now()/ 1000),
            exp: Math.floor(Date.now()/ 1000) + (60*120)
        }
        return jwt.sign(payload, `${process.env.CSecretKey}`);
    }catch(err){
        console.log(err);
        return err
    }
}