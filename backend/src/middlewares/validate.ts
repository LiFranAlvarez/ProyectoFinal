import { Request, Response, NextFunction } from 'express';

export const validate = (schema: any, source: 'body' | 'params' | 'query' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!schema) return next();
    try {
      // Zod
      if (schema && typeof schema.parse === 'function') {
        schema.parse(req[source]);
        return next();
      }
      console.warn('validate: unsupported schema type');
      return next();
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err?.message || 'Validation error' });
    }
  };
};

export default validate;
