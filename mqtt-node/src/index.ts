import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
const app = express();
import apiRouter from './routes/mqtt-route';
import mqttService from './services/mqtt-service';

const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', apiRouter);

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
