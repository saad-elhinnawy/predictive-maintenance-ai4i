import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: Role;
    };
}
export declare function authenticate(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
export declare function requireAdmin(req: AuthRequest, res: Response, next: NextFunction): void;
//# sourceMappingURL=auth.d.ts.map