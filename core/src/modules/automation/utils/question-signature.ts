import { createHash } from 'node:crypto';

export const normalizeQuestionText = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ');

export const buildQuestionHash = (question: string): string =>
  createHash('sha256')
    .update(normalizeQuestionText(question))
    .digest('hex');

export const buildReferenceKey = (niche: string, reference: string): string =>
  normalizeQuestionText(`${niche}:${reference}`);
