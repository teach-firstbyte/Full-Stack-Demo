import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { habitsRouter } from './routes/habits.js';
import { completionsRouter } from './routes/completions.js';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors({ origin: true }));
app.use(express.json());

app.use('/api/habits', habitsRouter);
app.use('/api/completions', completionsRouter);

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
