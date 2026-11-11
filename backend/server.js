const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")

const connectDB = require("./config/db")
const authRoutes = require("./routes/authRoutes")
const taskRoutes = require("./routes/taskRoutes");

dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())

app.use("/api/auth", authRoutes)
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res)=>{
    res.send("Task Manager Api is Running")
})

app.get("/api/health", (req, res) => {
  res.status(200).json({
    message: "Backend is connected successfully"
  });
});

//start server 

const startServer = async () =>{
    try{
        await connectDB();
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, "0.0.0.0", () => {
  console.log(`SERVER IS RUNNING AT ${PORT}`);
});
    }
    catch(error){
        console.log(error.message)
        process.exit(1);
    }
}

startServer()