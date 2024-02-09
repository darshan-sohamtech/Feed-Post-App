const jwt = require('jsonwebtoken');
const secret = "$uperMan@123";

const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.render('./error/500-page');
    }
    try {
      const decoded = jwt.verify(token, secret);
      req.userId = decoded.id;
      next();
      
    } catch (error) {
      //   return res.json({
      //     message:"Failed To Verify Token"
      // })
      return res.render('./error/500-page');
    }
  } catch (error) {
    return res.render('./error/500-page');
  }
};
  
module.exports = verifyToken;