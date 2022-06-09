import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm'

@Entity()
export class Voc {
    @PrimaryGeneratedColumn()
    public id: number;

    @Index()
    @Column({ unique: true, })
    public voc: string;

    @Index()
    @Column({
        default: 'default'
    })
    public cla: string;

    @CreateDateColumn()
    public created: number;

    @UpdateDateColumn()
    public updated: number;
}

@Entity()
export class Property {
    @PrimaryGeneratedColumn()
    public id: number;

    @Index()
    @Column()
    public voc: string;

    @Index()
    @Column()
    public prop: string;

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
    public voc: string;

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

@Entity()
export class MemorizedPlan {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public from: number;

    @Column()
    public to: number;

    @Column({ default: 0, nullable: true })
    public rFrom: number;

    @Column({ default: 0, nullable: true })
    public rTo: number;

    @Column('simple-array', {
    })
    public rand: string[];

    @Column({
        default: -1,
    })
    public memorized: number;

    @Column('simple-array')
    public memorizing: string[] = [];

    @CreateDateColumn()
    public created: number;

    @Column({
        default: 0,
    })
    public finished: boolean;

    @UpdateDateColumn()
    public updated: number;
}

@Entity()
export class MemorizedRecord {
    @PrimaryGeneratedColumn()
    public id: number;

    @Index()
    @Column()
    public voc: string;

    @Column({ default: 0 })
    public count: number;

    @Column({ default: 0 })
    public err_count: number;

    @Index()
    @Column()
    public memorized_plan_id: number;

    @CreateDateColumn()
    public created: number;

    @UpdateDateColumn()
    public updated: number;
}