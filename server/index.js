import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from "./routes/authRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import flightRoutes from "./routes/flightRoutes.js"
import customerRoutes from "./routes/customerRoutes.js"
import paymentRoutes from "./routes/paymentRoutes.js"
const app = express();

app.use(express.json());
app.use(bodyParser.json({limit: "30mb", extended: true}))
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());
app.use(authRoutes,adminRoutes,flightRoutes,customerRoutes,paymentRoutes)

const PORT = process.env.PORT || 6001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/FlightBookingMERN';

mongoose.connect(MONGO_URI, { 
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
).then(()=>{
    console.log("Connected to db")
}
).catch((e)=> console.log(`Error in db connection ${e}`));

        app.listen(PORT, ()=>{
            console.log(`Running @ ${PORT}`);
        });