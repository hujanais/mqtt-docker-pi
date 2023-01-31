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

  postData = async (kwh1: number, kwh2: number, kwh3: number, kwh4: number): Promise<string> => {
    const url = path.join(MONGODB_APIURL, 'insertOne');
    const document: IDocument = {
      dataSource: DATASOURCE,
      database: DATABASE,
      collection: COLLECTION,
      document: {
        timestamp: new Date().valueOf(),
        kwh1,
        kwh2,
        kwh3,
        kwh4,
      },
    };

    const response = await axios
      .post(url, document, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Request-Headers': '*',
          'api-key': APIKEY,
        },
      })
      .catch((err) => {
        console.log(err);
        return err;
      });

    if (response) {
      return response.status;
    } else {
      return 'nada';
    }
  };
}
