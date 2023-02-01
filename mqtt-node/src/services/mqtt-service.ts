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

    client.on('message', async (topic: string, message: Buffer) => {
      if (topic === MQTT_TOPIC) {
        const hassData: IHassData = JSON.parse(message.toString());
        await this.mongoApi
          .postData(hassData.kwh1, hassData.kwh2, hassData.kwh3, hassData.kwh4)
          .then((resp) => {
            this.addStatus(`topic = ${topic}, message = ${message}. statuscode = ${resp}`);
          })
          .catch((err) => {
            this.addStatus(`topic = ${topic}, message = ${message}. error = ${err}`);
          });
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
