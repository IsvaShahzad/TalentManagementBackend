import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';          // ✅ import cors
import { userRoute } from './routes/userRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 7000;

app.use(express.json());
app.use(cors());                 // ✅ enable CORS for all routes

// Routes
app.use('/api/user', userRoute);

app.get("/test", (req, res) => {
    res.send("✅ API is working");
});

app.listen(PORT, () => {
    console.log(`server on port ${PORT}`);
});
