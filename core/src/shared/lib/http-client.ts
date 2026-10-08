import axios, { type CreateAxiosDefaults } from 'axios';
import { env } from '../config/env';

const stringifyData = (data: unknown): string => {
  if (typeof data === 'string') {
    return data;
  }

  try {
    return JSON.stringify(data);
  } catch {
    return String(data);
  }
};

export const createHttpClient = (config: CreateAxiosDefaults = {}) =>
  axios.create(config);

export const mcpApi = createHttpClient({
  baseURL: env.MCP_URL,
  timeout: 180_000,
});

export const ttsApi = createHttpClient({
  baseURL: env.TTS_BASE_URL,
  timeout: 7_200_000,
  headers: {
    "Content-Type": "application/json",
  },
  responseType: "arraybuffer",
});

export const getAxiosErrorMessage = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const data = err.response?.data;

    if (status) {
      return `status ${status}${data ? `: ${stringifyData(data)}` : ''}`;
    }

    return `${err.code ?? 'NETWORK_ERROR'}: ${err.message}`;
  }

  return err instanceof Error ? err.message : 'Unknown error';
};
