const User = require('../Model/Users');
const jwt = require('jsonwebtoken');

exports.isAuthenticatedUser = async function(req, res, next){

    const token = req.header('token');
    console.log(token)
    console.log(process.env.JWT_SECRET);
    console.log(req.session.uid)
    
    

    if (!req.session.uid || !token) {
        req.session.destroy();
        console.log("klkl")
        return res.status(401).json({
            "message":"Please Login To Access"
        })
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);
    console.log(req.user.role)
    next();
};


exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {

        if (!roles.includes(req.user.orgName)) {
            res.status(400).json({
                "mesage":`${req.user.orgName} role not allowed`
            })
                    }
        next();
    }
}