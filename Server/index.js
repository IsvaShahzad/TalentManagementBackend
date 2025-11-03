import express from 'express';
import cors from 'cors';
import { userRoute } from './routes/userRoutes.js';
import { candidateRoute } from './routes/candidateRoutes.js';
import path from 'path'
import { fileURLToPath } from 'url'

const app = express();
const PORT = process.env.PORT || 7000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/user', userRoute);
app.use('/api/candidate', candidateRoute);
// Create __dirname manually
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/uploads/resumes/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads/resumes', req.params.filename);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline'); // not attachment
  res.sendFile(filePath);
});


// Now you can use __dirname...publically available
//app.use('/uploads/resumes', express.static(path.join(__dirname, 'uploads/resumes')))



// Test route
app.get('/test', (req, res) => res.send('API is running!'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
