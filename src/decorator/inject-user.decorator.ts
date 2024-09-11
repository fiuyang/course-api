import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const InjectUser = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user.id;
  },
);

export const GetCurrentUser = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    // req.body.user = { id: req.user.id };
    // return req.body;
    return req.user;
  },
);
