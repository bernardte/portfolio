import { Transform } from "class-transformer";
import { IsBoolean, IsString } from "class-validator";

export class UpdateProjectVisibilityDto {
    @Transform(({ value}) => value === "true" || value === true)
    @IsBoolean()
    isPublic!: boolean;
}