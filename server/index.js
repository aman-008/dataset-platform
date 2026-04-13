const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const upload = require("./config/multer");
const Dataset = require("./models/Dataset");

const User = require("./models/User");

const app = express();

// Middleware
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected 🔥"))
  .catch(err => console.log(err));

// Test route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});


// ================= REGISTER =================
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ================= LOGIN =================
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ================= UPLOAD DATASET =================

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { title, description, tags } = req.body;

    if (!title || !req.file) {
      return res.status(400).json({ message: "Title and file required" });
    }

    const dataset = new Dataset({
      title,
      description,
      tags: tags ? tags.split(",") : [],
      fileUrl: req.file.path,
      fileType: req.file.mimetype,
      uploadedBy: null
    });

    await dataset.save();

    res.status(201).json({
      message: "Dataset uploaded successfully",
      dataset
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ================= DATASET ROUTES =================
// Get all datasets
app.get("/datasets", async (req, res) => {
  try {
    const datasets = await Dataset.find().sort({ createdAt: -1 });
    res.json(datasets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Get dataset by ID
// 👇 ADD HERE
app.get("/datasets/:id", async (req, res) => {
  try {
    const dataset = await Dataset.findById(req.params.id);

    if (!dataset) {
      return res.status(404).json({ message: "Dataset not found" });
    }

    // increase views
    dataset.views += 1;
    await dataset.save();

    res.json(dataset);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Download dataset
app.get("/download/:id", async (req, res) => {
  try {
    const dataset = await Dataset.findById(req.params.id);

    if (!dataset) {
      return res.status(404).json({ message: "Dataset not found" });
    }

    // increase downloads
    dataset.downloads += 1;
    await dataset.save();

    // redirect to file
    res.redirect(dataset.fileUrl);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Search datasets
app.get("/search", async (req, res) => {
  try {
    const { query, tag } = req.query;

    let filter = {};

    // search by title
    if (query) {
      filter.title = { $regex: query, $options: "i" };
    }

    // filter by tag
    if (tag) {
      filter.tags = tag;
    }

    const datasets = await Dataset.find(filter).sort({ createdAt: -1 });

    res.json(datasets);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});





// ================= SERVER =================
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});