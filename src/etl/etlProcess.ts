import mongoose from "mongoose";
import { Sequelize, DataTypes, Model, Transaction } from "sequelize";
import User from "../models/User";
import Vehicle from "../models/Vehicle";
import cron from "node-cron";
import winston from "winston";

// logger configuration
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "etl-error.log", level: "error" }),
    new winston.transports.File({ filename: "etl-combined.log" }),
    new winston.transports.Console(),
  ],
});

const sequelize = new Sequelize(
  process.env.SQL_DATABASE as string,
  process.env.SQL_USER as string,
  process.env.SQL_PASSWORD as string,
  {
    host: process.env.SQL_HOST,
    dialect: "postgres",
    logging: console.log,
  }
);

// Interfaces for SQL models
interface SQLUserAttributes {
  id?: number;
  name: string;
  phone: string;
  email: string;
}

interface SQLVehicleAttributes {
  id?: number;
  plates: string;
  vin: string;
  brand: string;
  vehicleType: string;
  ownerId: number;
}

// SQL Models
class SQLUser extends Model<SQLUserAttributes> implements SQLUserAttributes {
  public id!: number;
  public name!: string;
  public phone!: string;
  public email!: string;
}

class SQLVehicle
  extends Model<SQLVehicleAttributes>
  implements SQLVehicleAttributes
{
  public id!: number;
  public plates!: string;
  public vin!: string;
  public brand!: string;
  public vehicleType!: string;
  public ownerId!: number;
}

SQLUser.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "User",
  }
);

SQLVehicle.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    plates: DataTypes.STRING,
    vin: DataTypes.STRING,
    brand: DataTypes.STRING,
    vehicleType: DataTypes.STRING,
    ownerId: DataTypes.INTEGER,
  },
  {
    sequelize,
    modelName: "Vehicle",
  }
);

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string, {
      serverSelectionTimeoutMS: 30000,
    });
    logger.info("Connected to MongoDB");
  } catch (error) {
    logger.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

const etlProcess = async (): Promise<void> => {
  let transaction: Transaction | null = null;
  try {
    await connectToMongoDB();
    await sequelize.authenticate();
    logger.info("Connection to PostgreSQL has been established successfully.");

    await sequelize.sync({ force: true });
    logger.info("Database synced");

    transaction = await sequelize.transaction();

    const users = await User.find();
    logger.info(`Users found in MongoDB: ${users.length}`);

    for (const user of users) {
      await SQLUser.create(
        {
          name: user.name,
          phone: user.phone,
          email: user.email,
        },
        { transaction }
      );
    }

    const sqlUsers = await SQLUser.findAll({ transaction });
    logger.info(`Users created in PostgreSQL: ${sqlUsers.length}`);

    const vehicles = await Vehicle.find().populate("owner");
    logger.info(`Vehicles found in MongoDB: ${vehicles.length}`);

    for (const vehicle of vehicles) {
      const sqlUser = await SQLUser.findOne({
        where: { email: (vehicle.owner as any).email },
        transaction,
      });
      if (sqlUser) {
        await SQLVehicle.create(
          {
            plates: vehicle.plates,
            vin: vehicle.vin,
            brand: vehicle.brand,
            vehicleType: vehicle.vehicleType,
            ownerId: sqlUser.id,
          },
          { transaction }
        );
      } else {
        logger.warn(
          `No matching user found for vehicle with VIN: ${vehicle.vin}`
        );
      }
    }

    const sqlVehicles = await SQLVehicle.findAll({ transaction });
    logger.info(`Vehicles created in PostgreSQL: ${sqlVehicles.length}`);

    await transaction.commit();
    logger.info("ETL process completed successfully");
  } catch (error) {
    if (transaction) await transaction.rollback();
    logger.error("Error in ETL process:", error);
    throw error;
  } finally {
    await mongoose.disconnect();
  }
};

// Schedules the ETL process to run daily at 2:00 AM (GMT-06)
cron.schedule("0 2 * * *", etlProcess, {
  scheduled: true,
  timezone: "America/Mexico_City",
});

// Execute ETL process immediately if this file is run directly
if (require.main === module) {
  etlProcess()
    .then(() => {
      console.log("ETL process executed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Error executing ETL process:", error);
      process.exit(1);
    });
}

export default etlProcess;
