import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
const app=express();
app.use(express.json());
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected!");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  email: String
});

const User = mongoose.model("User", userSchema);

app.post("/users", async (req, res) => {
  const user = await User.create({
    name: req.body.name,
    age: req.body.age,
    email: req.body.email
  });

  res.json(user);
});

app.get("/users", async(req,res)=>{

  const users= await User.find();
  res.json(users);

});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});