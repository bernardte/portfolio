import { Reflector } from '@nestjs/core';
import { ResourceEntity } from '../interfaces/entity.interface';
import { EntityTarget } from 'typeorm';
export const OwnershipMetadata = Reflector.createDecorator<OwnershipOptions>();

export function Ownership({ resourceEntity, param }: OwnershipOptions) {
  return applyDecorators(
    UseGuards(JwtAuthGuard),
    UseGuards(OwnershipGuard),
    OwnershipMetadata({ resourceEntity, param }),
  );
}import { applyDecorators, UseGuards } from '@nestjs/common';
import { OwnershipGuard } from '../guards/ownership.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

export interface OwnershipOptions {
  resourceEntity: EntityTarget<ResourceEntity>;
  param?: string;
}


