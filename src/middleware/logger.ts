import { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";

const logFile = path.join(__dirname, "../../logs/api.log");

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ${req.method} ${req.url}\n`;

  fs.appendFile(logFile, logMessage, (err) => {
    if (err) {
      console.error("Error writing to log file:", err);
    }
  });

  next();
};
