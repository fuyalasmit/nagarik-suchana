import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../config/database';

export async function basicAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Basic ')) return res.status(401).json({ error: 'Missing Basic auth' });

    const b64 = auth.slice(6);
    const decoded = Buffer.from(b64, 'base64').toString('utf8'); // "email:password"
    const [email, password] = decoded.split(':');
    if (!email || !password) return res.status(401).json({ error: 'Invalid auth format' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    req.authUser = { id: user.id, email: user.email, name: user.name };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Authentication failed' });
  }
}