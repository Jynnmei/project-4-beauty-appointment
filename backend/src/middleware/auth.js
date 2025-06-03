import jwt from "jsonwebtoken";

export const authClient = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(400).json({ status: "error", msg: "No token found" });
  }

  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

    if (decoded.role_id !== 1) {
      return res.status(403).json({
        status: "error",
        msg: "Only clients can create & view appointments",
      });
    }

    req.decoded = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ status: "error", msg: "Unauthorised" });
  }
};

// export const auth = (req, res, next) => {
//   if (!("authorization" in req.headers)) {
//     return res.status(400).json({ status: "error", msg: "no token found" });
//   }

//   const token = req.headers["authorization"].replace("Bearer ", "");
//   if (token) {
//     try {
//       const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
//       req.decoded = decoded;
//       next();
//     } catch (error) {
//       return res.status(401).json({ status: "error", msg: "unauthorised" });
//     }
//   } else {
//     return res.status(403).json({ status: "error", msg: "missing token" });
//   }
// };
