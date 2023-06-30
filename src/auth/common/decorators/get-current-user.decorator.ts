import { ExecutionContext, createParamDecorator } from '@nestjs/common';

interface JwtPayloadWithRt {
  sub: string;
  refresh_token: string;
  email: string;
}
export const GetCurrentUser = createParamDecorator(
  (data: keyof JwtPayloadWithRt | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    console.log(request.user);
    if (!data) return request.user;
    return request.user[data];
  },
);
