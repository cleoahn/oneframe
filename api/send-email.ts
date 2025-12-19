import { Resend } from 'resend';
import type { IncomingMessage, ServerResponse } from 'http';

const resend = new Resend(process.env.RESEND_API_KEY as string);

type JsonBody = { to?: string; subject?: string; html?: string };
type Req = IncomingMessage & { method?: string; body?: JsonBody };
type Res = ServerResponse & { statusCode: number; setHeader: (name: string, value: string) => void; end: (chunk?: string) => void };

export default async function handler(req: Req, res: Res) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end('Method Not Allowed');
    return;
  }

  try {
    const { to, subject, html } = req.body || {};
    if (!to || !subject || !html) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'invalid-payload' }));
      return;
    }

    const from = process.env.FROM_EMAIL as string;
    if (!from) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: 'missing-from-email' }));
      return;
    }

    const { data, error } = await resend.emails.send({ from, to, subject, html });
    if (error) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error }));
      return;
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ id: data?.id }));
  } catch {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'send-failed' }));
  }
}
