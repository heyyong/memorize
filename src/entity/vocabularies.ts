import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm'


@Entity()
export class Voc {
    @PrimaryGeneratedColumn()
    public id: number;

    @Index()
    @Column({ unique: true, })
    public voc: string;

    @Index()
    @Column()
    public originDict: string;

    @Index()
    @Column()
    public sync: boolean;

    @CreateDateColumn()
    public created: number;

    @UpdateDateColumn()
    public updated: number;
}

export enum VocProperty {
    'verb' = 'verb',
    'noun' = 'noun',
    'conj' = 'conj',
    'prep' = 'prep',
    'adj' = 'adj',
    'adv' = 'adv',
    'pron' = 'pron',
    'article' = 'article',
}

@Entity()
export class Property {
    @PrimaryGeneratedColumn()
    public id: number;

    @Index()
    @Column()
    public voc_id: number;

    @Index()
    @Column()
    public prop: VocProperty;

    @CreateDateColumn()
    public created: number;

    @UpdateDateColumn()
    public updated: number;
}

@Entity()
export class Pronunciation {
    @PrimaryGeneratedColumn()
    public id: number;

    @Index()
    @Column()
    public voc_id: number;

    @Index()
    @Column()
    public prop_id: number;

    @Column()
    public audio: string;

    @Column()
    public phonetic: string;

    @CreateDateColumn()
    public created: number;

    @UpdateDateColumn()
    public updated: number;
}

@Entity()
export class Meaning {
    @PrimaryGeneratedColumn()
    public id: number;

    @Index()
    @Column()
    public voc: string;

    @Column()
    public content: string;

    @Index()
    @Column()
    public propId: number;

    @CreateDateColumn()
    public created: number;

    @UpdateDateColumn()
    public updated: number;
}

@Entity()
export class Example {
    @PrimaryGeneratedColumn()
    public id: number;

    @Index()
    @Column()
    public voc: string;

    @Index()
    @Column()
    public meanId: number;

    @Column()
    public example: string;

    @CreateDateColumn()
    public created: number;

    @UpdateDateColumn()
    public updated: number;
}
