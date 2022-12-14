const appErr = require("../utils/appErr")
const protected  = (req, res, next)=>{
    // console.log(req.session.loginUser)
    // checking if the user is logged in
    if(req.session.loginUser != null){
        next()
    } else{
        appErr("Not allowed to login. Please login/ register")
}
    }
module.exports = protected 