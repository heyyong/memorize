import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TableBase } from '@/entity/base';
import { MVocabulary } from "@/entity/vocabularies";

/**
 * This enumerable vairable indicate which
 * list this word belongs to defaultly.
 */
export enum CLA {
    'CET4' = 'CET4',
    'CET6' = 'CET6',
    'TEM8' = 'TEM8',
    'LONGMAN3000' = 'LONGMAN3000',
    'LONGMAN9000' = 'LONGMAN9000',
};

@Entity()
export class MVocSet extends TableBase {
    @Column({ unique: true })
    @Index()
    public name: string;
}

@Entity()
export class MVocSetToVoc extends TableBase {
    @Index()
    @Column()
    @ManyToOne(() => MVocSet, (vocSet) => vocSet.id)
    public setId: number;

    @Index()
    @Column()
    @ManyToOne(() => MVocabulary, (mVoc) => mVoc.id)
    public vocId: number;
}