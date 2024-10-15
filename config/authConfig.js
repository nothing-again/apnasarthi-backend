import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./dotenv.config";

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: "30d",
  });
};

export { generateToken };
