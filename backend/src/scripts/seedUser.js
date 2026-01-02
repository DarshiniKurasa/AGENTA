import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config(); // Loads .env from CWD (backend root)

const seedUser = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Connected to DB");

        const clerkId = "user_37goZjpUZixC8uDhxCquUEG6rq"; // ID from logs
        const email = "demo@example.com"; // Placeholder
        const name = "Demo User";

        const existingUser = await User.findOne({ clerkId });
        if (existingUser) {
            console.log("User already exists:", existingUser);
        } else {
            const newUser = await User.create({
                clerkId,
                email,
                name,
                profileImage: "https://www.gravatar.com/avatar/?d=mp",
            });
            console.log("User created:", newUser);
        }

        process.exit(0);
    } catch (error) {
        console.error("Error seeding user:", error);
        process.exit(1);
    }
};

seedUser();
