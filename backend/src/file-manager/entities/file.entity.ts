import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';

export enum FileOwnerType {
  PROFILE = 'profile',
  PROJECT = 'project',
  SKILL_CATEGORY = 'skill_category',
  SKILL_ITEM = 'skill_item',
  STRENGTH = 'strength'
}

export enum FileCategory {
  AVATAR = 'avatar',
  RESUME = 'resume',
  PROJECT_IMAGE = 'project_image',
  SKILL_CATEGORY_ICON = 'skill_category_icon',
  SKILL_ITEM_ICON = 'skill_item_icon',
  STRENGTH = 'strength_icon'
}

export enum FileResourceType {
  IMAGE = 'image',
  RAW = 'raw',
}

@Entity('files')
@Index(['ownerId', 'ownerType', 'category'])
export class File {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * Cloudinary public_id
   */
  @Column({ unique: true })
  publicId!: string;

  /**
   * Original filename uploaded by user
   */
  @Column()
  fileOriginalName!: string;

  /**
   * MIME type
   *
   * Example:
   * image/jpeg
   * image/png
   * application/pdf
   */
  @Column()
  fileMimeType!: string;

  /**
   * ID of the resource that owns this file.
   *
   * Example:
   * Profile ID
   * Project ID
   */
  @Column({ type: 'uuid', nullable: true })
  ownerId?: string | null;

  /**
   * Type of resource that owns this file.
   *
   * profile
   * project
   */
  @Column({
    type: 'enum',
    enum: FileOwnerType,
    nullable: true,
  })
  ownerType!: FileOwnerType | null;

  /**
   * File size in bytes
   */
  @Column()
  fileSize!: number;

  /**
   * Cloudinary secure URL
   */
  @Column()
  secureUrl!: string;

  /**
   * Business purpose of the file.
   *
   * Example:
   * avatar
   * resume
   * project_image
   */
  @Column({
    type: 'enum',
    enum: FileCategory,
  })
  category!: FileCategory;

  /**
   * Cloudinary resource type.
   *
   * image
   * raw
   */
  @Column({
    type: 'enum',
    enum: FileResourceType,
  })
  resourceType!: FileResourceType;

  /**
   * Whether this file requires signed URL access.
   *
   * Avatar       -> false
   * Resume       -> true
   */
  @Column({ default: true })
  isPrivate!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
