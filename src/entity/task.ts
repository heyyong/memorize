import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column('simple-array', {
        default: '',
    })
    public claList: string[];

    @Column({ default: -1 })
    public total: number;

    @Column({ default: 0 })
    public complete: number;

    @Column({
        default: 0
    })
    public finished: boolean;

    @CreateDateColumn()
    public created: number;

    @UpdateDateColumn()
    public updated: number;
}