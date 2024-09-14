import request from "supertest";
import mongoose from "mongoose";
import app from "../app";
import User from "../models/User";
import jwt from "jsonwebtoken";

beforeAll(async () => {
  const mongoUri =
    process.env.MONGO_URI || "mongodb://localhost:27017/airbag_api_test";
  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
}, 10000);

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
}, 10000);

beforeEach(async () => {
  await User.deleteMany({});
}, 10000);

describe("User API", () => {
  it("should create a new user", async () => {
    const res = await request(app).post("/api/users").send({
      name: "John Doe",
      phone: "1234567890",
      email: "john@example.com",
      password: "password123",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.name).toEqual("John Doe");
  });

  it("should not create a user with invalid data", async () => {
    const res = await request(app).post("/api/users").send({
      name: "John Doe",
      phone: "1234567890",
    });
    expect(res.statusCode).toEqual(400);
  });

  it("should get a user by id", async () => {
    const user = new User({
      name: "Jane Doe",
      phone: "0987654321",
      email: "jane@example.com",
      password: "password123",
    });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    const res = await request(app)
      .get(`/api/users/${user._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual("Jane Doe");
  });
});
