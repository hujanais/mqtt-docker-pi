import { Request, Response } from 'express';

import express from 'express';
const router = express.Router();

import { MqttController } from '../controllers/mqtt-controller';
const mqttController = new MqttController();

router.get('/status', (req: Request, res: Response) => {
  const status = mqttController.getStatus();
  res.json(status);
});

export default router;
