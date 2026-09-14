import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  projectTitle!: string;

  @Column()
  projectDescription!: string;

  @Column({ type: 'text', array: true })
  projectTechStack!: string[];

  @Column({ nullable: true })
  projectLiveDemoUrl?: string;

  @Column({ nullable: true })
  projectRepositoryUrl?: string;

  @Column({ default: true })
  isPublic!: boolean;

  @Column({ type: 'uuid' })
  userId!: string;

  @Column()
  sortOrder!: number;

  @ManyToOne(() => User, (user) => user.projects, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
