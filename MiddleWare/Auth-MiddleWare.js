const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
      console.log(req.headers);
    const token = req.headers.authorization.split(" ")[2];
    console.log(token);
    const decodedToken = jwt.verify(token, "deepshah");
    console.log(decodedToken);
    const email = decodedToken.email;
    if (req.body.email && req.body.email !== email) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch(e) {
      console.log(e);
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};