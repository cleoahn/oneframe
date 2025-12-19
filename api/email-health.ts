import type { IncomingMessage, ServerResponse } from 'http';

type Res = ServerResponse & { statusCode: number; setHeader: (name: string, value: string) => void; end: (chunk?: string) => void };

export default async function handler(_req: IncomingMessage, res: Res) {
  const hasApiKey = Boolean(process.env.RESEND_API_KEY);
  const hasFromEmail = Boolean(process.env.FROM_EMAIL);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ hasApiKey, hasFromEmail }));
}
