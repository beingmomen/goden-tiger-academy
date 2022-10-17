const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

// const DB =
//   'mongodb+srv://academy:9aJngWYk6rYaIMO0@academy.wvr8vfi.mongodb.net/?retryWrites=true&w=majority';
// const DB = process.env.DATABASE_LOCAL;
const DB = process.env.DATABASE;

// const DB = process.env.DATABASE.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD
// ).toString();

console.warn('db', DB);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 1234;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/data/user.json`, 'utf-8')
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    const exist = await User.findById('6349c2b12fb7e853843667d8');
    if (exist) return;
    await User.create(users);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

importData();
