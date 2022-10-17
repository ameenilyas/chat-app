import mongoose from "mongoose";

const connectToMOngo = async () => {
  console.log(process.env.NEW_DB_CONNECT);
  try {
    const conn = await mongoose.connect(process.env.NEW_DB_CONNECT, {
      // useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB Connected", conn.connection.host);
  } catch (Err) {
    console.log(`Err ${Err.message}`);
    process.exit();
  }
};

export default connectToMOngo;
