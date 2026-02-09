import mongoose from "mongoose";

console.log("Attempting to connect to MongoDB...");

export const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/POKEMONS_V2");
        console.log("Connected to MongoDB successfully on POKEMONS_V2");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};


connectDB();