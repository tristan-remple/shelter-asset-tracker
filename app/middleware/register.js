const registerNonAdmin = async (req, res, next) => {
    req.body.isAdmin = false;
    next();
  }
  
module.exports = registerNonAdmin;