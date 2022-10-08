const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

// const DB = process.env.DATABASE_LOCAL;
const DB = process.env.DATABASE;

// const DB = process.env.DATABASE.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD
// );

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection successful!'));

// const port = process.env.PORT || 1234;
// const server = app.listen(port, () => {
//   console.log(`App running on port ${port}...`);
// });

const server = null;

server.listen(1234, '0.0.0.0');
server.on('listening', function() {
  console.log(
    'Express server started on port %s at %s',
    server.address().port,
    server.address().address
  );
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
