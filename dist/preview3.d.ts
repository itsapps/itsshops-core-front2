import { Context } from '@netlify/functions';

declare const preview3: (request: Request, context: Context) => Promise<Response>;

export { preview3 };
