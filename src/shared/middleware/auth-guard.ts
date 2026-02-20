import { Elysia } from 'elysia';
import { auth } from '../lib/better-auth';

export const authGuard = new Elysia({ name: 'better-auth' })
  .mount(auth.handler)
  .macro({
    auth: {
      async resolve({ status, request: { headers } }) {
        try {
          const session = await auth.api.getSession({
            headers,
          });

          if (!session) {
            return status(401, { message: 'Não autenticado.' });
          }

          return {
            user: session.user,
            session: session.session,
          };
        } catch (err) {
          return status(500, { message: 'Falha ao validar sessão.' });
        }
      },
    },
  });
