import { z } from 'zod';
import { insertCertificateSchema, certificates } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  certificates: {
    list: {
      method: 'GET' as const,
      path: '/api/certificates',
      responses: {
        200: z.array(z.custom<typeof certificates.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/certificates',
      input: insertCertificateSchema,
      responses: {
        201: z.custom<typeof certificates.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
