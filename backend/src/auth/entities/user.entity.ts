import {
  Column,
  CreateDateColumn,
  OneToOne,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Profile } from '../../profile/entities/profile.entity';
import { Project } from '../../project/entities/project.entity';
import { SkillCategory } from '../../skill/entities/skill-categories.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  name!: string;

  @OneToOne(() => Profile, (profile) => profile.user)
  profile!: Profile;

  @OneToMany(() => Project, (project) => project.user)
  projects!: Project[];

  @OneToMany(() => SkillCategory, (category) => category.user)
  skillsCategory!: SkillCategory[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
