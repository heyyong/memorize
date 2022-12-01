import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Index()
    @Column()
    public username: string;

    @Index()
    @Column()
    public token: string;

    @CreateDateColumn()
    public created: number;

    @UpdateDateColumn()
    public updated: number;
}