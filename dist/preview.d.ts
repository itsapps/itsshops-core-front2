import { Context } from '@netlify/functions';

declare const preview: (request: Request, context: Context) => Promise<Response>;

export { preview };
