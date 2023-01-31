import * as mqtt from 'mqtt';

class MqttService {
  private nCounts: number = 0;

  constructor() {
    let client = mqtt.connect('http://192.168.1.70:9001');

    client.on('connect', function () {
      console.log('mqtt-connect');
      client.subscribe('myTopic', function (err) {
        console.log('triggered');
        if (!err) {
          client.publish('presence', 'Hello mqtt');
        }
      });
    });

    client.on('message', function (topic, message) {
      // message is Buffer
      console.log('incoming', topic, message.toString());
      //   client.end();
    });

    console.log('ctor MqttService');
    this.nCounts = 1;
  }

  getStatus = () => {
    return this.nCounts;
  };
}

const instance = new MqttService();
export default instance;
