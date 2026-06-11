"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const contactSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string().optional(),
    subject: zod_1.z.string().optional(),
    message: zod_1.z.string().min(5),
});
// POST /api/contact
router.post('/', async (req, res) => {
    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.flatten() });
        return;
    }
    const { name, email, phone, subject, message } = parsed.data;
    console.log(`[Contact] ${name} <${email}>${phone ? ` | ${phone}` : ''} | ${subject ?? 'General'}: ${message}`);
    res.json({ ok: true });
});
exports.default = router;
//# sourceMappingURL=contact.js.map