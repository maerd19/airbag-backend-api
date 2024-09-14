import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import User from "../models/User";
import Vehicle from "../models/Vehicle";

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/airbag_api";

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Clean database
    await User.deleteMany({});
    await Vehicle.deleteMany({});

    // Create Users
    const users = [];
    for (let i = 0; i < 10; i++) {
      const user = new User({
        name: faker.name.fullName(),
        phone: faker.phone.number(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      });
      await user.save();
      users.push(user);
    }

    // Create vehicles
    for (let i = 0; i < 20; i++) {
      const vehicle = new Vehicle({
        plates: faker.vehicle.vrm(),
        vin: faker.vehicle.vin(),
        brand: faker.vehicle.manufacturer(),
        vehicleType: faker.vehicle.type(),
        owner: users[Math.floor(Math.random() * users.length)]._id,
      });
      await vehicle.save();
    }

    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.connection.close();
  }
};

seedDatabase();
