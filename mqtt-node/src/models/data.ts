// data structure for MongoDB
export interface IDocument {
  dataSource: string;
  database: string;
  collection: string;
  document: {
    timestamp: number;
    kwh1: number;
    kwh2: number;
    kwh3: number;
    kwh4: number;
  };
}

// data structure from HomeAssistant.
export interface IHassData {
  kwh1: number;
  kwh2: number;
  kwh3: number;
  kwh4: number;
}
