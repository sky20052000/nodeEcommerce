const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const config = require("./config/config");
const app = express();
const userRoute = require("./routes/userRoutes");
const productRoute = require("./routes/productRoutes");
const orderRoute = require('./routes/orderRoutes');

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(cors());


// db connection 
mongoose.connect(config.MONGO_URL).then((data)=>{
    console.log("connected to db!");
}).catch((err)=>{
    console.log("no database connection!",err)
});

// set user Routes 
app.use("/api/user", userRoute);
// set product Routes
app.use("/api/product", productRoute);

// set order Routes
app.use("/api/order",orderRoute);

app.listen(config.PORT,()=>{
    console.log(`server listening on the :${config.HOST}:${config.PORT} `);
});