import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if(!MONGODB_URI)
{
    console.log("No uri found");
}

export async function connectDB() {
    mongoose.connect(MONGODB_URI)
    .then(() => console.log("MongoDB connection established"))
    .catch((error) => console.log("Error connecting to database: ", error))
}