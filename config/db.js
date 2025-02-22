// const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log('MongoDB connected successfully');
//   } catch (error) {
//     console.error('MongoDB connection error:', error);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;



// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error details:', {
      message: error.message,
      code: error.code,
      address: error.address
    });
    process.exit(1);
  }
};

module.exports = connectDB;