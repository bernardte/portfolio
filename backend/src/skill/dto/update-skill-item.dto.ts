import { PartialType } from "@nestjs/mapped-types";
import { CreatSkillItemDto } from "./create-skill-item.dto";

export class UpdateSkillItemDto extends PartialType(CreatSkillItemDto) {}