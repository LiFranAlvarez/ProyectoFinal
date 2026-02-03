import { Request, Response, NextFunction } from 'express';

interface ValidatableSchema {
  parse: (data: unknown) => unknown;
}

export const validate = (
  schema: ValidatableSchema,
  source: 'body' | 'params' | 'query' = 'body'
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!schema) {
      return next();
    }
    try {
      schema.parse(req[source]);
      return next();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Validation error';
      return res.status(400).json({
        success: false,
        error: errorMessage,
      });
    }
  };
};

export default validate;
