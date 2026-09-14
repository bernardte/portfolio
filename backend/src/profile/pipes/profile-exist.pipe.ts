import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ProfileService } from "../profile.service"

@Injectable()

export class ProfileExistPipe implements PipeTransform {
    constructor(private readonly profileService: ProfileService) {}

    transform(value: any, metadata: ArgumentMetadata) {
        const { type, metatype, data } = metadata;

        if(type === "param"){
            this.profileService.findOneById(value)
        }

        return value;
    }
}