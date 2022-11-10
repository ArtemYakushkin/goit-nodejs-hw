const mongoose = require("mongoose");

const app = require("./app");

const { DB_HOST, PORT = 3000 } = process.env;

mongoose
  .connect(DB_HOST)
  .then(() => {
    console.log("Database connection successful");
    // app.listen(PORT); 
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });


// mongodb+srv://admin:z2cHEFJZQ5Woir2e@cluster0.s8gwcld.mongodb.net/db-contacts