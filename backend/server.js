require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

// Import Routes
const { FormRouter } = require("./route/FormRoutes");
const { ResponseRouter } = require("./route/ResponseRoutes");

// Import Models
const { FormModel } = require("./model/FormModel");
const { ResponseModel } = require("./model/ResponseModel");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/forms", FormRouter);
app.use("/response", ResponseRouter);

// Database Connection Function
const connectToDatabase = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URL);
      console.log("✅ Connected to MongoDB successfully!");
  
      // Additional listeners for detailed status
      mongoose.connection.on("connected", () => {
        console.log("📡 Mongoose connected to DB");
      });
      mongoose.connection.on("error", (err) => {
        console.error("❌ Mongoose connection error:", err.message);
      });
      mongoose.connection.on("disconnected", () => {
        console.log("⚠️ Mongoose disconnected from DB");
      });
    } catch (error) {
      console.error("❌ Error connecting to MongoDB:", error.message);
      process.exit(1); // Exit the process with failure
    }
  };
  

// Default Route
app.get("/", (req, res) => {
  res.send("Welcome to the custom form builder");
});

// Create Form Endpoint
app.post("/create/form", async (req, res) => {
  try {
    const { header, formId, questions } = req.body;
    const newForm = new FormModel({ header, formId, questions });
    await newForm.save();
    res.status(201).json({ success: true, message: "Form created successfully!" });
  } catch (error) {
    console.error("Error creating form:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Create Response Endpoint
app.post("/create/response", async (req, res) => {
  try {
    const { name, email, formId, response } = req.body;
    const newResponse = new ResponseModel({ name, email, formId, response });
    await newResponse.save();
    res.status(201).json({ success: true, message: "Response submitted successfully!" });
  } catch (error) {
    console.error("Error creating response:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Form Preview Endpoint
app.get("/preview/:formId", async (req, res) => {
  try {
    const { formId } = req.params;
    const formData = await FormModel.findOne({ formId });

    if (!formData) {
      return res.status(404).json({ error: "Form not found" });
    }

    // Send the form data to the frontend (assuming the frontend build path is set correctly)
    res.sendFile(path.join(__dirname, "frontend-build-path", "index.html"));
  } catch (error) {
    console.error("Error fetching form data:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Start the Server
const startServer = async () => {
  await connectToDatabase(); // Use the separate database connection function
  app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
  });
};

startServer();
