import {} from "dotenv/config";
import mongoose from "mongoose";
import { db_username, db_password, db_cluster, db_name, server_port } from "../config/db.js";


const connectDB = () => {
  mongoose
    .connect(`mongodb+srv://${db_username}:${db_password}@${db_cluster}.mongodb.net/${db_name}?retryWrites=true&w=majority`)
  .then(() => {
    console.log("Connected to MongoDB Database")
  })
  .catch((err) => {
    console.log("Error:", err);
    process.exit(1);
  })
}

export default connectDB;