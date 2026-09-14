import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator(
    (data: Record<string, string>, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest()
        return request.user;
    }
)