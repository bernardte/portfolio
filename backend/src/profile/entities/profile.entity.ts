import {
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Entity,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Strength } from '../../strength/entities/strength.entity';
import { ContactMessage } from '../../contact-message/entities/contact-message.entity';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    nullable: true,
    length: 100,
  })
  highestEducationLevel?: string;

  @Column({
    nullable: true,
    length: 100,
  })
  location?: string;

  @Column({ nullable: true })
  slug?: string;

  @Column({
    nullable: true,
    length: 255,
  })
  linkedinLink?: string;

  @Column({
    nullable: true,
    length: 255,
  })
  bio?: string;

  @Column({
    nullable: true,
    length: 255,
  })
  githubLink?: string;

  @Column({ type: 'uuid', unique: true })
  userId!: string;

  @OneToOne(() => User, (user) => user.profile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @OneToMany(() => Strength, (strength) => strength.profile)
  strengths!: Strength[];

  @OneToMany(() => ContactMessage, (contactMessage) => contactMessage.profile)
  contactMessages!: ContactMessage[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
