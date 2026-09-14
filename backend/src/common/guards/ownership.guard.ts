import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { OwnershipMetadata } from '../decorators/ownership.decorator';
import { DataSource } from 'typeorm';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly dataSource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const option = this.reflector.getAllAndOverride(OwnershipMetadata, [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log('🔥 OwnershipGuard');
    console.log('Handler:', context.getHandler().name);
    console.log('Class:', context.getClass().name);
    console.log('Ownership option:', option);

    if (!option) {
      return true;
    }

    const { resourceEntity, param = 'id' } = option;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const resourceEntityId = request.params[param];

    if (!user) return false;

    if (!resourceEntityId) return false;

    const repository = this.dataSource.getRepository(resourceEntity);

    const resource = await repository.find({
      where: {
        id: resourceEntityId,
        userId: user.id,
      },
    });

    if (!resource) {
      throw new NotFoundException('Resources not found!');
    }

    request.resource = resource;

    return true;
  }
}
