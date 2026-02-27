export const remotionTemplateIds = [
  'comic-pop',
  'neon-pulse',
  'sunset-wave',
] as const;

export type RemotionTemplateId = (typeof remotionTemplateIds)[number];
