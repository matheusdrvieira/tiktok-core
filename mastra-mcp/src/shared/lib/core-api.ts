import http from 'node:http';
import https from 'node:https';
import { env } from '../config/env';
import { createHttpClient, getAxiosErrorMessage } from './http-client';

export const api = createHttpClient({
  baseURL: env.BACKEND_URL,
  timeout: 120_000,
  httpAgent: new http.Agent({ keepAlive: false }),
  httpsAgent: new https.Agent({ keepAlive: false }),
});

export { getAxiosErrorMessage };
