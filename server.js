require("dotenv").config();
const app = require("./index");
const sequelize = require("./db");

const User = require("./Models/user.model");
const Village = require("./Models/village.model");
const House = require("./Models/house.model");
const MediaFile = require("./Models/mediafile.model");
const associateModels = require("./Models/associate.model");

// Setup associations BEFORE syncing
associateModels();

// Routers
const loginRouter = require("./routes/UserRouter");
const villageRouter = require("./routes/VillageRouter");
const houseRouter = require("./Routes/HouseRouter");
const fileRouter = require("./Routes/FileRouter");

// Initialize DB and start server
const initializeApp = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established.");

    // Sync all models
    await sequelize.sync({ alter: true }); // use alter or force with caution
    console.log("✅ All models synced with the database.");

    // Routes
    app.use("/api/users", loginRouter);
    app.use("/api/village", villageRouter);
    app.use("/api/house", houseRouter);
    app.use("/api/files", fileRouter);

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (error) {
    console.error("❌ Failed to start application:", error);
  }
};

initializeApp();
