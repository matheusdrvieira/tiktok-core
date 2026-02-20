import axios from 'axios';
import { env } from '../config/env';

export const mcpApi = axios.create({
  baseURL: env.MCP_URL,
  timeout: 180_000,
});

export const ttsApi = axios.create({
  baseURL: env.TTS_BASE_URL,
  timeout: 180_000,
  headers: {
    "Content-Type": "application/json",
    "x-raw-response": "true",
  },
  responseType: "arraybuffer",
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
