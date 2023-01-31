import * as mqtt from 'mqtt';
import { IHassData } from '../models/data';
import IStatus from '../models/status';
import { MongoDBService } from './mongodb-service';

const MQTT_TOPIC = process.env.MQTT_TOPIC || '';
const MQTT_SERVER = process.env.MQTT_SERVER || '';
const BUFFER_SIZE = 50;

class MqttService {
  private mongoApi = new MongoDBService();
  private statusBuffer: IStatus[] = [];

  constructor() {
    let client = mqtt.connect(MQTT_SERVER);

    client.on('connect', () => {
      this.addStatus(`mqtt connection established with ${MQTT_SERVER}`);
      client.subscribe(MQTT_TOPIC, (err) => {
        if (err) {
          this.addStatus(`topic=${MQTT_TOPIC} subscription failed with ${err}`);
        } else {
          this.addStatus(`topic=${MQTT_TOPIC} subscribed`);
        }
      });
    });

    client.on('message', async (topic: string, message: IHassData) => {
      this.addStatus(`topic = ${topic}, message = ${message}`);
      if (topic === MQTT_TOPIC) {
        const resp = await this.mongoApi.postData(message.kwh1, message.kwh2, message.kwh3, message.kwh4);
        this.addStatus(`http status = ${resp}`);
      }
    });
  }

  getStatus = (): IStatus[] => {
    return this.statusBuffer;
  };

  addStatus = (message: string) => {
    const newStatusItem: IStatus = {
      localTimeString: new Date().toLocaleString(),
      message: message,
    };

    this.statusBuffer.unshift(newStatusItem);

    if (this.statusBuffer.length > BUFFER_SIZE) {
      this.statusBuffer.pop();
    }

    console.log(`${newStatusItem.localTimeString} - ${newStatusItem.message}`);
  };
}

const instance = new MqttService();
export default instance;
