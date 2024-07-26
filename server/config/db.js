import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw new Error("Database Connection Failed");
  }
};

export default connectDB;

/*
Combining export and import (ES6 Modules):
You can also use the export default syntax to export a single value from a module,
 and then use the import statement without curly braces to import it. */
