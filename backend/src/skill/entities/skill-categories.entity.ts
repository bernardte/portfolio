import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { SkillItem } from './skill-item.entity';

@Entity('skill_categories')
export class SkillCategory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 50 })
  title!: string; // frontend, backend, tools

  @Column({ nullable: true })
  icon?: string; // caegory icon used

  @Column({ nullable: true })
  color?: string;

  @Column({ type: "int", default: 0 })
  sortOrder!: number; //use for categories sorting

  @Column({ type: "uuid" })
  userId!: string;

  @ManyToOne(() => User, (user) => user.skillsCategory, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "userId" })
  user!: User;

  @OneToMany(() => SkillItem, (item) => item.category)
  items!: SkillItem[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
