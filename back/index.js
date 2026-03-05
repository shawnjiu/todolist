require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const todoRoutes = require("./routes/todo.routes.js");
const connectDB = require("./models/mongoose.js");
const path = require('path');

 
 

 

const app = express()


app.use(express.static(path.join(__dirname, "public")));





app.use(cors())
app.use(express.json())
connectDB();


app.use("/api/todos", todoRoutes)

 if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../front/dist")));

  app.get('/:any*', (req, res) => {
  res.sendFile(path.join(__dirname, 'front/dist/index.html'));
});
}


const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}.....`)
})
