import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import { prisma } from "./lib/prisma";

const PORT = process.env.PORT || 3000;

export async function startServer() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

if (require.main === module) {
  startServer();
}
