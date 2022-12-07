import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class MDailyWordList {
    @PrimaryGeneratedColumn()
    public id: number;

    @Index()
    @Column()
    public userid: string;

    @Column('simple-array', {
        default: '',
    })
    public todayList: number[]

    @Column('simple-array', {
        default: '0, 5'
    })
    public wordPool: [number, number]

    @Column({ default: 0 })
    public current: number;

    @CreateDateColumn()
    public created: number;

    @UpdateDateColumn()
    public updated: number;
}

@Entity()
export class MMemoDailyWordRecordDetail {
    @PrimaryGeneratedColumn()
    public id: number;

    @Index()
    @Column()
    public wordListID: number;

    @Index()
    @Column()
    public vocId: number;

    @Column()
    public rememberCount: number;

    @Column()
    public forgetCount: number;

    @CreateDateColumn()
    public created: number;

    @UpdateDateColumn()
    public updated: number;
}