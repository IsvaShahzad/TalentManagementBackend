import express from 'express';
import cors from 'cors';
import { userRoute } from './routes/userRoutes.js';

const app = express();
const PORT = process.env.PORT || 7000;

app.use(cors());
app.use(express.json());

// Register routes
app.use('/api/user', userRoute);

// Test route
app.get('/test', (req, res) => res.send('API is running!'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
