import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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
export class VocSet {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ unique: true })
    @Index()
    public name: string;

    @CreateDateColumn()
    public created: number;

    @UpdateDateColumn()
    public updated: number;
}

@Entity()
export class VocSetToVoc {
    @PrimaryGeneratedColumn()
    public id: number;

    @Index()
    @Column()
    public setId: number;

    @Index()
    @Column()
    public vocId: number;

    @CreateDateColumn()
    public created: number;

    @UpdateDateColumn()
    public updated: number;
}