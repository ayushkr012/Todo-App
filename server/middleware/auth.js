import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    let authToken = req.header("Authorization");
    if (!authToken) return res.status(401).json({ message: "Aceess Denied" });

    if (authToken.startsWith("Bearer ")) {
      authToken = authToken.slice(7, authToken.length).trimLeft();
    }

    const verified = jwt.verify(authToken, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Unauthorized" });
  }
};
