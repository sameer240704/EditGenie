import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import connectToDatabase from "./db/database.js";
import bodyParser from "body-parser";

// Import Routes
import authRoute from "./routes/auth.route.js";

const app = express();

dotenv.config();

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middlewares
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.use("/auth", authRoute);

// Connect to the database
connectToDatabase();

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server listening to PORT ${PORT}`);
});