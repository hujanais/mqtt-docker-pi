import IStatus from '../models/status';
import mqttService from '../services/mqtt-service';

export class MqttController {
  getStatus = (): IStatus => {
    const refCount = mqttService.getStatus();

    const status: IStatus = {
      isOk: false,
      message: `refCount = ${refCount}`,
    };

    return status;
  };
}
