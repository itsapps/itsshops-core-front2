import { Context, Config } from '@netlify/functions';

declare const config: Config;
declare function export_default(request: Request, context: Context): Promise<Response>;

export { config, export_default as default };
