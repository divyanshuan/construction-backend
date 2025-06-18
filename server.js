require("dotenv").config();
const app = require("./index");
const sequelize = require("./db"); // Reuse Sequelize instance from db.js
const User = require("./Models/user.model");
const Village = require("./Models/village.model");
const House = require("./Models/house.model");
const MediaFile = require("./Models/mediafile.model");
const associateModels = require("./Models/associate.model");
const loginRouter = require("./routes/UserRouter");
const villageRouter = require("./routes/VillageRouter");
const houseRouter = require("./Routes/HouseRouter");
const fileRouter = require("./Routes/FileRouter");

// Function to initialize the User table
async function initializeTable() {
  try {
    await User.sync();
    await Village.sync();
    await House.sync();
    await MediaFile.sync();
    console.log("User and Village tables initialized.");
  } catch (error) {
    console.error("Error initializing tables:", error);
  }
}

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
    initializeTable();
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });

associateModels();

// Routers
app.use("/api/users", loginRouter);
app.use("/api/village", villageRouter);
app.use("/api/house", houseRouter);
app.use("/api/files", fileRouter);
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
