import axios from 'axios';
import { env } from '../config/env';
import { createHttpClient, getAxiosErrorMessage } from './http-client';

const SERVICE_NAME = 'core';
const DISCORD_EMBED_TITLE_LIMIT = 256;
const DISCORD_EMBED_DESCRIPTION_LIMIT = 4_096;
const DISCORD_FIELD_VALUE_LIMIT = 1_024;

const discordWebhookApi = createHttpClient({
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const truncate = (value: string, limit: number): string =>
  value.length <= limit
    ? value
    : `${value.slice(0, Math.max(limit - 16, 0))}\n...[truncated]`;

const stringifyUnknown = (value: unknown): string => {
  if (typeof value === 'string') {
    return value;
  }

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

const buildErrorDescription = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const method = error.config?.method?.toUpperCase();
    const requestUrl = [error.config?.baseURL, error.config?.url]
      .filter(Boolean)
      .join('');

    return [
      method && requestUrl ? `${method} ${requestUrl}` : '',
      getAxiosErrorMessage(error),
      error.stack ?? '',
    ]
      .filter(Boolean)
      .join('\n\n');
  }

  if (error instanceof Error) {
    return error.stack ?? `${error.name}: ${error.message}`;
  }

  return stringifyUnknown(error);
};

export const notifyDiscordError = async (
  context: string,
  error: unknown,
  extra?: Record<string, unknown>,
): Promise<void> => {
  if (!env.DISCORD_ERROR_WEBHOOK_URL) {
    return;
  }

  try {
    await discordWebhookApi.post(env.DISCORD_ERROR_WEBHOOK_URL, {
      username: 'quizzio-errors',
      embeds: [
        {
          title: truncate(context, DISCORD_EMBED_TITLE_LIMIT),
          description: truncate(
            buildErrorDescription(error),
            DISCORD_EMBED_DESCRIPTION_LIMIT,
          ),
          color: 15_158_332,
          fields: [
            {
              name: 'Service',
              value: SERVICE_NAME,
              inline: true,
            },
            {
              name: 'Environment',
              value: env.NODE_ENV,
              inline: true,
            },
            ...(extra && Object.keys(extra).length > 0
              ? [
                  {
                    name: 'Extra',
                    value: truncate(
                      stringifyUnknown(extra),
                      DISCORD_FIELD_VALUE_LIMIT,
                    ),
                  },
                ]
              : []),
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    });
  } catch (discordError) {
    console.error('[discord][core] failed to send error notification:', discordError);
  }
};

export const logAndReportError = (
  context: string,
  error: unknown,
  extra?: Record<string, unknown>,
): void => {
  console.error(context, error);
  void notifyDiscordError(context, error, extra);
};
