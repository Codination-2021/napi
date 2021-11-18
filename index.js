const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
const router = express.Router();
const path = require("path");
const data = require("./models/Data");
const cors = require("cors");

dotenv.config();

mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log(process.env.MONGO_URL);
    console.log("Connected to MongoDB");
  }
);
app.use("/images", express.static(path.join(__dirname, "public/images")));

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(cors({origin: "http://localhost:3000"}))

app.post("/fetchMessage", (req,res) => {
  const {message} = req.body;
  const msgsplit = message.toLowerCase().split(" ");
  console.log(req.body);
  let responseMessages = []
  for(var i=0; i < data.length; i++){    
    if(message.toLowerCase().includes(data[i].key.toLowerCase()))
    {
      console.log(data[i], i);
      responseMessages.push(data[i])
    }    
    else{
      console.log("Nahi Mila");
    }
  }
  if(responseMessages.length == 0)
  {
    res.json({success: false})
  }
  else{
    res.json({ 
      success: true ,
      messages: responseMessages});
  }
  
  
  // data.filter((item)=> {

  // })
})

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);

app.listen(8800, () => {
  console.log("Backend server is running!");
});


