import { qaEnvironment } from './environment.qa';
import { prodEnvironment } from './environment.prod';

export const devEnvironment = {
  production: false,
  apiEndPoint: 'http://localhost:3000/api/',
  pageSize: 10,
  appVersion: '1.0.0',
};
export const environment = devEnvironment;
