import { Request, Response, NextFunction } from 'express';

import HttpError from '../utils/httpError';

function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  console.error('--- INTERNAL ERROR LOG ---');
  console.error(err);

  if (err instanceof HttpError) {
    return res.status(err.status || 500).json({ success: false, error: err.message });
  }

  if (err && typeof err === 'object' && 'name' in err && err.name === 'ValidationError') {
    const validationError = err as unknown as { message: string };

    return res.status(400).json({
      success: false,
      error: validationError.message,
    });
  }

  return res.status(500).json({ success: false, error: 'Internal Server Error' });
}

export default errorHandler;

