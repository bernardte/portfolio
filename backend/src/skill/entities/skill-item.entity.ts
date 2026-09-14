import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { SkillCategory } from './skill-categories.entity';

@Entity("skill_item")
export class SkillItem {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ length: 50 })
    title!: string;

    @Column({ nullable: true })
    icon?: string;

    @Column({ nullable: true })
    color?: string;

    @Column({ type: 'int', default: 0 })
    sortOrder!: number;

    @Column({ type: "uuid" })
    categoryId!: string;  // Skill category Id

    @ManyToOne(() => SkillCategory, (category) => category.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "categoryId" })
    category!: SkillCategory;

    @CreateDateColumn()
    createdAt!: Date

    @UpdateDateColumn()
    updatedAt!: Date
}