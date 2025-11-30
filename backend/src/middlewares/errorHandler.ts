import { Request, Response, NextFunction } from 'express';
import HttpError from '../utils/httpError.js';

function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  console.error('ERROR HANDLER:', err);

  if (err instanceof HttpError) {
    return res.status(err.status || 500).json({ success: false, error: err.message });
  }

  if (err && err.name === 'ValidationError') {
    return res.status(400).json({ success: false, error: err.message });
  }

  return res.status(500).json({ success: false, error: 'Internal Server Error' });
}

export default errorHandler;
