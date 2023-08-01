// import {} from "dotenv/config";
// import mongoose from "mongoose";

// import User from "../models/User.js";
// import connect_db from "../db/mongoose.js";

// import { db_username, db_password, db_cluster, db_name, server_port } from "../config/db.js";


// // Connect to the database
// mongoose
//   .connect(`mongodb+srv://${db_username}:${db_password}@${db_cluster}.mongodb.net/${db_name}?retryWrites=true&w=majority`)
//   .then(() => {
//     console.log("Connected to MongoDB Database")
//   })
//   .catch((err) => {
//     console.log("Error:", err);
//     process.exit(1);
//   })


// User.collection.drop();

// // Create users
// User.create([
//   {
//     email: "jere@email.com",
//     username: "jere",
//     first_name: "Jere",
//     last_name: "Andreson",  
//     avatar_url: "",
//     token: "",
//     password: "password",
//   },
//   {
//     email: "jameson@email.com",
//     username: "jameson",
//     first_name: "Jameson",
//     last_name: "Andrews",  
//     avatar_url: "",
//     token: "",
//     password: "password",
//   }
// ])
// .then((users) => {
//   console.log(`${user.length} users created`);
// })
// .catch((err) => {
//   console.log("Error:", err);
// });

// mongoose.disconnect();