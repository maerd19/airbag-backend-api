import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./User";

export interface IVehicle extends Document {
  plates: string;
  vin: string;
  brand: string;
  vehicleType: string;
  owner: IUser["_id"];
}

const VehicleSchema: Schema = new Schema({
  plates: { type: String, required: true, unique: true },
  vin: { type: String, required: true, unique: true },
  brand: { type: String, required: true },
  vehicleType: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model<IVehicle>("Vehicle", VehicleSchema);
