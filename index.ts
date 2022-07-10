import express, { Request, Response, NextFunction } from 'express';
import { userRouter } from './users/users.js';

const app = express();

app.use('/hello', (req, res, next) => {
  console.log('Time": ', Date.now());
  next();
});

const port = 8000;

app.listen(port, () => {
  console.log(`Server is listening port ${port}`);
});

app.get('/error', () => {
  throw new Error('Error!');
});

app.use('/users', userRouter);

app.get('/hello', (req, res) => {
  res.send('Wazzup!');
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err.message);
  res.status(500).send(err.message);
});