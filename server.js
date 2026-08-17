import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app=express();


// function checkAuth(req,res,next){
//   const loggedIn=false;
//   if(!loggedIn){
//     return res.status(401).json({
//       message:"please login first"
//     });
//   }

//   next();
// }



// function logger(req,res,next){
//   console.log(req.method, req.url);
//   next();
// }

// app.use(logger);
app.use(express.json());


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected!");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true,
    min:18
  },
  email: {
    type: String,
    required: true,
    // match: /.+\@.+\..+/
  },
  password:{
    type: String,
    required: true
  }
});

const User = mongoose.model("User", userSchema);


// app.get("/profile", checkAuth,( req,res)=>{

//   res.json({
//     name: "dev",
//     message: "welcome bhai"
//   });
// });

app.post("/users", async (req, res) => {
  try {
  const user = await User.create({
    name: req.body.name,
    age: req.body.age,
    email: req.body.email
  });
  res.json(user);
  }
  catch(err){
    res.status(500).json({
      message: err.message
    });
  }
});
//get all user 
app.get("/users", async(req,res)=>{

  const users= await User.find();
  res.json(users);

});
//getting one user and now adding error handling too

app.get("/users/:id", async(req,res,next)=>{
  try{
  const user= await User.findById(req.params.id);
  res.json(user);
  }
  catch(err){
    next(err);
  }
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



//our register post route.
app.post("/register", async (req, res,next) => {
  try{

    const {name,age,email,password}= req.body;
    const hashpass=await bcrypt.hash(password,10);
    const user=await User.create({
      name,
      age,
      email,
      password: hashpass
    });

    res.status(201).json({
      message:" user resgisterd",
      user
    });
  }catch (err){
    next(err);
  }
});


//our login route. 

app.post("/login", async (req,res,next)=>{

  try{
    const{email, password}= req.body;

    const user = await User.findOne({email});
    if(!user){
      return res.status(401).json({
        message: " Invalid email or pass"
      });
    }
    const passMatch= await bcrypt.compare(
      password,
      user.password
    );

    if(!passMatch){
      return res.status(401).json({
        message: "invalid email or pass"
      });
    }
    const token = jwt.sign(
      {userId: user.id},
      process.env.JWT_SECRET,
      {expiresIn: "1h"}
    );
    res.json({
      message: "login done",
      token
    });
  } catch(err){
    next(err);
  }
});






//making an error
// app.get("/test-error", (req, res, next) => {
//   // const error = new Error("Something broke!");

//   next(new Error ("smth is brokee hahah"));
// });


//error handlerr
app.use((err, req, res, next)=> {

  console.log(err);
  res.status(500).json({
    message: err.message
  });



}); 

// just checking if bcrypt is working or not.
// const password = "hello123";

// const hashedPassword = await bcrypt.hash(password, 10);

// console.log(hashedPassword);





app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});