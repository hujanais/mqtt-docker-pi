import path from 'path';
const MONGODB_APIURL = process.env.MONGODB_APIURL || '';
const APIKEY = process.env.MONGO_APIKEY || '';
const DATASOURCE = process.env.DATASOURCE || '';
const DATABASE = process.env.DATABASE || '';
const COLLECTION = process.env.COLLECTION || '';
import axios from 'axios';
import { IDocument } from '../models/data';
import IStatus from '../models/status';

export class MongoDBService {
  constructor() {}

  postData = async (kwh1: number, kwh2: number, kwh3: number, kwh4: number,  kwh5: number,  kwh6: number,  kwh7: number,  kwh8: number): Promise<string> => {
    const url = path.join(MONGODB_APIURL, 'insertOne');
    const document: IDocument = {
      dataSource: DATASOURCE,
      database: DATABASE,
      collection: COLLECTION,
      document: {
        timestamp: new Date().valueOf(),
        kwh1: kwh1,
        kwh2: kwh2,
        kwh3: kwh3,
        kwh4: kwh4,
        kwh5: kwh5,
        kwh6: kwh6,
        kwh7: kwh7,
        kwh8: kwh8,
      },
    };

    let message = '';
    await axios
      .post(url, document, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Request-Headers': '*',
          'api-key': APIKEY,
        },
      })
      .then((resp) => {
        message = resp.status.toString();
      })
      .catch((err) => {
        message = err.toString();
      });

    return message;
  };
}
