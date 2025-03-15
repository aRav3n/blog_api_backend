const allowList = ["http://localhost:5173/"];

const corsOptionsDelegate = (req, callback) => {
  const origin = req.header("Origin");
  const corsOptions = {
    origin: allowList.includes(origin),
  };
  callback(null, corsOptions);
};

module.exports = corsOptionsDelegate;
