/* eslint-disable no-console */
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const options = {
      maxPoolSize: 50,
      wtimeoutMS: 2500,
      useNewUrlParser: true,
    };

    const conn = await mongoose.connect(`${process.env.MONGODB_URI}`, options);

    console.log(`MongoDB connected to ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(`Error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

export default connectDB;
