import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Entity, ManyToOne, JoinColumn } from "typeorm";
import { Profile } from "../../profile/entities/profile.entity";

@Entity('contact_message')
export class ContactMessage {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  profileId!: string;

  @ManyToOne(() => Profile, (profile) => profile.contactMessages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'profileId' })
  profile!: Profile;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  subject!: string;

  @Column()
  message!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
