import axios from 'axios';
import http from 'node:http';
import https from 'node:https';
import { env } from '../config/env';

export const api = axios.create({
  baseURL: env.BACKEND_URL,
  timeout: 120_000,
  httpAgent: new http.Agent({ keepAlive: false }),
  httpsAgent: new https.Agent({ keepAlive: false }),
});

export const getAxiosErrorMessage = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const data = err.response?.data;

    if (status) {
      return `status ${status}${data ? `: ${JSON.stringify(data)}` : ''}`;
    }

    return `${err.code ?? 'NETWORK_ERROR'}: ${err.message}`;
  }

  return err instanceof Error ? err.message : 'Unknown error';
};
