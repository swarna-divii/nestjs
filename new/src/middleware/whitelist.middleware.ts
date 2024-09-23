import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class WhitelistMiddleware implements NestMiddleware {
  private whitelist = ['127.0.0.1', '::1']; // Add IPs to whitelist

  use(req: Request, res: Response, next: NextFunction) {
    const clientIp = req.ip;
    if (this.whitelist.includes(clientIp)) {
      next();
    } else {
      throw new UnauthorizedException('IP not whitelisted');
    }
  }
}