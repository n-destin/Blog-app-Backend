const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB Connected Successfully");
    // const schema = new mongoose.Schema({name: String})
    // const someone = new mongoose.model("Someone", schema)
  } catch (error) {
    console.log("DB Connection failed", error.message);
  }
};

dbConnect();
