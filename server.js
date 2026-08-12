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
//get all user 
app.get("/users", async(req,res)=>{

  const users= await User.find();
  res.json(users);

});
//getting one user
app.get("/users/:id", async(req,res)=>{
  const user= await User.findById(req.params.id);
  res.json(user);
});

//update a user by id
app.put("/users/:id", async(req,res)=>{
  const user= await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      age: req.body.age,
      email: req.body.email
    },{new: true}  
  );

    res.json(user);

});


app.delete("/users/:id", async(req,res)=>{

  const user=await User.findByIdAndDelete(req.params.id);
  res.json(user);

});




app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});