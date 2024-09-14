import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

export const auth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ message: "No token, authorization denied" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ message: "Token is not valid" });
    } else {
      res.status(500).json({ message: "Unknown error occurred" });
    }
  }
};
