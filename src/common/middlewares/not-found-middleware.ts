import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 *
 */
@Injectable()
export class NotFoundMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, path } = req;

    // Check if the route exists
    const routeExists = req.app._router.stack.some((middleware: any) => {
      return middleware.route && middleware.route.path === path;
    });

    if (!routeExists) {
      return res.status(404).json({
        code: 404,
        error: 'Route not found',
      });
    }

    // Check if the method is allowed for the existing route
    const methodAllowed = req.app._router.stack.some((middleware: any) => {
      return (
        middleware.route &&
        middleware.route.path === path &&
        middleware.route.methods[method.toLowerCase()]
      );
    });

    if (!methodAllowed) {
      return res.status(405).json({
        code: 405,
        error: 'HTTP method not allowed',
      });
    }

    next();
  }
}
