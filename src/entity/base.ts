import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export class TableBase {
    @PrimaryGeneratedColumn()
    public id: number;

    @CreateDateColumn()
    public created: number;

    @UpdateDateColumn()
    public updated: number;
}