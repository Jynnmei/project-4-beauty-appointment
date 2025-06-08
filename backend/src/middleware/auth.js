import jwt from "jsonwebtoken";

export const authClient = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(400).json({ status: "error", msg: "No token found" });
  }

  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

    if (decoded.role_id !== CLIENT) {
      return res.status(403).json({
        status: "error",
        msg: "Only clients can create appointments",
      });
    }

    req.decoded = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ status: "error", msg: "Unauthorised" });
  }
};

export const authVendor = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(400).json({ status: "error", msg: "No token found" });
  }

  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

    if (decoded.role_id !== VENDOR) {
      return res.status(403).json({
        status: "error",
        msg: "Only vendors are authorized",
      });
    }

    req.decoded = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ status: "error", msg: "Unauthorised" });
  }
};
