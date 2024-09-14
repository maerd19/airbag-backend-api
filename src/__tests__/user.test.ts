import request from "supertest";
import mongoose from "mongoose";
import app from "../app";
import User from "../models/User";

beforeAll(async () => {
  const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/test_db";
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe("User API", () => {
  it("should create a new user", async () => {
    const res = await request(app).post("/api/users").send({
      name: "John Doe",
      phone: "1234567890",
      email: "john@example.com",
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
    });
    await user.save();

    const res = await request(app).get(`/api/users/${user._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual("Jane Doe");
  });
});
