import IStatus from '../models/status';
import mqttService from '../services/mqtt-service';

export class MqttController {
  getStatus = (): IStatus[] => {
    return mqttService.getStatus();
  };
}
