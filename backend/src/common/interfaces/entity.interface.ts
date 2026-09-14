import { ContactMessage } from "../../contact-message/entities/contact-message.entity";
import { Profile } from "../../profile/entities/profile.entity";
import { Project } from "../../project/entities/project.entity";
import { SkillCategory } from "../../skill/entities/skill-categories.entity";
import { SkillItem } from "../../skill/entities/skill-item.entity";
import { Strength } from "../../strength/entities/strength.entity";


export type ResourceEntity = Project | Profile | Strength | SkillCategory | SkillItem;
