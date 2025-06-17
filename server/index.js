const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json({ limit: '10mb' })); 
app.use(cors({
  origin: "http://localhost:5173",  // allow your frontend
  credentials: true
}));


let fakeUsers = [];
try {
  const data = fs.readFileSync("./fakeUsers.json", "utf-8");
  fakeUsers = JSON.parse(data);
  console.log(`✅ Loaded ${fakeUsers.length} fake users for leaderboard`);
} catch (err) {
  console.error("❌ Could not load fakeUsers.json:", err.message);
}


// Ensure only one MongoDB connection
mongoose
    .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/UserData", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    points: { type: Number, default: 0 },
    handle: { type: String, default: "@NewUser" },
    profilePic: { type: String, default: "/assets/profile-placeholder.png" },
    friends: { type: [String], default: [] },
    totalGames: { type: Number, default: 0 },
    totalCorrect: { type: Number, default: 0 },
    totalIncorrect: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 },
    performanceData: [
      {
        subject: { type: String, required: true },
        difficulty: { type: String, required: true },
        score: { type: Number, required: true },
        totalQuestions: { type: Number, required: true },
        timeTaken: { type: Number, required: true }, // time in seconds
        date: { type: Date, default: Date.now },
      }
    ]
},
{ timestamps: true }
);
  

const User = mongoose.model("User", UserSchema);

const feedbackSchema = new mongoose.Schema({
  userId: String,
  name: String,
  email: String,
  feedback: String,
  timestamp: { type: Date, default: Date.now },
});
const Feedback = mongoose.model("Feedback", feedbackSchema);


const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key"; // Use environment variable
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = { id: decoded.userId };
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }
};


// Signup API
app.post("/api/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.json({ success: true, 
            name: newUser.name, // ✅ send this
            email: newUser.email, // ✅ send this
            message: "User registered successfully" });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Login API
app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // ✅ Send the name from MongoDB
        res.json({
            success: true,
            message: "Login successful",
            token,
            name: user.name, // 👈 pulls the name from DB
            email: user.email, // 👈 pulls the email from DB
            user: {
              _id: user._id,
              name: user.name,
              email: user.email
          }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// PUT /api/user/profile
app.put('/api/user/profile', authenticate, async (req, res) => {
  const { name, email, handle, profilePic, friends, totalGames, totalCorrect, totalIncorrect, completionRate } = req.body;
  // Check if required fields are not empty
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required fields" });
  }
    try {
      // 🔍 Add this line right here:
      console.log("UPDATE PAYLOAD:", req.body);
      const updateFields = {
        name: req.body.name,
        email: req.body.email,
        handle: req.body.handle,
        profilePic: req.body.profilePic,
        friends: Array.isArray(req.body.friends) ? req.body.friends : [],
        totalGames: typeof req.body.totalGames === "number" ? req.body.totalGames : 0,
        totalCorrect: typeof req.body.totalCorrect === "number" ? req.body.totalCorrect : 0,
        totalIncorrect: typeof req.body.totalIncorrect === "number" ? req.body.totalIncorrect : 0,
        completionRate: typeof req.body.completionRate === "number" ? req.body.completionRate : 0,
      };
      const updated = await User.findByIdAndUpdate(
        req.user.id,
        { $set: updateFields },
        { new: true }
      ).select("-password");
      res.json(updated);
    } catch (err) {
      console.error("Update error:", err);
      res.status(500).json({ error: 'Failed to update profile' });
    }
});

app.get('/api/user/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});
  

// GET /api/world-rank/:username
app.get("/api/world-rank/:username", async (req, res) => {
  try {
    const inputName = req.params.username.trim().toLowerCase();
    const realUsers = await User.find({}, "name points");

    const targetUser = realUsers.find(u => u.name.toLowerCase() === inputName);

    if (!targetUser) {
      return res.status(404).json({ error: "User not found in real user list" });
    }

    const allUsers = [
      ...realUsers.map(u => ({
        name: u.name,
        points: u.points || 0
      })),
      ...fakeUsers
    ];

    allUsers.sort((a, b) => b.points - a.points);

    const rankIndex = allUsers.findIndex(u => u.name === targetUser.name && u.points === targetUser.points);

    res.json({
      rank: `#${rankIndex + 1}`,
      totalUsers: allUsers.length,
      points: targetUser.points,
      username: targetUser.name
    });

  } catch (err) {
    console.error("World rank route failed:", err);
    res.status(500).json({ error: "Failed to calculate dynamic rank" });
  }
});



// PUT /api/update-points
app.put("/api/update-points", authenticate, async (req, res) => {
  const { points } = req.body;
  if (typeof points !== "number" || points < 0) {
    return res.status(400).json({ error: "Points must be a non-negative number" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { points } },
      { new: true }
    ).select("name points");

    res.json({ success: true, user });
  } catch (err) {
    console.error("Update points error:", err);
    res.status(500).json({ error: "Failed to update points" });
  }
});

// GET /api/leaderboard
app.get("/api/leaderboard", authenticate, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id).select("name points");
    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ Always include "Somosree Dey" if they exist
    const somosreeUser = await User.findOne({ name: "Somosree Dey" }).select("name points");

    const realUsersToInclude = [currentUser];
    if (somosreeUser && somosreeUser._id.toString() !== currentUser._id.toString()) {
      realUsersToInclude.push(somosreeUser);
    }

    const allEntries = [
      ...realUsersToInclude.map(u => ({
        name: u.name,
        points: u.points || 0
      })),
      ...fakeUsers
    ];

    allEntries.sort((a, b) => b.points - a.points);
    res.json(allEntries);
  } catch (err) {
    console.error("Dynamic leaderboard error:", err);
    res.status(500).json({ error: "Failed to generate leaderboard" });
  }
});



// PUT /api/user/change-password
app.put('/api/user/change-password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Both current and new passwords are required.' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    console.error("Password change error:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/user/delete
app.delete("/api/user/delete", authenticate, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ success: true, message: "Account deleted successfully." });
  } catch (err) {
    console.error("Account deletion failed:", err);
    res.status(500).json({ error: "Failed to delete account" });
  }
});

// GET /api/check-user/:id
app.get("/api/check-user/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if the ID is present and is a valid MongoDB ObjectId
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid or missing user ID' });
    }

    const user = await User.findById(id);
    res.json({ exists: !!user });
  } catch (error) {
    console.error("Check-user error:", error);
    res.status(500).json({ exists: false });
  }
});

app.post("/api/submit-feedback", authenticate, async (req, res) => {
  const { feedback } = req.body;
  if (!feedback) return res.status(400).json({ error: "Feedback is required" });

  try {
    const user = await User.findById(req.user.id).select("name email");
    if (!user) return res.status(404).json({ error: "User not found" });

    await Feedback.create({
      userId: req.user.id,
      name: user.name,
      email: user.email,
      feedback,
    });

    res.json({ success: true, message: "Feedback submitted" });
  } catch (err) {
    console.error("Feedback error:", err);
    res.status(500).json({ error: "Failed to submit feedback" });
  }
});


// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


  