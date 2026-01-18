import { Context } from '@netlify/functions';

declare const preview2: (request: Request, context: Context) => Promise<Response>;

export { preview2 };
