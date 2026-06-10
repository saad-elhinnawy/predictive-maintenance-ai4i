import { Router, Request, Response } from 'express';
import { z } from 'zod';

const router = Router();

const contactSchema = z.object({
  name:    z.string().min(2),
  email:   z.string().email(),
  phone:   z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(5),
});

// POST /api/contact
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.flatten() }); return; }

  const { name, email, phone, subject, message } = parsed.data;
  console.log(`[Contact] ${name} <${email}>${phone ? ` | ${phone}` : ''} | ${subject ?? 'General'}: ${message}`);

  res.json({ ok: true });
});

export default router;
