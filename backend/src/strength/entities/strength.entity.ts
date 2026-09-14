import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Profile } from '../../profile/entities/profile.entity';

@Entity('strength')
@Index('UQ_strength_profile_sortOrder', ['profileId', 'sortOrder'])
export class Strength {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column({ nullable: true })
  icon?: string;

  @Column({ nullable: true })
  color?: string;

  @Column({ default: 0 })
  sortOrder!: number;

  @Column({ type: 'uuid' })
  profileId!: string;

  @ManyToOne(() => Profile, (profile) => profile.strengths, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'profileId' })
  profile!: Profile;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
