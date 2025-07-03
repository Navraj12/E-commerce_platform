import dotenv from 'dotenv';
import express, { Application, Request, Response } from 'express';
import './database/connection';
// import './model/index';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

app.get('/about', (req: Request, res: Response) => {
  res.send('About Page');
});

app.listen(PORT, () => {
  console.log('server is running on port', PORT);
});
