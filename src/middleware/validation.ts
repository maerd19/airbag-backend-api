import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const validateUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const schema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
  } else {
    next();
  }
};

export const validateVehicle = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const schema = Joi.object({
    plates: Joi.string().required(),
    vin: Joi.string().required(),
    brand: Joi.string().required(),
    vehicleType: Joi.string().required(),
    owner: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).json({ message: error.details[0].message });
  } else {
    next();
  }
};
